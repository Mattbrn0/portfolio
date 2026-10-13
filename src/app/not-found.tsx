import Link from "next/link";
import { Backdrop } from "@/components/backdrop";

export default function RootNotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Backdrop />
      <div className="glass max-w-lg rounded-[36px] p-10 text-center">
        <p className="display text-8xl">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Cette page n’existe pas.</h1>
        <p className="mt-3 text-muted">This page does not exist.</p>
        <div className="mt-8 flex justify-center gap-2">
          <Link href="/" className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-bg">
            Accueil
          </Link>
          <Link href="/en" className="glass inline-flex h-11 items-center rounded-full px-5 text-sm font-medium">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
