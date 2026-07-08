import type { ComponentType, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  ...props,
});

/* ---------------- Brand icons (official-style, filled) ---------------- */

export const Brand = {
  instagram: (props: IconProps) => (
    <svg {...base({ fill: "currentColor", "aria-hidden": true, ...props })}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  facebook: (props: IconProps) => (
    <svg {...base({ fill: "currentColor", "aria-hidden": true, ...props })}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  youtube: (props: IconProps) => (
    <svg {...base({ fill: "currentColor", "aria-hidden": true, ...props })}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  x: (props: IconProps) => (
    <svg {...base({ fill: "currentColor", "aria-hidden": true, ...props })}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  ),
  linkedin: (props: IconProps) => (
    <svg {...base({ fill: "currentColor", "aria-hidden": true, ...props })}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  whatsapp: (props: IconProps) => (
    <svg {...base({ fill: "currentColor", "aria-hidden": true, ...props })}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  ),
};

/* ---------------- UI icons (line style) ---------------- */

export function Phone(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M2.5 4.75C2.5 3.5 3.5 2.5 4.75 2.5h2.1c.5 0 .95.32 1.12.8l.9 2.6c.16.46.03.97-.34 1.3l-1.2 1.07a13 13 0 0 0 5.5 5.5l1.07-1.2c.33-.37.84-.5 1.3-.34l2.6.9c.48.17.8.62.8 1.12v2.1c0 1.25-1 2.25-2.25 2.25C9.5 19.5 4.5 14.5 2.5 4.75Z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

export function MapPin(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", "aria-hidden": true, ...props })}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", "aria-hidden": true, ...props })}>
      <path d="M6 6 18 18M18 6 6 18" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="m5 12.5 4.5 4.5L19 6.5" />
    </svg>
  );
}

export function Calendar(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <rect x="3" y="4.5" width="18" height="16" rx="1.5" />
      <path d="M3 9h18M8 3v3M16 3v3" />
    </svg>
  );
}

/* Feature / process icons */
export function Scissors(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" />
      <path d="M8 8 20 18M8 16 20 6" />
    </svg>
  );
}
export function Ruler(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <rect x="2.5" y="7.5" width="19" height="9" rx="1" transform="rotate(-5 12 12)" />
      <path d="M7 9.5v2M11 9.2v2.6M15 8.9v2M19 8.6v2" />
    </svg>
  );
}
export function Fabric(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M3 6c2.5 1.2 4 1.2 6.5 0S15 4.8 17.5 6 21 7.2 21 7.2M3 12c2.5 1.2 4 1.2 6.5 0s5.5-1.2 8 0 3.5 1.2 3.5 1.2M3 18c2.5 1.2 4 1.2 6.5 0s5.5-1.2 8 0 3.5 1.2 3.5 1.2" />
    </svg>
  );
}
export function Home(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M3.5 11 12 4l8.5 7" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" />
    </svg>
  );
}
export function Clock(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" />
    </svg>
  );
}
export function Refresh(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M4 9a8 8 0 0 1 13.5-3.5L20 8M20 4v4h-4M20 15a8 8 0 0 1-13.5 3.5L4 16M4 20v-4h4" />
    </svg>
  );
}
export function Sparkles(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M12 3c.5 4 1.5 5 5.5 5.5C13.5 9 12.5 10 12 14c-.5-4-1.5-5-5.5-5.5C10.5 8 11.5 7 12 3Z" />
      <path d="M18.5 14c.25 2 .75 2.5 2.5 2.75-1.75.25-2.25.75-2.5 2.75-.25-2-.75-2.5-2.5-2.75 1.75-.25 2.25-.75 2.5-2.75Z" />
    </svg>
  );
}
export function Chat(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M4 5h16v11H8l-4 3.5V5Z" /><path d="M8.5 10h7M8.5 12.5h4" />
    </svg>
  );
}
export function Crown(props: IconProps) {
  return (
    <svg {...base({ fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, ...props })}>
      <path d="M4 17h16M3 7l4.5 4L12 5l4.5 6L21 7l-1.6 8H4.6L3 7Z" />
    </svg>
  );
}

export const FEATURE_ICONS: Record<string, ComponentType<IconProps>> = {
  home: Home,
  ruler: Ruler,
  fabric: Fabric,
  scissors: Scissors,
  clock: Clock,
  refresh: Refresh,
};

export const PROCESS_ICONS = {
  consult: Chat,
  fabric: Fabric,
  measure: Ruler,
  trial: Scissors,
  deliver: Crown,
};
