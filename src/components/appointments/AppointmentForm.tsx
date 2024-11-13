import React, { useState } from 'react';
import type { Appointment, School } from '../../types';

interface AppointmentFormProps {
  initialAppointment?: Appointment;
  onSubmit: (appointment: Omit<Appointment, 'id'>) => void;
  onCancel: () => void;
}

export function AppointmentForm({
  initialAppointment,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    schoolId: initialAppointment?.schoolId || '',
    title: initialAppointment?.title || '',
    description: initialAppointment?.description || '',
    date: initialAppointment?.date || '',
    time: initialAppointment?.time || '',
    status: initialAppointment?.status || 'pending',
    notes: initialAppointment?.notes || '',
  });

  const schools: School[] = JSON.parse(localStorage.getItem('schools') || '[]');
  const uniqueSchools = Array.from(new Map(schools.map(s => [s.OKUL_ADI, s])).values());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Okul
        </label>
        <select
          value={formData.schoolId}
          onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Okul Seçin</option>
          {uniqueSchools.map((school) => (
            <option key={school.OKUL_ADI} value={school.OKUL_ADI}>
              {school.OKUL_ADI}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Başlık
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tarih
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Saat
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {initialAppointment && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Durum
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Appointment['status'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="pending">Bekliyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notlar
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Ek notlar..."
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
          {initialAppointment ? 'Güncelle' : 'Ekle'}
        </button>
      </div>
    </form>
  );
}