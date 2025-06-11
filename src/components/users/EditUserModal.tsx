import { useState, useEffect } from 'react';
import { X, User, Mail, Shield } from 'lucide-react';
import { User as UserType } from '../../api/users';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (userData: Partial<UserType>) => Promise<void>;
  user: UserType;
}

export default function EditUserModal({ isOpen, onClose, onEdit, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    role: user.role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const hasAnyChanges = 
      formData.username !== user.username ||
      formData.email !== user.email ||
      formData.role !== user.role;
    setHasChanges(hasAnyChanges);
  }, [formData, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onEdit(formData);
      onClose();
    } catch (error) {
      console.error('Error al editar usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-amber-500 to-orange-500 bg-clip-text text-transparent mb-8">Editar Usuario</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
              Nombre de Usuario
            </label>
            <div className="relative">
              <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-2 rounded-full shadow-lg ml-3">
                <User size={20} />
              </div>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-slate-300 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 p-2 rounded-full shadow-lg ml-3">
                <Mail size={20} />
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-slate-300 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
              Rol
            </label>
            <div className="relative">
              <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 p-2 rounded-full shadow-lg ml-3">
                <Shield size={20} />
              </div>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'ADMIN' })}
                className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-slate-300 rounded-2xl text-slate-700 outline-none focus:bg-white/80 focus:border-amber-300 focus:ring-4 focus:ring-amber-100 transition-all duration-300 appearance-none cursor-pointer"
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

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !hasChanges}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 