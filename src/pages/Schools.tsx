import React, { useState, useEffect } from 'react';
import { read, utils } from 'xlsx';
import { SearchBar } from '../components/SearchBar';
import { DistrictSelector } from '../components/DistrictSelector';
import { SchoolCard } from '../components/SchoolCard';
import { AdminPanel } from '../components/AdminPanel';
import type { School } from '../types';

export default function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [userLocation, setUserLocation] = useState<GeolocationPosition>();
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    // Load saved schools data
    const savedSchools = localStorage.getItem('schools');
    if (savedSchools) {
      const data = JSON.parse(savedSchools);
      setSchools(data);
      setDistricts(Array.from(new Set(data.map((school: School) => school.ILCE_ADI))).sort());
    }

    // Get user location
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation(position),
      (error) => console.error('Error getting location:', error)
    );
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json<School>(worksheet);

      const uniqueDistricts = Array.from(
        new Set(data.map((school) => school.ILCE_ADI))
      ).sort();

      localStorage.setItem('schools', JSON.stringify(data));
      setSchools(data);
      setDistricts(uniqueDistricts);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const handleClearData = () => {
    localStorage.removeItem('schools');
    setSchools([]);
    setDistricts([]);
  };

  const handleAddSchool = (newSchool: Omit<School, 'id'>) => {
    const updatedSchools = [...schools, newSchool];
    setSchools(updatedSchools);
    localStorage.setItem('schools', JSON.stringify(updatedSchools));
    
    // Update districts if new district
    if (!districts.includes(newSchool.ILCE_ADI)) {
      setDistricts([...districts, newSchool.ILCE_ADI].sort());
    }
  };

  const handleCreateDistrictRoute = () => {
    const districtSchools = schools.filter(
      (school) => school.ILCE_ADI === selectedDistrict
    );

    if (districtSchools.length === 0) return;

    let waypoints = '';
    
    // İlk 25 okulu al (Google Maps sınırı)
    const limitedSchools = districtSchools.slice(0, 25);

    if (userLocation) {
      // Kullanıcı konumundan başla
      const origin = `${userLocation.coords.latitude},${userLocation.coords.longitude}`;
      waypoints = limitedSchools
        .map((school) => encodeURIComponent(school.ADRES))
        .join('/');
      
      window.open(
        `https://www.google.com/maps/dir/${origin}/${waypoints}`,
        '_blank'
      );
    } else {
      // İlk okulu başlangıç noktası yap
      const [first, ...rest] = limitedSchools;
      const origin = encodeURIComponent(first.ADRES);
      waypoints = rest
        .map((school) => encodeURIComponent(school.ADRES))
        .join('/');
      
      window.open(
        `https://www.google.com/maps/dir/${origin}/${waypoints}`,
        '_blank'
      );
    }
  };

  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.OKUL_ADI.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.ADRES.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict =
      selectedDistrict === 'all' || school.ILCE_ADI === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Okullar</h1>
        <AdminPanel
          onUpload={handleFileUpload}
          onClearData={handleClearData}
          onAddSchool={handleAddSchool}
          hasData={schools.length > 0}
        />
      </div>

      {schools.length > 0 && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
            <DistrictSelector
              districts={districts}
              selectedDistrict={selectedDistrict}
              onDistrictChange={setSelectedDistrict}
              onCreateRoute={handleCreateDistrictRoute}
              showRouteButton={true}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={`${school.OKUL_ADI}-${school.ILCE_ADI}`}
                school={school}
                userLocation={userLocation}
              />
            ))}
          </div>

          {filteredSchools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Arama kriterlerine uygun okul bulunamadı.
              </p>
            </div>
          )}
        </div>
      )}

      {schools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Admin panelinden Excel yükleyerek veya yeni okul ekleyerek başlayın.</p>
        </div>
      )}
    </div>
  );
}