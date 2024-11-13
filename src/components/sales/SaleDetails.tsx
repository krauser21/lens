import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Sale } from '../../types';

interface SaleDetailsProps {
  sale: Sale;
  onClose: () => void;
  onPayment: (saleId: string, amount: number) => void;
}

export function SaleDetails({ sale, onClose, onPayment }: SaleDetailsProps) {
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const remainingAmount = sale.totalAmount - (sale.paidAmount || 0);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      setError('Ödeme tutarı 0\'dan büyük olmalıdır');
      return;
    }
    if (paymentAmount > remainingAmount) {
      setError('Ödeme tutarı kalan borçtan fazla olamaz');
      return;
    }

    onPayment(sale.id, paymentAmount);
    setPaymentAmount(0);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Satış Detayları</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">{sale.schoolId}</p>
            <p className="text-sm text-gray-600">
              {new Date(sale.date).toLocaleDateString('tr-TR')}
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Ürünler:</h3>
            <div className="space-y-2">
              {sale.products.map((product, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{product.name} x {product.quantity}</span>
                  <span>₺{(product.price * product.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <p className="flex justify-between">
              <span>Toplam Tutar:</span>
              <span className="font-medium">₺{sale.totalAmount.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Ödenen:</span>
              <span className="font-medium">₺{(sale.paidAmount || 0).toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-lg">
              <span>Kalan:</span>
              <span className={`font-bold ${remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₺{remainingAmount.toFixed(2)}
              </span>
            </p>
          </div>

          {remainingAmount > 0 && (
            <form onSubmit={handlePayment} className="border-t pt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ödeme Tutarı (₺)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => {
                    setPaymentAmount(Number(e.target.value));
                    setError('');
                  }}
                  min="0"
                  max={remainingAmount}
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ödeme Al
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}