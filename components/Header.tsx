"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight text-neutral-900">
          Plancitos <span aria-hidden>🧉</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/favoritos"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            ❤ Favoritos
          </Link>

          {status === "authenticated" && user ? (
            <div className="flex items-center gap-2">
              {user.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? "Perfil"}
                  className="h-8 w-8 rounded-full border border-neutral-200"
                />
              )}
              <span className="hidden text-sm font-medium text-neutral-700 sm:inline">
                {user.name}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-full border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
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
