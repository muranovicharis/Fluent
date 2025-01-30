import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { PackagePlus, Search, Filter, AlertTriangle, BarChart2 } from 'lucide-react';

const fetchInventory = async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('stock', { ascending: true });

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
  return data;
};

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const loadInventory = async () => {
      const data = await fetchInventory();
      setInventory(data);
    };
    loadInventory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        <div className="flex space-x-4">
          <button className="btn">
            <BarChart2 className="h-4 w-4 mr-2" />
            Reports
          </button>
          <button className="btn btn-primary">
            <PackagePlus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn" onClick={() => console.log('Filter')}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Inventory Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
            <th>Supplier</th>
            <th>Location</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.stock}</td>
              <td>{item.supplier}</td>
              <td>{item.location}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Alerts */}
      <div className="flex items-center text-yellow-600">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <p>Low stock items: {inventory.filter((item) => item.stock < 10).length}</p>
      </div>
    </div>
  );
}
