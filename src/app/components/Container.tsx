// src/app/components/Container.tsx
import React from 'react';

interface ContainerProps {
  title: string;
  children: React.ReactNode;
}

export default function Container({ title, children }: ContainerProps) {
  return (
    <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}
