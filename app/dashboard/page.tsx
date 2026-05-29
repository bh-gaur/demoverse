import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await auth();

  // Authentication barrier
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  // Authorization barrier (Only vendors or admins)
  const role = session.user.role || "";
  if (role !== "vendor" && role !== "admin") {
    return (
      <div className="bg-card border border-border p-8 rounded-xl max-w-md mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">Unauthorized Access</h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your current account role does not have authorization to view the vendor dashboard. Only registered vendors or administrators can access these panels.
        </p>
      </div>
    );
  }

  // Fetch all demo video requests
  const demoRequests = await prisma.demoRequest.findMany({
    include: {
      platform: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch all platforms (to select in video uploads)
  const platforms = await prisma.platform.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <DashboardClient
      initialRequests={demoRequests}
      platforms={platforms}
    />
  );
}
