import { useState, useEffect } from 'react';
import { Home, FolderKanban, ChevronRight, ClipboardList, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import MobileMenuButton from './MobileMenuButton';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const menuItems = [
    { 
      icon: Home, 
      label: 'Inicio', 
      path: '/',
      gradient: 'from-blue-500 to-indigo-500'
    },
    ...(user?.role === 'ADMIN' ? [{
      icon: Users,
      label: 'Gestión de Usuarios',
      path: '/users',
      gradient: 'from-amber-500 to-orange-500'
    }] : []),
    { 
      icon: FolderKanban, 
      label: 'Proyectos', 
      path: '/projects',
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      icon: ClipboardList, 
      label: 'Tareas', 
      path: '/tasks',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const isActivePage = (path : string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-[45] md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl w-64 min-h-screen flex flex-col relative overflow-hidden transition-transform duration-300 ease-in-out z-[50] ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Background decorative elements */}
        {/*<div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-br-3xl"></div>*/}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-500/10 to-teal-500/10 rounded-tl-3xl"></div>
        
        <div className="relative z-10 p-4 md:p-6 flex flex-col h-full">
          {/* Header */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TaskManager
                </h2>
              </div>
              <div className="w-10 md:w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2"></div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 md:gap-3 flex-1">
            {menuItems.map((item, index) => (
              <div
                key={item.path}
                className={`transform transition-all duration-700 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              >
                <Link 
                  to={item.path} 
                  onClick={closeMobileMenu}
                  className={`group relative flex items-center gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isActivePage(item.path)
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:text-white`
                      : 'text-slate-700 hover:bg-white/70 hover:shadow-md hover:text-slate-700'
                  }`}
                >
                  <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300 ${
                    isActivePage(item.path)
                      ? 'bg-white/20'
                      : `bg-gradient-to-r ${item.gradient} text-white group-hover:scale-110`
                  }`}>
                    <item.icon size={18} className={isActivePage(item.path) ? 'text-white' : ''} />
                  </div>
                  
                  <span className="font-medium flex-1 text-sm md:text-base">{item.label}</span>
                  
                  {isActivePage(item.path) && (
                    <ChevronRight size={14} className="text-white/70" />
                  )}
                  
                  {/* Active indicator */}
                  {isActivePage(item.path) && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 md:h-8 bg-white rounded-r-full shadow-lg"></div>
                  )}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}