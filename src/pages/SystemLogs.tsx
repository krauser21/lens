import React from 'react';
import { SystemLogs as LogsList } from '../components/SystemLogs';

export default function SystemLogs() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg p-6">
        <LogsList />
      </div>
    </div>
  );
}