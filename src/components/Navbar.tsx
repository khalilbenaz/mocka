"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-bold text-lg tracking-tight">
            Mocka
            <span className="text-muted text-sm font-normal ml-1.5">qzz.io</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Show when="signed-in">
            <Link
              href="/create"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/create"
                  ? "bg-accent text-white"
                  : "text-muted hover:text-foreground hover:bg-surface-2"
              }`}
            >
              Create
            </Link>
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-accent text-white"
                  : "text-muted hover:text-foreground hover:bg-surface-2"
              }`}
            >
              Dashboard
            </Link>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <ThemeToggle />
              <UserButton />
            </div>
          </Show>

          <Show when="signed-out">
            <div className="flex items-center gap-1 ml-2">
              <ThemeToggle />
              <SignInButton mode="modal">
                <button className="text-sm text-muted hover:text-foreground px-3 py-1.5 rounded-lg transition-colors">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
}
