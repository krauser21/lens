import React, { useState } from 'react';
import { Trash2, Search, DollarSign } from 'lucide-react';
import type { Sale } from '../../types';

interface SalesListProps {
  sales: Sale[];
  onDeleteSale: (id: string) => void;
  onViewDetails: (id: string) => void;
  showDebtOnly?: boolean;
  sortBy?: 'date' | 'amount';
}

export function SalesList({
  sales,
  onDeleteSale,
  onViewDetails,
  showDebtOnly = false,
  sortBy = 'date'
}: SalesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSales = sales
    .filter(sale => {
      if (!sale) return false;
      const matchesSearch = sale.schoolId.toLowerCase().includes(searchTerm.toLowerCase());
      const hasDebt = sale.totalAmount - (sale.paidAmount || 0) > 0;
      return matchesSearch && (!showDebtOnly || hasDebt);
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.totalAmount - a.totalAmount;
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const calculateRemainingDebt = (sale: Sale) => {
    return Math.max(0, sale.totalAmount - (sale.paidAmount || 0));
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Okul ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-4">
        {filteredSales.map((sale) => (
          <div
            key={sale.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{sale.schoolId}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(sale.date).toLocaleDateString('tr-TR')}
                </p>
                <p className="text-sm">
                  Toplam Tutar: <span className="font-medium">{formatCurrency(sale.totalAmount)}</span>
                </p>
                <p className="text-sm">
                  Ödenen: <span className="font-medium">{formatCurrency(sale.paidAmount || 0)}</span>
                </p>
                {calculateRemainingDebt(sale) > 0 && (
                  <p className="text-sm text-red-600">
                    Kalan Borç: <span className="font-medium">{formatCurrency(calculateRemainingDebt(sale))}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onViewDetails(sale.id)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Detayları Görüntüle"
                >
                  <DollarSign className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDeleteSale(sale.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Satışı Sil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <p className="text-sm font-medium">Ürünler:</p>
              <div className="mt-2 space-y-2">
                {sale.products.map((product, index) => (
                  <div key={`${sale.id}-${product.id}-${index}`} className="text-sm flex justify-between">
                    <span>{product.name} x {product.quantity}</span>
                    <span>{formatCurrency(product.price * product.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredSales.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz satış kaydı yok.'}
          </div>
        )}
      </div>
    </div>
  );
}