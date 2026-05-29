import { auth } from "@/lib/auth";
import SubmitForm from "@/components/submit/SubmitForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const revalidate = 0;

export default async function SubmitPage() {
  const session = await auth();
  const isLoggedIn = !!session;
  const role = session?.user?.role || "";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Discover</span>
        </Link>
      </div>

      <div className="space-y-2 max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight font-sans">
          List Your SaaS Platform
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showcase your software walkthroughs, pricing plans, and capture high-intent leads on DemoVerse.
        </p>
      </div>

      <SubmitForm isLoggedIn={isLoggedIn} role={role} />
    </div>
  );
}
