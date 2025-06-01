// src/components/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    // Removed mx-auto from footer element, w-full ensures it spans the width.
    // mt-auto helps push it to the bottom in flex layouts.
    <footer className="w-full border-t py-6 mt-auto">
      {/* Added mx-auto to center the container within the footer. Added px-4 md:px-6 for standard container padding. */}
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <p className="text-sm text-muted-foreground text-center md:text-left"> {/* Ensure text is centered on small screens */}
          © {new Date().getFullYear()} CornSelect Pro. All rights reserved.
        </p>
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6"> {/* Added flex-wrap and justify-center for better mobile */}
          <Link href="/terms" className="text-sm font-medium hover:underline">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-sm font-medium hover:underline">
            Privacy Policy
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}