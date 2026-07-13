import React from "react";

interface FloatAssetProps extends React.HTMLAttributes<HTMLDivElement> {
  speed: number;
  is3d?: boolean;
}

export function MouseAsset({ speed, is3d = true, className = "", ...props }: FloatAssetProps) {
  return (
    <div
      className={`float-3d float-3d--mouse ${className}`}
      data-parallax-speed={speed}
      {...(is3d ? { "data-parallax-3d": "" } : {})}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="2" width="14" height="20" rx="7" />
        <path d="M12 6v4" />
      </svg>
    </div>
  );
}

export function CoffeeAsset({ speed, is3d = true, className = "", ...props }: FloatAssetProps) {
  return (
    <div
      className={`float-3d float-3d--coffee ${className}`}
      data-parallax-speed={speed}
      {...(is3d ? { "data-parallax-3d": "" } : {})}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    </div>
  );
}

export function KeyboardAsset({ speed, is3d = true, className = "", ...props }: FloatAssetProps) {
  return (
    <div
      className={`float-3d float-3d--keyboard ${className}`}
      data-parallax-speed={speed}
      {...(is3d ? { "data-parallax-3d": "" } : {})}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
        <path d="M6 8h.01" />
        <path d="M10 8h.01" />
        <path d="M14 8h.01" />
        <path d="M18 8h.01" />
        <path d="M8 12h.01" />
        <path d="M12 12h.01" />
        <path d="M16 12h.01" />
        <path d="M7 16h10" />
      </svg>
    </div>
  );
}

export function EarphonesAsset({ speed, is3d = true, className = "", ...props }: FloatAssetProps) {
  return (
    <div
      className={`float-3d float-3d--earphones ${className}`}
      data-parallax-speed={speed}
      {...(is3d ? { "data-parallax-3d": "" } : {})}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2 2h1a2 2 0 0 0-2-2H3z" />
      </svg>
    </div>
  );
}
