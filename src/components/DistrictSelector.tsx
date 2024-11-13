import React from 'react';
import { Navigation } from 'lucide-react';

interface DistrictSelectorProps {
  districts: string[];
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  onCreateRoute?: () => void;
  showRouteButton?: boolean;
}

export function DistrictSelector({
  districts,
  selectedDistrict,
  onDistrictChange,
  onCreateRoute,
  showRouteButton = false,
}: DistrictSelectorProps) {
  return (
    <div className="flex gap-4">
      <select
        value={selectedDistrict}
        onChange={(e) => onDistrictChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">Tüm İlçeler</option>
        {districts.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
      
      {showRouteButton && onCreateRoute && selectedDistrict !== 'all' && (
        <button
          onClick={onCreateRoute}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Navigation className="w-5 h-5" />
          İlçe Rotası
        </button>
      )}
    </div>
  );
}