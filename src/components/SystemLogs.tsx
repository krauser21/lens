import React, { useEffect, useState } from 'react';
import { Calendar, Clock, FileText, DollarSign, Package, CheckCircle, XCircle } from 'lucide-react';
import type { Sale, Appointment, Transaction } from '../types';

interface Log {
  id: string;
  type: 'sale' | 'appointment' | 'transaction' | 'inventory';
  action: string;
  description: string;
  date: string;
  status?: string;
}

export function SystemLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    const sales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
    const appointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');

    const allLogs: Log[] = [
      ...sales.map(sale => ({
        id: sale.id,
        type: 'sale' as const,
        action: 'Satış',
        description: `${sale.schoolId} - Toplam: ₺${sale.totalAmount.toFixed(2)}`,
        date: sale.date,
        status: sale.totalAmount > (sale.paidAmount || 0) ? 'pending' : 'completed'
      })),
      ...appointments.map(appointment => ({
        id: appointment.id,
        type: 'appointment' as const,
        action: 'Randevu',
        description: `${appointment.schoolId} - ${appointment.title}`,
        date: `${appointment.date}T${appointment.time}`,
        status: appointment.status
      })),
      ...transactions.map(transaction => ({
        id: transaction.id,
        type: 'transaction' as const,
        action: transaction.type === 'income' ? 'Gelir' : 'Gider',
        description: `${transaction.category} - ₺${transaction.amount.toFixed(2)}`,
        date: transaction.date,
        status: 'completed'
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setLogs(allLogs);
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'pending') return log.status === 'pending';
    return log.status === 'completed';
  });

  const getIcon = (type: Log['type']) => {
    switch (type) {
      case 'sale':
        return <DollarSign className="w-5 h-5" />;
      case 'appointment':
        return <Calendar className="w-5 h-5" />;
      case 'transaction':
        return <FileText className="w-5 h-5" />;
      case 'inventory':
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status?: string) => {
    if (!status) return '';
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'pending':
        return 'Bekliyor';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tüm İşlemler</option>
          <option value="pending">Bekleyenler</option>
          <option value="completed">Tamamlananlar</option>
        </select>
      </div>

      <div className="space-y-2">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className={`p-2 rounded-full ${
              log.type === 'sale' ? 'bg-green-100 text-green-600' :
              log.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              {getIcon(log.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{log.action}</span>
                {log.status && (
                  <div className="flex items-center gap-1">
                    {getStatusIcon(log.status)}
                    <span className="text-sm text-gray-600">
                      {getStatusText(log.status)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-600">{log.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(log.date).toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Kayıtlı işlem bulunmamaktadır.
          </div>
        )}
      </div>
    </div>
  );
}