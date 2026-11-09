import React from 'react';

/** Coquette Satin Ribbon Bow */
export const CoquetteBow = ({ className = '', size = 36, color = '#E995B0', pearl = true }) => (
  <svg
    viewBox="0 0 100 80"
    width={size}
    height={(size * 80) / 100}
    className={className}
    style={{ overflow: 'visible', filter: 'drop-shadow(0 2px 5px rgba(155, 82, 108, 0.2))' }}
  >
    <defs>
      <linearGradient id="bowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F6C4D2" />
        <stop offset="50%" stopColor={color} />
        <stop offset="100%" stopColor="#D87895" />
      </linearGradient>
      <radialGradient id="pearlGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FFF1F5" />
        <stop offset="100%" stopColor="#E0C0C8" />
      </radialGradient>
    </defs>
    {/* Left Loop */}
    <path
      d="M50 38 C 42 16, 12 12, 10 32 C 8 50, 40 48, 50 42 Z"
      fill="url(#bowGrad)"
    />
    {/* Left Inner Crease */}
    <path d="M48 38 C 35 28, 20 28, 16 34" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.6" />
    
    {/* Right Loop */}
    <path
      d="M50 38 C 58 16, 88 12, 90 32 C 92 50, 60 48, 50 42 Z"
      fill="url(#bowGrad)"
    />
    {/* Right Inner Crease */}
    <path d="M52 38 C 65 28, 80 28, 84 34" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.6" />

    {/* Tails */}
    <path
      d="M46 42 Q 35 62, 22 75 Q 32 72, 44 58 Q 48 48, 48 44 Z"
      fill="url(#bowGrad)"
      opacity="0.95"
    />
    <path
      d="M54 42 Q 65 62, 78 75 Q 68 72, 56 58 Q 52 48, 52 44 Z"
      fill="url(#bowGrad)"
      opacity="0.95"
    />

    {/* Knot / Pearl */}
    {pearl ? (
      <ellipse cx="50" cy="40" rx="7" ry="7" fill="url(#pearlGrad)" stroke="#E8CCD5" strokeWidth="0.8" />
    ) : (
      <ellipse cx="50" cy="40" rx="6" ry="7.5" fill="#C56884" />
    )}
  </svg>
);

/** Sparkle Star Icon */
export const Sparkle = ({ size = 20, color = '#F2A9BF', style = {} }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={{ ...style, filter: 'drop-shadow(0 0 4px rgba(246, 196, 210, 0.8))' }}
  >
    <path
      d="M12 0 C12 7, 17 12, 24 12 C17 12, 12 17, 12 24 C12 17, 7 12, 0 12 C7 12, 12 7, 12 0 Z"
      fill={color}
    />
  </svg>
);

/** Floating Heart */
export const CuteHeart = ({ size = 18, color = '#F2A9BF', style = {} }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={{ ...style, filter: 'drop-shadow(0 2px 4px rgba(155, 82, 108, 0.15))' }}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
    />
  </svg>
);

/** Scalloped border or coaster base */
export const ScallopCoaster = ({ size = 180, color = '#FFF0F4', stroke = '#F2A9BF' }) => (
  <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: 'visible' }}>
    <defs>
      <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#9B526C" floodOpacity="0.12" />
      </filter>
    </defs>
    <path
      d="M 100, 20
         A 80,80 0 1,0 100.01,20 Z"
      fill={color}
      stroke={stroke}
      strokeWidth="2.5"
      strokeDasharray="4, 4"
      filter="url(#softShadow)"
    />
    <circle cx="100" cy="100" r="72" fill="none" stroke={stroke} strokeWidth="1" opacity="0.6" />
  </svg>
);

/** Little flower accent */
export const CoquetteFlower = ({ size = 24 }) => (
  <svg viewBox="0 0 60 60" width={size} height={size}>
    <g fill="#F6C4D2" opacity="0.9">
      <circle cx="30" cy="18" r="10" />
      <circle cx="42" cy="26" r="10" />
      <circle cx="38" cy="40" r="10" />
      <circle cx="22" cy="40" r="10" />
      <circle cx="18" cy="26" r="10" />
    </g>
    <circle cx="30" cy="30" r="7" fill="#FFE8A3" stroke="#F2A9BF" strokeWidth="1" />
  </svg>
);

