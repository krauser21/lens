import React, { useState } from 'react';
import type { Product, Sale, School } from '../../types';

interface SaleFormProps {
  onSubmit: (sale: Omit<Sale, 'id' | 'date' | 'paidAmount'>) => void;
}

export function SaleForm({ onSubmit }: SaleFormProps) {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{
    id: string;
    quantity: number;
  }[]>([]);
  const [error, setError] = useState('');

  const schools: School[] = JSON.parse(localStorage.getItem('schools') || '[]');
  const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]')
    .filter((product: Product) => product.stock > 0); // Only show products with stock

  // Create a map of schools to ensure uniqueness
  const uniqueSchools = Array.from(new Map(schools.map(s => [s.OKUL_ADI, s])).values());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool || selectedProducts.length === 0) return;

    // Verify stock availability
    const stockError = selectedProducts.some(sp => {
      const product = products.find(p => p.id === sp.id);
      return !product || sp.quantity > product.stock;
    });

    if (stockError) {
      setError('Seçilen ürünler için yeterli stok bulunmamaktadır.');
      return;
    }

    const productsWithDetails = selectedProducts.map(sp => {
      const product = products.find((p: Product) => p.id === sp.id);
      if (!product) return null;
      return {
        id: product.id,
        name: product.name,
        quantity: sp.quantity,
        price: product.price,
      };
    }).filter(Boolean);

    const totalAmount = productsWithDetails.reduce(
      (sum, p) => sum + (p?.price || 0) * (p?.quantity || 0),
      0
    );

    onSubmit({
      schoolId: selectedSchool,
      products: productsWithDetails as NonNullable<typeof productsWithDetails[number]>[],
      totalAmount,
    });

    setSelectedSchool('');
    setSelectedProducts([]);
    setError('');
  };

  const handleProductChange = (productId: string, quantity: number) => {
    const product = products.find((p: Product) => p.id === productId);
    if (!product) return;

    setError('');

    if (quantity === 0) {
      setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    } else if (quantity <= product.stock) {
      setSelectedProducts(prev => {
        const existing = prev.find(p => p.id === productId);
        if (existing) {
          return prev.map(p =>
            p.id === productId ? { ...p, quantity } : p
          );
        }
        return [...prev, { id: productId, quantity }];
      });
    } else {
      setError(`${product.name} için yeterli stok bulunmamaktadır.`);
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, sp) => {
      const product = products.find((p: Product) => p.id === sp.id);
      return total + (product?.price || 0) * sp.quantity;
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Okul</label>
        <select
          value={selectedSchool}
          onChange={e => setSelectedSchool(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Okul Seçin</option>
          {uniqueSchools.map((school) => (
            <option key={`${school.OKUL_ADI}-${school.ILCE_ADI}`} value={school.OKUL_ADI}>
              {school.OKUL_ADI}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ürünler
        </label>
        <div className="space-y-4">
          {products.map((product: Product) => (
            <div key={product.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-500">
                  Stok: <span className={product.stock < 10 ? 'text-amber-500' : 'text-green-600'}>
                    {product.stock}
                  </span> | 
                  Fiyat: ₺{product.price}
                </p>
              </div>
              <input
                type="number"
                min="0"
                max={product.stock}
                value={selectedProducts.find(p => p.id === product.id)?.quantity || 0}
                onChange={e => handleProductChange(product.id, parseInt(e.target.value) || 0)}
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="border-t pt-4">
          <p className="text-lg font-semibold text-right">
            Toplam: ₺{calculateTotal().toFixed(2)}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!selectedSchool || selectedProducts.length === 0 || !!error}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Satış Oluştur
      </button>
    </form>
  );
}