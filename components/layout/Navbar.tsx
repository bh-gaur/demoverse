"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Laptop, User as UserIcon, LogOut, LayoutDashboard, PlusCircle } from "lucide-react";
import ThemeToggle from "../theme/ThemeToggle";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const navLinks = [
    { label: "Discover", href: "/" },
    { label: "Compare", href: "/compare" },
  ];

  const role = session?.user?.role;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-xl font-sans">
              <Laptop size={24} className="text-primary" />
              <span className="tracking-tight text-foreground">
                Demo<span className="text-primary">Verse</span>
              </span>
            </Link>
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.href)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {session ? (
              <>
                {/* Submit Platform Link (only for vendors/admins) */}
                {(role === "vendor" || role === "admin") && (
                  <Link
                    href="/submit"
                    className={`inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive("/submit")
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <PlusCircle size={16} />
                    <span>Submit</span>
                  </Link>
                )}

                {/* Dashboard Link (only for vendors/admins) */}
                {(role === "vendor" || role === "admin") && (
                  <Link
                    href="/dashboard"
                    className={`inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive("/dashboard")
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* Profile Link */}
                <Link
                  href="/profile"
                  className={`inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive("/profile")
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <UserIcon size={16} />
                  <span>{session.user.name || "Profile"}</span>
                </Link>

                {/* Theme toggle */}
                <ThemeToggle />

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center space-x-1 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/5 rounded-md transition-colors"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/95 shadow-sm transition-all"
                >
                  Register
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {session ? (
              <>
                {(role === "vendor" || role === "admin") && (
                  <Link
                    href="/submit"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    Submit Platform
                  </Link>
                )}

                {(role === "vendor" || role === "admin") && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    Vendor Dashboard
                  </Link>
                )}

                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  My Profile
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/5"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block mx-3 my-2 text-center rounded-lg bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:bg-primary/95 shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
