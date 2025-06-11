import { useState } from 'react';
import { Plus, Loader2, User, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (username: string, email: string, password: string, role: string) => Promise<void>;
  loading: boolean;
}

export default function CreateUserModal({ isOpen, onClose, onSubmit, loading }: CreateUserModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    await onSubmit(username, email, password, role);
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('USER');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-amber-500 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
            <Plus className="w-6 h-6 text-amber-500" />
            Crear Nuevo Usuario
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de usuario
            </label>
            <div className="relative">
              <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-2 rounded-full shadow-lg ml-3">
                <User size={20} />
              </div>
              <input
                type="text"
                placeholder="Nombre de usuario"
                className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-slate-300 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all duration-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 p-2 rounded-full shadow-lg ml-3">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-slate-300 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-300 ml-3">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full pl-14 pr-12 py-4 bg-slate-100/70 backdrop-blur-sm border border-slate-300 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de cuenta
            </label>
            <div className="relative">
              <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 p-2 rounded-full shadow-lg ml-3">
                <Shield size={20} />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-slate-300 rounded-2xl text-slate-700 outline-none focus:bg-white/80 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all duration-300 appearance-none cursor-pointer"
                disabled={loading}
              >
                <option value="USER">Usuario</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all duration-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !username || !email || !password}
              className={`px-6 py-2 rounded-xl font-semibold text-white transition-all duration-300 flex items-center gap-2 ${
                loading || !username || !email || !password
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Crear Usuario
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 