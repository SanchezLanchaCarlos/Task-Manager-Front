import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    // Delay content animation to let sidebar and navbar animate first
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 max-w-screen max-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col relative">
        {/* Navbar */}
        <Navbar />
        
        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Responsive background elements */}
            <div className="absolute top-20 right-4 sm:right-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute bottom-20 left-4 sm:left-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-tr from-emerald-200/15 to-teal-200/15 rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 sm:left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-bl from-purple-200/10 to-pink-200/10 rounded-full blur-2xl sm:blur-3xl"></div>
          </div>

          {/* Content container */}
          <div 
            className={`relative z-10 p-2 sm:p-4 md:p-6 transform transition-all duration-1000 ${
              isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {/* Content wrapper with subtle background */}
            <div className="min-h-full">
              <Outlet />
            </div>
          </div>

          {/* Subtle pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </main>
      </div>
    </div>
  );
}