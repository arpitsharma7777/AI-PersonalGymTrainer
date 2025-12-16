export function MockVideoFeed() {
  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 border-muted">
      <svg
        className="w-full h-full"
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a0a0a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
        </defs>

        <rect width="400" height="300" fill="url(#bgGradient)" />

        <circle cx="200" cy="80" r="25" fill="#00ff64" opacity="0.8" />

        <rect x="175" y="110" width="50" height="60" fill="#00ff64" opacity="0.8" />

        <line
          x1="175"
          y1="120"
          x2="140"
          y2="100"
          stroke="#00ff64"
          strokeWidth="4"
          opacity="0.8"
        />
        <line
          x1="225"
          y1="120"
          x2="260"
          y2="100"
          stroke="#00ff64"
          strokeWidth="4"
          opacity="0.8"
        />

        <line
          x1="175"
          y1="170"
          x2="150"
          y2="240"
          stroke="#00ff64"
          strokeWidth="4"
          opacity="0.8"
        />
        <line
          x1="225"
          y1="170"
          x2="250"
          y2="240"
          stroke="#00ff64"
          strokeWidth="4"
          opacity="0.8"
        />

        <circle cx="140" cy="100" r="4" fill="#00ff64" />
        <circle cx="260" cy="100" r="4" fill="#00ff64" />
        <circle cx="150" cy="240" r="4" fill="#00ff64" />
        <circle cx="250" cy="240" r="4" fill="#00ff64" />

        <text
          x="200"
          y="290"
          textAnchor="middle"
          fill="#00ff64"
          fontSize="12"
          opacity="0.6"
        >
          Camera Feed - Mock Skeleton
        </text>
      </svg>
    </div>
  );
}
