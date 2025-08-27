import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8CC63F" />
          <stop offset="100%" stopColor="#009CA6" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="white"/>
      <circle cx="20" cy="20" r="18" fill="none" stroke="url(#logo-gradient)" strokeWidth="2" />
      <path 
        d="M20 12 C 25 17, 26 23, 20 28 C 14 23, 15 17, 20 12 Z"
        fill="url(#logo-gradient)"
      />
    </svg>
  );
}
