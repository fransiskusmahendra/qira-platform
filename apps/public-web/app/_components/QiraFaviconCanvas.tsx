export function QiraFaviconCanvas({ size, markSize }: { size: number; markSize: number }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <svg width={markSize} height={markSize} viewBox="0 0 128 128" aria-hidden="true">
        <defs>
          <linearGradient id="qiraBlue" x1="18" y1="14" x2="108" y2="112" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#28a9ff" />
            <stop offset="0.52" stopColor="#1769ff" />
            <stop offset="1" stopColor="#103fc5" />
          </linearGradient>
        </defs>
        <path
          fill="url(#qiraBlue)"
          fillRule="evenodd"
          d="M64 13a47 47 0 1 0 28.2 84.6l15.2 15.2 13.4-13.4-15.3-15.3A47 47 0 0 0 64 13Zm0 19a28 28 0 1 0 0 56 28 28 0 0 0 0-56Z"
        />
        <path fill="#35d7c8" d="m83.8 82.4 13.4-13.4 12.9 12.9-13.4 13.4z" />
      </svg>
    </div>
  );
}
