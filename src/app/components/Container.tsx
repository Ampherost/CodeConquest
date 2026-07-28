// src/app/components/Container.tsx
import React from 'react';

interface ContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function Container({ title, children, className = "" }: ContainerProps) {
  return (
    <div className={`w-full bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/60 p-6 sm:p-10 rounded-2xl shadow-xl transition-all ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 border-b pb-4 border-zinc-200 dark:border-zinc-700/60">
        {title}
      </h2>
      {children}
    </div>
  );
}
