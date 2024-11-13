import React, { useState } from 'react';
import { School, Package, DollarSign, Calculator, Calendar } from 'lucide-react';
import { SystemLogo } from './components/SystemLogo';
import Schools from './pages/Schools';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Accounting from './pages/Accounting';
import Appointments from './pages/Appointments';
import SystemLogs from './pages/SystemLogs';

function App() {
  const [activeTab, setActiveTab] = useState('schools');

  const menuItems = [
    { id: 'schools', label: 'Okullar', icon: School },
    { id: 'inventory', label: 'Stok', icon: Package },
    { id: 'sales', label: 'Satışlar', icon: DollarSign },
    { id: 'accounting', label: 'Muhasebe', icon: Calculator },
    { id: 'appointments', label: 'Randevularım', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <SystemLogo onLogoClick={() => setActiveTab('logs')} />
            <div className="flex space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-4 text-sm font-medium flex items-center gap-2 border-b-2 ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'schools' && <Schools />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'sales' && <Sales />}
        {activeTab === 'accounting' && <Accounting />}
        {activeTab === 'appointments' && <Appointments />}
        {activeTab === 'logs' && <SystemLogs />}
      </main>
    </div>
  );
}

export default App;