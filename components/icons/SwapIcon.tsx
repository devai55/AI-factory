
import React from 'react';

const SwapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 12L4 12" />
    <path d="M8 6L4 12L8 18" />
    <path d="M4 12L20 12" />
    <path d="M16 18L20 12L16 6" />
  </svg>
);

export default SwapIcon;
