import React, { useState } from 'react';
import { Settings, Upload, Trash2, Plus } from 'lucide-react';
import { FileUpload } from './FileUpload';
import type { School } from '../types';

interface AdminPanelProps {
  onUpload: (file: File) => void;
  onClearData: () => void;
  onAddSchool: (school: Omit<School, 'id'>) => void;
  hasData: boolean;
}

export function AdminPanel({ onUpload, onClearData, onAddSchool, hasData }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddSchoolOpen, setIsAddSchoolOpen] = useState(false);

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newSchool = {
      IL_ADI: formData.get('il_adi') as string,
      ILCE_ADI: formData.get('ilce_adi') as string,
      OKUL_ADI: formData.get('okul_adi') as string,
      ADRES: formData.get('adres') as string,
      TELEFON: formData.get('telefon') as string,
      WEB_ADRES: formData.get('web_adres') as string,
    };
    onAddSchool(newSchool);
    setIsAddSchoolOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        <Settings className="w-5 h-5" />
        Admin
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-4 space-y-3">
            <button
              onClick={() => setIsAddSchoolOpen(true)}
              className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Yeni Okul Ekle
            </button>
            <FileUpload onUpload={onUpload} />
            {hasData && (
              <button
                onClick={onClearData}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Verileri Sil
              </button>
            )}
          </div>
        </div>
      )}

      {isAddSchoolOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Yeni Okul Ekle</h2>
            <form onSubmit={handleAddSchool} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">İl</label>
                <input
                  type="text"
                  name="il_adi"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">İlçe</label>
                <input
                  type="text"
                  name="ilce_adi"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Okul Adı</label>
                <input
                  type="text"
                  name="okul_adi"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Adres</label>
                <textarea
                  name="adres"
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <input
                  type="tel"
                  name="telefon"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Web Adresi</label>
                <input
                  type="url"
                  name="web_adres"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddSchoolOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}