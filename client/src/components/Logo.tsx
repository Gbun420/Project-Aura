import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="novaGradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#9B72CB" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Hexagon - Tech Frame */}
      <path
        d="M50 5 L88.97 27.5 V72.5 L50 95 L11.03 72.5 V27.5 Z"
        stroke="url(#novaGradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
        className="animate-[spin_10s_linear_infinite] nova-logo-element-spin"
      />

      {/* Inner Orbit - Compliance Ring */}
      <circle
        cx="50"
        cy="50"
        r="30"
        stroke="#4F46E5"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        className="animate-[spin_15s_linear_infinite_reverse] opacity-50 nova-logo-element-spin"
      />

      {/* Core - Neural Hub */}
      <circle cx="50" cy="50" r="16" fill="url(#novaGradient)" filter="url(#glow)">
        <animate
          attributeName="r"
          values="16;18;16"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Central Node Dot */}
      <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.9" />
    </svg>
  );
};
