interface UniqueLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function UniqueLogo({
  width = 48,
  height = 48,
  className = "",
}: UniqueLogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="am-logo-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#00FFC8" />
          <stop offset="50%" stopColor="#00FFC8" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* Letter A */}
      <path
        d="M 50 12 L 72 48 L 62 48 L 58 40 L 42 40 L 38 48 L 28 48 Z"
        fill="url(#am-logo-gradient)"
      />
      <path d="M 50 22 L 56 35 L 44 35 Z" fill="rgba(8, 8, 8, 0.95)" />

      {/* Letter M */}
      <path
        d="M 18 55 L 18 88 L 26 88 L 26 65 L 42 88 L 50 75 L 58 88 L 74 65 L 74 88 L 82 88 L 82 55 L 72 55 L 50 85 L 28 55 Z"
        fill="url(#am-logo-gradient)"
      />
    </svg>
  );
}
