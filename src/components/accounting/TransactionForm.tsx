import React, { useState } from 'react';
import type { Transaction } from '../../types';

interface TransactionFormProps {
  initialTransaction?: Transaction;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  onCancel: () => void;
  expenseOnly?: boolean;
}

export function TransactionForm({
  initialTransaction,
  onSubmit,
  onCancel,
  expenseOnly = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: expenseOnly ? 'expense' : (initialTransaction?.type || 'income'),
    category: initialTransaction?.category || '',
    description: initialTransaction?.description || '',
    amount: initialTransaction?.amount || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!expenseOnly && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            İşlem Tipi
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="income">Gelir</option>
            <option value="expense">Gider</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Kategori
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Açıklama
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tutar (₺)
        </label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          İptal
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {initialTransaction ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
    </form>
  );
}