import React from 'react';

interface CardProps {
  children: React.ReactNode;
  color?: string;
}

export default function Card({ 
  children, 
  color = 'bg-white'
}: CardProps) {
  return (
    <div 
      className={`
        relative flex flex-col min-w-0 wrap-break-word 
        border border-gray-200 rounded-xl
        shadow-sm px-4 py-2 w-full
        ${color}
      `}
      style={{
        boxShadow: '0px 0px 20px 0px rgba(76, 87, 125, 0.02)'
      }}
    >
      {children}
    </div>
  );
}