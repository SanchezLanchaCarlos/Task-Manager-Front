import { X, UserPlus, ChevronDown, Loader2 } from 'lucide-react';
import { User } from '../../api/users';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  availableUsers: User[];
  selectedUser: string;
  selectedRole: 'OWNER' | 'MEMBER' | 'MANAGER';
  onUserChange: (userId: string) => void;
  onRoleChange: (role: 'OWNER' | 'MEMBER' | 'MANAGER') => void;
  isLoading: boolean;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  onAdd,
  availableUsers,
  selectedUser,
  selectedRole,
  onUserChange,
  onRoleChange,
  isLoading
}: AddMemberModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            Añadir Miembro
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Seleccionar Usuario
            </label>
            <div className="relative">
              <select
                value={selectedUser}
                onChange={(e) => onUserChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-800 appearance-none"
                disabled={isLoading}
              >
                <option value="">Seleccionar usuario...</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rol en el Proyecto
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => onRoleChange(e.target.value as 'OWNER' | 'MEMBER')}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-800 appearance-none"
                disabled={isLoading}
                defaultValue="MEMBER"
              >
                <option value="MEMBER">Miembro</option>
                <option value="OWNER">Propietario</option>
                <option value="MANAGER">Manager</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={onAdd}
              disabled={isLoading || !selectedUser}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Añadiendo...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Añadir Miembro
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 