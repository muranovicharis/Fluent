import React, { useState } from 'react';
import { PlusCircle, Search, Filter, Calendar, Clock, PenTool as Tool, DollarSign, Tag, ChevronDown } from 'lucide-react';

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const orders = [
    {
      id: 'ORD-2024-001',
      customer: 'Maria Schmidt',
      service: 'Brake Repair',
      status: 'in_progress',
      priority: 'high',
      technician: 'John Doe',
      created: '2024-02-15',
      estimated: '2024-02-17',
      total: '€450',
      parts: [
        { name: 'Brake Pads', quantity: 2, price: '€120' },
        { name: 'Brake Fluid', quantity: 1, price: '€30' }
      ]
    },
    {
      id: 'ORD-2024-002',
      customer: 'Thomas Weber',
      service: 'Oil Change',
      status: 'open',
      priority: 'medium',
      technician: 'Jane Smith',
      created: '2024-02-16',
      estimated: '2024-02-16',
      total: '€85',
      parts: [
        { name: 'Oil Filter', quantity: 1, price: '€15' },
        { name: 'Engine Oil', quantity: 5, price: '€50' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Order
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{order.id}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                    </div>
                    <div className="text-lg font-medium text-gray-900">
                      {order.total}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{order.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{order.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Technician</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{order.technician}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Completion</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{order.estimated}</p>
                    </div>
                  </div>
                  
                  {/* Parts Used */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Parts Used</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {order.parts.map((part, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {part.name} ({part.quantity}x) - {part.price}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4">
                  <button className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-50">
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}