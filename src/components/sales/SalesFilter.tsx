import React from 'react';
import { Filter } from 'lucide-react';

interface SalesFilterProps {
  showDebtOnly: boolean;
  onFilterChange: (showDebtOnly: boolean) => void;
  sortBy: 'date' | 'amount';
  onSortChange: (sortBy: 'date' | 'amount') => void;
}

export function SalesFilter({ 
  showDebtOnly, 
  onFilterChange,
  sortBy,
  onSortChange
}: SalesFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDebtOnly}
            onChange={(e) => onFilterChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Sadece Borçlu Olanları Göster</span>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Sıralama:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'date' | 'amount')}
          className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="date">Tarihe Göre</option>
          <option value="amount">Tutara Göre</option>
        </select>
      </div>
    </div>
  );
}