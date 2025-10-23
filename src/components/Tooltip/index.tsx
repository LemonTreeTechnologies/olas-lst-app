import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group inline-block">
      {children}

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-sm px-4 py-3 text-base text-white bg-zinc-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
        {content}
        <div className="absolute top-full left-1/2 w-2 h-2 bg-zinc-800 rotate-45 -translate-x-1/2 mt-[-4px]"></div>
      </div>
    </div>
  );
};
