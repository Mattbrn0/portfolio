"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-svh place-items-center px-4">
      <div className="glass max-w-lg rounded-[36px] p-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">La page n’a pas pu s’afficher.</h1>
        <p className="mt-3 text-muted">This page could not be shown.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-bg"
        >
          Réessayer
        </button>
      </div>
    </main>
  );
}
