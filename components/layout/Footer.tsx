import Link from "next/link";
import { Laptop } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card text-muted-foreground mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2">
            <Laptop size={20} className="text-primary" />
            <span className="font-bold text-foreground font-sans tracking-tight">
              Demo<span className="text-primary">Verse</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex space-x-6 text-sm">
            <Link href="/" className="hover:text-foreground transition-colors">
              Discover
            </Link>
            <Link href="/compare" className="hover:text-foreground transition-colors">
              Compare
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} DemoVerse Inc. All rights reserved. Locally Hosted B2B Sandbox.
          </div>
        </div>
      </div>
    </footer>
  );
}
