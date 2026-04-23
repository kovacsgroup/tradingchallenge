"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Live" },
  { href: "/manual", label: "Manual" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex max-w-2xl items-center gap-6 px-6 py-3 md:px-10">
        <span className="text-sm font-semibold tracking-tight">
          Trading Challenge
        </span>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded px-2.5 py-1 text-xs transition-colors",
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
