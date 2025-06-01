// src/components/Header.tsx
"use client"; // Required for usePathname

import Link from "next/link";
import { usePathname, useRouter } // useRouter for back functionality
from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle"; // Make sure this path is correct
import { ArrowLeft, Menu } from "lucide-react"; // Using Menu from lucide-react

export function Header() {
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Added mx-auto to center the container within the header. Added px-4 md:px-6 for standard container padding. */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {pathname !== "/" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()} // Go back to previous page
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            CornSelect Pro {/* Updated App Name */}
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/ahp"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            AHP Analysis
          </Link>
          <Link
            href="/topsis"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            TOPSIS Analysis
          </Link>
          <Link
            href="/profile-matching"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Profile Matching
          </Link>
          <ThemeToggle />
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          {/* Mobile Menu Button - Consider using shadcn/ui <Sheet> for a full implementation */}
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
