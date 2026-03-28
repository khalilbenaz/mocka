"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const { user, login, signup, logout, loading } = useAuth();

  return (
    <nav className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="font-bold text-lg tracking-tight">
            Mocka
            <span className="text-muted text-sm font-normal ml-1.5">qd.je</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {user && (
            <>
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
            </>
          )}

          {loading ? (
            <div className="w-20 h-8 bg-surface-2 rounded-lg animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <div className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">
                {(user.user_metadata?.full_name?.[0] || user.email[0] || "U").toUpperCase()}
              </div>
              <span className="text-xs text-muted hidden sm:block max-w-[120px] truncate">
                {user.user_metadata?.full_name || user.email}
              </span>
              <button
                onClick={logout}
                className="text-xs text-muted hover:text-danger px-2 py-1 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={login}
                className="text-sm text-muted hover:text-foreground px-3 py-1.5 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={signup}
                className="text-sm bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
