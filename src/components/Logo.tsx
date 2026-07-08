import { cn } from "../utils/cn";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <a href="#home" aria-label="Aurum Bespoke - return to home" className={cn("group inline-flex shrink-0 items-center", className)}>
      <img
        src="https://aurumbespoke.com/assets/logos/aurum-logo.jpg"
        alt="Aurum Bespoke"
        width={180}
        height={56}
        loading="eager"
        className="h-11 w-auto object-contain"
        style={{ mixBlendMode: "screen" }}
      />
    </a>
  );
}
