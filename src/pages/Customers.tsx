import React, { useState } from 'react';
import { UserPlus, Mail, Phone, MapPin, Search, Filter, Download, Upload, MoreVertical, Edit2, Trash2, MessageSquare } from 'lucide-react';

const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      id,
      encrypted_name,
      created_at,
      status,
      gdpr_consent,
      marketing_consent,
      orders:orders(count),
      invoices:invoices(sum:total_amount)
    `)
    .order('created_at', { ascending: false });

  return data?.map(customer => ({
    ...customer,
    name: decryptField(customer.encrypted_name), // Add decryption helper
  }));
};

export default function Customers() {
  const { data: customers } = useQuery(['customers'], fetchCustomers, {
    select: data => data.filter(c => 
      c.gdpr_consent && c.marketing_consent
    )
  });
  
export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const customers = [
    {
      id: 1,
      name: 'Maria Schmidt',
      email: 'maria.schmidt@example.com',
      phone: '+43 123 456789',
      address: 'Hauptstraße 1, 1010 Wien',
      status: 'active',
      lastOrder: '2024-01-15',
      totalOrders: 3,
      totalRevenue: '€2,450',
      tags: ['VIP', 'Regular'],
      gdprConsent: true,
      marketingConsent: true
    },
    {
      id: 2,
      name: 'Thomas Weber',
      email: 'thomas.weber@example.com',
      phone: '+43 987 654321',
      address: 'Mariahilfer Straße 10, 1060 Wien',
      status: 'inactive',
      lastOrder: '2023-12-20',
      totalOrders: 1,
      totalRevenue: '€850',
      tags: ['New'],
      gdprConsent: true,
      marketingConsent: false
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <div className="flex space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
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
            placeholder="Search customers..."
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

      {/* Customer List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GDPR Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          {customer.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status}
                    </span>
                    {customer.tags.map((tag) => (
                      <span key={tag} className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{customer.totalOrders} orders</div>
                    <div className="text-sm text-gray-500">Last: {customer.lastOrder}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{customer.totalRevenue}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.gdprConsent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        GDPR: {customer.gdprConsent ? 'Consented' : 'Pending'}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.marketingConsent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        Marketing: {customer.marketingConsent ? 'Opted In' : 'Opted Out'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <MessageSquare className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}