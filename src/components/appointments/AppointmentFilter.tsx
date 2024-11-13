import React from 'react';
import { Search } from 'lucide-react';

interface AppointmentFilterProps {
  filterStatus: 'all' | 'pending' | 'completed' | 'cancelled';
  onFilterChange: (status: 'all' | 'pending' | 'completed' | 'cancelled') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function AppointmentFilter({
  filterStatus,
  onFilterChange,
  searchTerm,
  onSearchChange,
}: AppointmentFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Randevu veya okul ara..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <select
        value={filterStatus}
        onChange={(e) => onFilterChange(e.target.value as 'all' | 'pending' | 'completed' | 'cancelled')}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">Tüm Randevular</option>
        <option value="pending">Bekleyenler</option>
        <option value="completed">Tamamlananlar</option>
        <option value="cancelled">İptal Edilenler</option>
      </select>
    </div>
  );
}