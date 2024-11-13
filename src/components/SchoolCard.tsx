import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Globe, Navigation, ChevronDown, ChevronUp, StickyNote, X, Save, AlertCircle } from 'lucide-react';
import type { School, Sale } from '../types';

interface Note {
  content: string;
  date: string;
}

interface SchoolCardProps {
  school: School;
  userLocation?: GeolocationPosition;
}

export function SchoolCard({ school, userLocation }: SchoolCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [totalDebt, setTotalDebt] = useState(0);

  useEffect(() => {
    // Load notes
    const savedNotes = localStorage.getItem(`school-notes-${school.OKUL_ADI}`);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(Array.isArray(parsedNotes) ? parsedNotes : []);
      } catch (error) {
        console.error('Error loading notes:', error);
        setNotes([]);
      }
    }

    // Calculate total debt
    const sales: Sale[] = JSON.parse(localStorage.getItem('sales') || '[]');
    const schoolSales = sales.filter(sale => sale.schoolId === school.OKUL_ADI);
    const debt = schoolSales.reduce((total, sale) => {
      return total + (sale.totalAmount - (sale.paidAmount || 0));
    }, 0);
    setTotalDebt(debt);
  }, [school.OKUL_ADI]);

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;

    const newNote = {
      content: currentNote,
      date: new Date().toISOString(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`school-notes-${school.OKUL_ADI}`, JSON.stringify(updatedNotes));
    setCurrentNote('');
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    localStorage.setItem(`school-notes-${school.OKUL_ADI}`, JSON.stringify(updatedNotes));
  };

  const handleNavigate = () => {
    if (userLocation) {
      const origin = `${userLocation.coords.latitude},${userLocation.coords.longitude}`;
      const destination = encodeURIComponent(school.ADRES);
      window.open(`https://www.google.com/maps/dir/${origin}/${destination}`, '_blank');
    } else {
      const destination = encodeURIComponent(school.ADRES);
      window.open(`https://www.google.com/maps/search/?api=1&query=${destination}`, '_blank');
    }
  };

  const formatWebAddress = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `http://${url}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  return (
    <div className={`rounded-lg shadow-sm transition-colors ${
      isSelected ? 'border-2 border-blue-700' : 'border-2 border-transparent'
    }`}>
      <div className="bg-blue-600 p-4 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white truncate">{school.OKUL_ADI}</h3>
              {totalDebt > 0 && (
                <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  <AlertCircle className="w-3 h-3" />
                  <span>Borç: {formatCurrency(totalDebt)}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-blue-100 mt-1">{school.ILCE_ADI}</p>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-white p-4 rounded-b-lg space-y-4">
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
            <span className="text-sm flex-1">{school.ADRES}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-5 h-5" />
            <a href={`tel:${school.TELEFON}`} className="text-sm hover:text-blue-600">
              {school.TELEFON}
            </a>
          </div>

          {school.WEB_ADRES && (
            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-5 h-5" />
              <a
                href={formatWebAddress(school.WEB_ADRES)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-blue-600"
              >
                {school.WEB_ADRES}
              </a>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={handleNavigate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Navigation className="w-5 h-5" />
              Rota Oluştur
            </button>

            <button
              onClick={() => setIsNotesModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <StickyNote className="w-5 h-5" />
              {notes.length > 0 ? 'Notları Düzenle' : 'Not Ekle'}
            </button>
          </div>
        </div>
      )}

      {isNotesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{school.OKUL_ADI} - Notlar</h3>
              <button
                onClick={() => setIsNotesModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Yeni not ekleyin..."
                  className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={!currentNote.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Notu Kaydet
                </button>
              </div>

              {notes.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-medium">Önceki Notlar</h4>
                  {notes.map((note, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-500">
                          {new Date(note.date).toLocaleString('tr-TR')}
                        </span>
                        <button
                          onClick={() => handleDeleteNote(index)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}