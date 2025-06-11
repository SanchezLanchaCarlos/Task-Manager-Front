import { useState, useEffect } from 'react';
import { User, getAllUsers, deleteUser, updateUser } from '../api/users';
import { register } from '../api/auth';
import UserGrid from '../components/users/UserGrid';
import CreateUserModal from '../components/users/CreateUserModal';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar los usuarios');
        setLoading(false);
      });
  }, []);

  // Auto hide messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const handleCreate = async (username: string, email: string, password: string, role: string) => {
    setLoading(true);
    try {
      await register(email, password, username, role);
      // Recargar la lista de usuarios después de crear uno nuevo
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
      setSuccessMessage('Usuario creado con éxito');
      setIsModalOpen(false);
    } catch (error) {
      setError('Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setSuccessMessage('Usuario eliminado con éxito');
    } catch (error) {
      setError('Error al eliminar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string, userData: Partial<User>) => {
    try {
      await updateUser(id, userData);
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
      setSuccessMessage('Usuario actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setErrorMessage('Error al actualizar el usuario');
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete || loading) return;
    setLoading(true);
    try {
      await deleteUser(userToDelete);
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
      setSuccessMessage('Usuario eliminado con éxito');
    } catch (error) {
      setError('Error al eliminar el usuario');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="p-6 md:p-8">
        {/* Header Section */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
                Gestión de Usuarios
              </h1>
              <p className="text-slate-600">Administra los usuarios de la plataforma</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar usuarios..."
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-2xl flex items-center gap-3 text-green-700">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Users Grid */}
        <UserGrid
          users={users}
          loading={loading}
          searchTerm={searchTerm}
          isVisible={isVisible}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          loading={loading}
        />

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
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
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
      </div>
    </div>
  );
} 