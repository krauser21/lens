import React from 'react';
import { Edit2, Trash2, TrendingUp, TrendingDown, ShoppingCart, CreditCard } from 'lucide-react';
import type { Transaction } from '../../types';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.type === 'income') {
      if (transaction.category === 'Satış') {
        return <ShoppingCart className="w-5 h-5" />;
      }
      if (transaction.category === 'Ödeme') {
        return <CreditCard className="w-5 h-5" />;
      }
      return <TrendingUp className="w-5 h-5" />;
    }
    return <TrendingDown className="w-5 h-5" />;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Henüz işlem kaydı bulunmamaktadır.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {getTransactionIcon(transaction)}
            </div>
            <div>
              <h3 className="font-medium">{transaction.category}</h3>
              <p className="text-sm text-gray-600">{transaction.description}</p>
              <p className="text-xs text-gray-500">
                {new Date(transaction.date).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`font-medium ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(transaction)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(transaction.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}