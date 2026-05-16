import React from 'react';
import { Monitor } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10" }) => (
  <div className={cn("relative flex items-center justify-center bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden", className)}>
    <img 
      src="https://i.ibb.co.com/HTHQ5dDy/32974-removebg-preview.png" 
      alt="Maksud Computer's Logo" 
      className="w-full h-full object-contain p-1"
      referrerPolicy="no-referrer"
    />
  </div>
);
