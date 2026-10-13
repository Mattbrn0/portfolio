import { ViewTransition } from "react";

/** Glisse vers la gauche en avançant (accueil → étude de cas), vers la droite en revenant. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const types = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };
  return (
    <ViewTransition enter={types} exit={types} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
