import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { SaleForm } from '../components/sales/SaleForm';
import { SalesList } from '../components/sales/SalesList';
import { SalesFilter } from '../components/sales/SalesFilter';
import { SaleDetails } from '../components/sales/SaleDetails';
import type { Sale, Transaction, Product } from '../types';

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<string | null>(null);
  const [showDebtOnly, setShowDebtOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  useEffect(() => {
    const savedSales = localStorage.getItem('sales');
    if (savedSales) {
      setSales(JSON.parse(savedSales));
    }
  }, []);

  const updateInventory = (saleProducts: Sale['products']) => {
    const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    
    const updatedProducts = products.map(product => {
      const soldProduct = saleProducts.find(sp => sp.id === product.id);
      if (soldProduct) {
        return {
          ...product,
          stock: product.stock - soldProduct.quantity
        };
      }
      return product;
    });

    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleCreateSale = (saleData: Omit<Sale, 'id' | 'date' | 'paidAmount'>) => {
    const newSale = {
      ...saleData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      paidAmount: 0,
    };

    // Update inventory
    updateInventory(saleData.products);

    // Save sale
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
  };

  const handleDeleteSale = (saleId: string) => {
    // Find the sale to be deleted
    const saleToDelete = sales.find(sale => sale.id === saleId);
    if (!saleToDelete) return;

    // Restore inventory
    const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = products.map(product => {
      const soldProduct = saleToDelete.products.find(sp => sp.id === product.id);
      if (soldProduct) {
        return {
          ...product,
          stock: product.stock + soldProduct.quantity
        };
      }
      return product;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    // Delete sale
    const updatedSales = sales.filter(sale => sale.id !== saleId);
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));

    // Delete related transactions
    const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
    const updatedTransactions = transactions.filter(
      transaction => !transaction.description.includes(saleId)
    );
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const handlePayment = (saleId: string, amount: number) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    // Update sale
    const updatedSales = sales.map(s => {
      if (s.id === saleId) {
        return {
          ...s,
          paidAmount: (s.paidAmount || 0) + amount,
        };
      }
      return s;
    });
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));

    // Create transaction
    const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: 'income',
      category: 'Ödeme',
      description: `${sale.schoolId} - Satış Ödemesi`,
      amount: amount,
      date: new Date().toISOString(),
    };
    localStorage.setItem('transactions', JSON.stringify([...transactions, newTransaction]));

    setSelectedSale(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl font-bold mb-4">Yeni Satış</h2>
          <SaleForm onSubmit={handleCreateSale} />
        </div>

        <div className="order-1 lg:order-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Satışlar</h2>
          </div>
          
          <SalesFilter
            showDebtOnly={showDebtOnly}
            onFilterChange={setShowDebtOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className="mt-4">
            <SalesList
              sales={sales}
              showDebtOnly={showDebtOnly}
              sortBy={sortBy}
              onDeleteSale={handleDeleteSale}
              onViewDetails={setSelectedSale}
            />
          </div>
        </div>
      </div>

      {selectedSale && (
        <SaleDetails
          sale={sales.find(s => s.id === selectedSale)!}
          onClose={() => setSelectedSale(null)}
          onPayment={handlePayment}
        />
      )}
    </div>
  );
}