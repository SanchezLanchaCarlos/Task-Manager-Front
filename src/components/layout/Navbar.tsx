import { useState, useEffect } from 'react';
import UserMenu from './UserMenu';
import { getUserById } from '../../api/users';
import { User } from '../../api/users';
import { useAuth } from '../../context/AuthContext';


export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser } = useAuth();

  useEffect(() => {
    setIsVisible(true);

    if (authUser) {
      getUserById(authUser.id).then((data: User) => {
        setUser(data);
      });
    }
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg px-6 py-4 relative overflow-visible z-40">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-blue-500/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-32 h-full bg-gradient-to-r from-indigo-500/5 to-transparent"></div>
      
      <div className="relative z-10 flex justify-between items-center px-6">
        {/* Left section */}
        <div className={`flex items-center gap-6 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
        </div>

        {/* Right section */}
        <div className={`flex items-center gap-4 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'} ml-auto`}>
          {user && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}