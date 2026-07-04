"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          Plancitos <span aria-hidden>🧉</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/favoritos"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            ❤ Favoritos
          </Link>

          <ThemeToggle />

          {status === "authenticated" && user ? (
            <div className="flex items-center gap-2">
              {user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? "Perfil"}
                  className="h-8 w-8 rounded-full border border-neutral-200 dark:border-neutral-700"
                />
              )}
              <span className="hidden text-sm font-medium text-neutral-700 dark:text-neutral-200 sm:inline">
                {user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
            >
              Ingresar con Google
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
