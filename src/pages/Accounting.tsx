import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { TransactionForm } from '../components/accounting/TransactionForm';
import { TransactionList } from '../components/accounting/TransactionList';
import { AccountingSummary } from '../components/accounting/AccountingSummary';
import type { Transaction, Sale } from '../types';

export default function Accounting() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'month' | 'year'>('month');

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
  };

  const handleAddTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    saveTransactions([...transactions, newTransaction]);
    setIsFormOpen(false);
  };

  const handleEditTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    if (!editingTransaction) return;
    
    const updatedTransactions = transactions.map(t =>
      t.id === editingTransaction.id
        ? { ...transaction, id: t.id, date: t.date }
        : t
    );
    saveTransactions(updatedTransactions);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    // If it's a payment transaction, update the corresponding sale
    if (transaction.type === 'income' && transaction.category === 'Ödeme') {
      const sales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
      const saleId = transaction.description.split(' - ')[0];
      
      const updatedSales = sales.map(sale => {
        if (sale.schoolId === saleId) {
          return {
            ...sale,
            paidAmount: Math.max(0, (sale.paidAmount || 0) - transaction.amount)
          };
        }
        return sale;
      });

      localStorage.setItem('sales', JSON.stringify(updatedSales));
    }

    // Remove the transaction
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    saveTransactions(updatedTransactions);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType !== 'all' && transaction.type !== filterType) return false;

    const transactionDate = new Date(transaction.date);
    const now = new Date();

    if (dateRange === 'month') {
      return (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
      );
    }
    if (dateRange === 'year') {
      return transactionDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Muhasebe</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni İşlem Ekle
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <AccountingSummary transactions={filteredTransactions} />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
            className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tüm İşlemler</option>
            <option value="income">Gelirler</option>
            <option value="expense">Giderler</option>
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as 'all' | 'month' | 'year')}
            className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="month">Bu Ay</option>
            <option value="year">Bu Yıl</option>
            <option value="all">Tüm Zamanlar</option>
          </select>
        </div>

        <TransactionList
          transactions={filteredTransactions}
          onEdit={setEditingTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {(isFormOpen || editingTransaction) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">
              {editingTransaction ? 'İşlemi Düzenle' : 'Yeni İşlem'}
            </h2>
            <TransactionForm
              initialTransaction={editingTransaction || undefined}
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}