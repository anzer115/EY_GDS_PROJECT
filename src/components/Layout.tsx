import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { signOut } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex h-16 items-center justify-center border-b">
            <h1 className="text-xl font-bold text-gray-900">Project Hub</h1>
          </div>
          <nav className="mt-6 px-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1
                    ${location.pathname === item.href
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={signOut}
              className="w-full mt-4 group flex items-center px-4 py-3 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}