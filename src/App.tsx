import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import GDPRConsent from './components/GDPRConsent';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Wrench className="h-8 w-8 text-blue-600" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900">Fluent</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Navigation />
          <main className="mt-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </main>
        </div>

        {/* GDPR Consent Banner */}
        <GDPRConsent />
      </div>
    </Router>
  );
}

export default App;