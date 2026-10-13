import { logoBlades } from "@/lib/logo";
import { cn } from "@/lib/utils";

const blades = logoBlades();

export function Logo({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg
      viewBox="-1.2 -1.2 2.4 2.4"
      className={cn("overflow-visible", className)}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.028"
      strokeLinejoin="round"
      aria-hidden
    >
      {blades.map((points, index) => (
        <polygon
          key={points}
          points={points}
          className={animated ? "logo-blade" : undefined}
          style={animated ? { animationDelay: `${(index / blades.length) * -2.4}s` } : undefined}
        />
      ))}
    </svg>
  );
}
