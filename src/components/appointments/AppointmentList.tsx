import React from 'react';
import { Edit2, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Appointment } from '../../types';

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
}

export function AppointmentList({
  appointments,
  onEdit,
  onDelete,
  onUpdateStatus,
}: AppointmentListProps) {
  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bekliyor';
    }
  };

  const getStatusClass = (status: Appointment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Henüz randevu bulunmamaktadır.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{appointment.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>
              <p className="text-gray-600">{appointment.schoolId}</p>
              <p className="text-sm text-gray-500">
                {new Date(appointment.date).toLocaleDateString('tr-TR')} - {appointment.time}
              </p>
              <p className="text-gray-700">{appointment.description}</p>
              {appointment.notes && (
                <p className="text-sm text-gray-600 italic">
                  Not: {appointment.notes}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              {appointment.status === 'pending' && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => onUpdateStatus(appointment.id, 'completed')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Tamamlandı olarak işaretle"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="İptal et"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
              <button
                onClick={() => onEdit(appointment)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Düzenle"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(appointment.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Sil"
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