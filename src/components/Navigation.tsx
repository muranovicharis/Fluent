import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, ClipboardList, Package } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Orders', href: '/orders', icon: ClipboardList },
  { name: 'Inventory', href: '/inventory', icon: Package },
];

export default function Navigation() {
  return (
    <nav className="bg-white shadow rounded-lg">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `inline-flex items-center px-4 py-2 text-sm font-medium ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}