import { User } from '../../api/users';
import { Trash2, Pencil, Loader2, User as UserIcon, Mail, Shield, Calendar } from 'lucide-react';
import { useState } from 'react';
import EditUserModal from './EditUserModal';

type FilterType = 'username' | 'email' | 'role' | 'date';

interface UserGridProps {
  users: User[];
  loading: boolean;
  searchTerm: string;
  isVisible: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, userData: Partial<User>) => Promise<void>;
}

export default function UserGrid({ users, loading, searchTerm, isVisible, onDelete, onEdit }: UserGridProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('username');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    switch (activeFilter) {
      case 'username':
        return user.username.toLowerCase().includes(searchLower);
      case 'email':
        return user.email.toLowerCase().includes(searchLower);
      case 'role':
        return user.role === 'USER' ? 'Usuario'.toLowerCase().includes(searchLower) : 'Administrador'.toLowerCase().includes(searchLower);
      case 'date':
        return user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES').includes(searchLower) : false;
      default:
        return true;
    }
  });

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleEditSubmit = async (userData: Partial<User>) => {
    if (editingUser) {
      await onEdit(editingUser.id, userData);
      setEditingUser(null);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await onDelete(userToDelete);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filterButtons = [
    { type: 'username' as FilterType, icon: UserIcon, label: 'Usuario' },
    { type: 'email' as FilterType, icon: Mail, label: 'Email' },
    { type: 'role' as FilterType, icon: Shield, label: 'Rol' },
    { type: 'date' as FilterType, icon: Calendar, label: 'Fecha' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Cargando usuarios...</p>
      </div>
    );
  }

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No se encontraron usuarios</p>
      </div>
    );
  }

  return (
    <>
      <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="flex flex-wrap gap-2">
              {filterButtons.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    activeFilter === type
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Fecha de Registro
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}
                            alt={user.username}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'ADMIN' ? 'Administrador' :
                         'Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'No disponible'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-slate-400 hover:text-blue-600 transition-colors duration-200"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors duration-200"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onEdit={handleEditSubmit}
          user={editingUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">¿Eliminar usuario?</h3>
            <p className="text-slate-600 mb-6">
              Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este usuario?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2 text-red-500 hover:text-red-600 bg-red-100 font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 