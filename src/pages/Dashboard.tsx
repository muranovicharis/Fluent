import React from 'react';
import { BarChart3, Users, ClipboardList, Package, TrendingUp, Calendar, Bell, Clock } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Active Orders', value: '12', icon: ClipboardList, trend: '+2 this week' },
    { name: 'Customers', value: '48', icon: Users, trend: '+5 this month' },
    { name: 'Revenue (MTD)', value: '€14,250', icon: BarChart3, trend: '+8.3% vs. last month' },
    { name: 'Low Stock Items', value: '3', icon: Package, trend: 'Reorder needed' },
  ];

  const recentActivities = [
    { id: 1, type: 'order', title: 'New repair order', customer: 'Maria Schmidt', time: '2 hours ago' },
    { id: 2, type: 'inventory', title: 'Low stock alert', item: 'Brake pads', time: '3 hours ago' },
    { id: 3, type: 'customer', title: 'New customer registration', customer: 'Thomas Weber', time: '5 hours ago' },
  ];

  const upcomingAppointments = [
    { id: 1, customer: 'Maria Schmidt', service: 'Oil Change', time: '10:00 AM', status: 'confirmed' },
    { id: 2, customer: 'Thomas Weber', service: 'Brake Inspection', time: '2:00 PM', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd className="text-lg font-semibold text-gray-900">{item.value}</dd>
                      <dd className="text-sm text-gray-600">{item.trend}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            {activity.type === 'order' && <ClipboardList className="h-5 w-5 text-blue-600" />}
                            {activity.type === 'inventory' && <Package className="h-5 w-5 text-blue-600" />}
                            {activity.type === 'customer' && <Users className="h-5 w-5 text-blue-600" />}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.title}{' '}
                              <span className="font-medium text-gray-900">
                                {activity.customer || activity.item}
                              </span>
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Appointments</h2>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {appointment.customer}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {appointment.service}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">
                          {appointment.time}
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}