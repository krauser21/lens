import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import { AppointmentList } from '../components/appointments/AppointmentList';
import { AppointmentFilter } from '../components/appointments/AppointmentFilter';
import type { Appointment } from '../types';

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
  };

  const handleAddAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment = {
      ...appointmentData,
      id: crypto.randomUUID(),
    };
    saveAppointments([...appointments, newAppointment]);
    setIsFormOpen(false);
  };

  const handleEditAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    if (!editingAppointment) return;
    
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === editingAppointment.id
        ? { ...appointmentData, id: appointment.id }
        : appointment
    );
    saveAppointments(updatedAppointments);
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    saveAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
  };

  const handleUpdateStatus = (appointmentId: string, status: Appointment['status']) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status }
        : appointment
    );
    saveAppointments(updatedAppointments);
  };

  const filteredAppointments = appointments
    .filter(appointment => {
      const matchesSearch = (
        appointment.schoolId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Randevularım</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Yeni Randevu
        </button>
      </div>

      <AppointmentFilter
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="mt-6">
        <AppointmentList
          appointments={filteredAppointments}
          onEdit={setEditingAppointment}
          onDelete={handleDeleteAppointment}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {(isFormOpen || editingAppointment) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">
              {editingAppointment ? 'Randevu Düzenle' : 'Yeni Randevu'}
            </h2>
            <AppointmentForm
              initialAppointment={editingAppointment || undefined}
              onSubmit={editingAppointment ? handleEditAppointment : handleAddAppointment}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingAppointment(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}