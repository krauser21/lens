import React from 'react';
import { School } from 'lucide-react';

interface SystemLogoProps {
  onLogoClick: () => void;
}

export function SystemLogo({ onLogoClick }: SystemLogoProps) {
  return (
    <button
      onClick={onLogoClick}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <School className="w-6 h-6" />
      <span className="font-semibold">Okul Bilgi Sistemi</span>
    </button>
  );
}