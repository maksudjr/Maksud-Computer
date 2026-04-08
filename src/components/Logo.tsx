import React from 'react';
import { Monitor } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <div className={cn("relative flex items-center justify-center bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 overflow-hidden", className)}>
    <Monitor className="text-white w-2/3 h-2/3" />
    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white" />
  </div>
);
