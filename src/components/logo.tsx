import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        viewBox="0 0 100 40"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#8CC63F' }} />
          <stop offset="100%" style={{ stopColor: '#009CA6' }} />
        </linearGradient>
      </defs>
      
      {/* Icon */}
      <g transform="translate(0, 2)">
        <circle cx="18" cy="18" r="16" fill="url(#logo-gradient)" />
        <circle cx="18" cy="18" r="12" fill="white" />
        <path 
          d="M18 11.5 C 22 15.5, 22.5 20, 18 24.5 C 13.5 20, 14 15.5, 18 11.5 Z"
          fill="#8CC63F"
        />
        <path
          d="M18 11.5 C 18 17.5, 24 20.5, 18 24.5"
          fill="none"
          stroke="#0F5B31"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}
