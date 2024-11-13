import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Sale } from '../../types';

interface PaymentModalProps {
  sale: Sale;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

export function PaymentModal({ sale, onClose, onSubmit }: PaymentModalProps) {
  const [amount, setAmount] = useState<string>(sale.remainingAmount.toString());
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      setError('Geçerli bir tutar giriniz');
      return;
    }

    if (paymentAmount > sale.remainingAmount) {
      setError('Ödeme tutarı kalan tutardan büyük olamaz');
      return;
    }

    onSubmit(paymentAmount);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">Ödeme Al</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kalan Tutar: ₺{sale.remainingAmount.toFixed(2)}
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ödeme tutarını giriniz"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Ödemeyi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}