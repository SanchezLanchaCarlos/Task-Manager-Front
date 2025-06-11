import { useEffect, useState, useCallback, memo } from "react";
import { Users, CheckSquare, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { Project } from "../api/projects";
import { getProjectById, updateProject } from "../api/projects";
import { getProjectMembers } from "../api/members";
import { getUserById, User as UserType, getAllUsers } from "../api/users";
import MemberCard from "../components/members/MemberCard";
import TaskCard from "../components/tasks/TaskCard";
import ProjectHeader from "../components/projects/ProjectHeader";
import ProjectInfo from "../components/projects/ProjectInfo";
import AddMemberModal from "../components/projects/AddMemberModal";
import NotificationMessages from "../components/projects/NotificationMessages";

interface ProjectState {
  data: Project | null;
  isLoading: boolean;
  error: string | null;
}

// Componentes memoizados para evitar re-renders innecesarios
const MemoizedMemberCard = memo(MemberCard);
const MemoizedTaskCard = memo(TaskCard);

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [projectState, setProjectState] = useState<ProjectState>({
    data: null,
    isLoading: true,
    error: null
  });
  const [members, setMembers] = useState<UserType[]>([]);
  const [tasks, setTasks] = useState<{ id: number; title: string; status: string; priority: string }[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'OWNER' | 'MEMBER'>('MEMBER');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const loadProjectData = useCallback(async () => {
    if (!id) return;
    
    setProjectState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const [projectData, projectMembers] = await Promise.all([
        getProjectById(id),
        getProjectMembers(id)
      ]);
      
      const membersPromises = projectMembers.map(async (member) => {
        const user = await getUserById(member.userId);
        user.role = member.role;
        return user;
      });

      const membersData = await Promise.all(membersPromises);
      const tasksData = [
        { id: 1, title: "Diseñar interfaz de usuario", status: "COMPLETED", priority: "HIGH" },
        { id: 2, title: "Implementar autenticación", status: "IN_PROGRESS", priority: "HIGH" },
        { id: 3, title: "Configurar base de datos", status: "COMPLETED", priority: "MEDIUM" },
        { id: 4, title: "Escribir documentación", status: "PENDING", priority: "LOW" },
        { id: 5, title: "Pruebas de integración", status: "IN_PROGRESS", priority: "MEDIUM" }
      ];

      setProjectState({ data: projectData, isLoading: false, error: null });
      setNewName(projectData.name);
      setNewDescription(projectData.description);
      setMembers(membersData);
      setTasks(tasksData);
      
      requestAnimationFrame(() => setIsVisible(true));
    } catch (error) {
      setProjectState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al cargar el proyecto' 
      }));
    }
  }, [id]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  const handleEdit = useCallback(async () => {
    if (!id || !projectState.data) return;
    
    try {
      const updated = await updateProject(id, { name: newName, description: newDescription });
      setProjectState(prev => ({ 
        ...prev, 
        data: {
          ...prev.data!,
          name: updated.name,
          description: updated.description
        }
      }));
      setIsEditing(false);
      setSuccessMessage('Proyecto actualizado con éxito');
    } catch (error) {
      setError('Error al actualizar el proyecto');
    }
  }, [id, newName, newDescription, projectState.data]);

  const handleCancelEdit = useCallback(() => {
    if (!projectState.data) return;
    setIsEditing(false);
    setNewName(projectState.data.name);
    setNewDescription(projectState.data.description);
  }, [projectState.data]);

  const loadAvailableUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const users = await getAllUsers();
      const currentMemberIds = members.map(member => member.id);
      const availableUsers = users.filter(user => !currentMemberIds.includes(user.id));
      setAvailableUsers(availableUsers);
    } catch (error) {
      setError('Error al cargar los usuarios disponibles');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [members]);

  const handleAddMember = useCallback(async () => {
    if (!selectedUser) {
      setError('Por favor, selecciona un usuario');
      return;
    }

    try {
      // Aquí iría la llamada a la API para añadir el miembro
      setIsAddMemberModalOpen(false);
      setSuccessMessage('Miembro añadido correctamente');
      loadProjectData();
    } catch (error) {
      setError('Error al añadir el miembro');
    }
  }, [selectedUser, selectedRole, loadProjectData]);

  // Efectos para limpiar mensajes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (projectState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-slate-700 font-medium">Cargando proyecto...</span>
          </div>
        </div>
      </div>
    );
  }

  if (projectState.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center gap-4">
            <span className="text-red-600 font-medium">{projectState.error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!projectState.data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-bl from-purple-200/15 to-pink-200/15 rounded-full blur-3xl"></div>
      </div>

      <NotificationMessages error={error} successMessage={successMessage} />

      <div className={`relative z-10 p-6 w-full transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-6 w-full">
          <ProjectHeader />
          <ProjectInfo
            project={projectState.data}
            isEditing={isEditing}
            newName={newName}
            newDescription={newDescription}
            onNameChange={setNewName}
            onDescriptionChange={setNewDescription}
            onEdit={() => setIsEditing(true)}
            onCancel={handleCancelEdit}
            onSave={handleEdit}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 w-full">
          {/* Members Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden w-full">
            <div className="p-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Users size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Miembros del Proyecto</h3>
                    <p className="text-slate-600 text-sm">{members.length} miembros activos</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAddMemberModalOpen(true);
                    loadAvailableUsers();
                  }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200"
                >
                  <Plus size={20} className="text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[calc(100vh-400px)] overflow-y-auto">
              <div className="space-y-4">
                {members.map((member) => (
                  <MemoizedMemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden w-full">
            <div className="p-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CheckSquare size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Tareas</h3>
                    <p className="text-slate-600 text-sm">{tasks.length} tareas en total</p>
                  </div>
                </div>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200">
                  <Plus size={20} className="text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[calc(100vh-400px)] overflow-y-auto">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <MemoizedTaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          onAdd={handleAddMember}
          availableUsers={availableUsers}
          selectedUser={selectedUser}
          selectedRole={selectedRole}
          onUserChange={setSelectedUser}
          onRoleChange={setSelectedRole}
          isLoading={isLoadingUsers}
        />

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 Task Manager. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = `
@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-1rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.3s ease-out;
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);