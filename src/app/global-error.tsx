"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#000000",
          color: "#ffffff",
        }}
      >
        <main style={{ textAlign: "center", padding: "40px", borderRadius: "36px", background: "rgba(255,255,255,0.06)" }}>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 600, letterSpacing: "-0.03em" }}>La page n’a pas pu s’afficher.</h1>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: "24px", border: 0, borderRadius: "999px", padding: "14px 22px", background: "#ffffff", color: "#000000", fontSize: "15px" }}
          >
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
