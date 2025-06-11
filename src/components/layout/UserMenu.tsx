import { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  user: {
    username: string;
    email: string;
    avatar: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { icon: LogOut, label: 'Cerrar sesión', action: () => {handleLogout()}, danger: true }
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        onClick={toggleMenu}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
                className="h-8 w-10 rounded-full"
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}
                alt={user.username}
            />
        </div>
        <span className="hidden sm:block font-medium">{user.username}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown menu */}
      <div className={`absolute left-0 mt-3 w-full bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 overflow-hidden transform transition-all duration-300 origin-top-right ${
        isMenuOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
      }`}
      style={{ 
        zIndex: 9999,
        right: '-1.5rem'
      }}>
        <div className="p-4 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}
                    alt={user.username}
                />
            </div>
            <div>
              <p className="font-medium text-slate-800">{user.username}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>
        
        <div className="p-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 ${
                item.danger
                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-200 ${
                item.danger
                  ? 'bg-red-100 text-red-600'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                <item.icon size={16} />
              </div>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 