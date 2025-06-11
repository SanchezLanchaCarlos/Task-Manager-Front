import { X, UserPlus, ChevronDown } from 'lucide-react';
import { User } from '../../api/users';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  availableUsers: User[];
  selectedUser: string;
  selectedRole: 'OWNER' | 'MEMBER';
  onUserChange: (userId: string) => void;
  onRoleChange: (role: 'OWNER' | 'MEMBER') => void;
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 transform transition-all duration-300 scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Añadir Miembro</h2>
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
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 appearance-none bg-white"
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
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 appearance-none bg-white"
                >
                  <option value="MEMBER">Miembro</option>
                  <option value="OWNER">Propietario</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={onAdd}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200 flex items-center gap-2"
              >
                <UserPlus size={18} />
                Añadir Miembro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 