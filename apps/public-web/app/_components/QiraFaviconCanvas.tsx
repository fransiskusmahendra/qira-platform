export function QiraFaviconCanvas({ size, markSize }: { size: number; markSize: number }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#090D16",
        borderRadius: `${Math.round(size * 0.22)}px`,
      }}
    >
      <svg width={markSize} height={markSize} viewBox="0 0 128 128" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="favRing" x1="16" y1="14" x2="99" y2="102" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="45%" stopColor="#1769FF" />
            <stop offset="100%" stopColor="#0A3AB5" />
          </linearGradient>
          <linearGradient id="favBeam" x1="67" y1="64" x2="117" y2="114" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="70%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#1769FF" />
          </linearGradient>
          <radialGradient id="favAura" cx="64" cy="64" r="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#1769FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#090D16" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="64" cy="64" r="50" fill="url(#favAura)" />
        <path
          d="M 55.3 14.12 C 30.92 14.12 11.22 33.82 11.22 58.2 C 11.22 82.58 30.92 102.28 55.3 102.28 C 68.52 102.28 80.36 96.6 88.48 87.43 L 73.63 72.58 C 69.45 76.99 62.96 80.01 55.3 80.01 C 43.26 80.01 33.49 70.24 33.49 58.2 C 33.49 46.16 43.26 36.39 55.3 36.39 C 67.34 36.39 77.11 46.16 77.11 58.2 C 77.11 62.84 75.6 67.02 73.16 70.38 L 88.01 85.23 C 95.55 78.04 99.38 68.06 99.38 58.2 C 99.38 33.82 79.68 14.12 55.3 14.12 Z"
          fill="url(#favRing)"
        />
        <path
          d="M 66.9 72.12 L 108.66 113.88 L 116.78 105.76 L 75.02 64 L 66.9 72.12 Z"
          fill="url(#favBeam)"
        />
      </svg>
    </div>
  );
}
