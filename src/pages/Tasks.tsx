import { useEffect, useState } from "react";
import { Task, getAllTasks, createTask, deleteTask, updateTask } from "../api/tasks";
import { 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Search,
} from 'lucide-react';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import DeleteTaskDialog from '../components/tasks/DeleteTaskDialog';
import TaskGrid from "../components/tasks/TaskGrid";
import { User, getAllUsers } from "../api/users";
import { Project, getAllProjects } from "../api/projects";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState("");
  const { user } = useAuth();
  const projectId = useParams().id;

  useEffect(() => {
    if (!user) {
      setError("No hay usuario autenticado");
      return;
    }

    setIsVisible(true);
    setLoading(true);
    Promise.all([
      getAllTasks(),
      getAllUsers(),
      getAllProjects()
    ])
      .then(([tasksData, usersData, projectsData]) => {
        setTasks(tasksData);
        setUsers(usersData);
        setProjects(projectsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos');
        setLoading(false);
      });
  }, [user]);

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

  const handleCreate = async (title: string, description: string, status: string, priority: string, dueDate: string, assignedTo: string, projectId: string) => {
    if (!title.trim() || !assignedTo || !projectId) {
      setError("Por favor, completa todos los campos");
      return;
    }

    if (!user) {
      setError("No hay usuario autenticado");
      return;
    }

    setLoading(true);
    try {
      const newTask = await createTask({
        title, 
        description,
        status: status as Task['status'],
        priority: priority as Task['priority'],
        dueDate,
        assigneeId: assignedTo,
        projectId
      });
      setTasks((prev) => [...prev, newTask]);
      setSuccessMessage("Tarea creada con éxito");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error al crear la tarea:', error);
      setError(error.response?.data?.message || "Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    setTaskToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete || loading) return;
    
    setLoading(true);
    try {
      await deleteTask(taskToDelete);
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
      setSuccessMessage("Tarea eliminada con éxito");
      setIsDeleteDialogOpen(false);
      setTaskToDelete("");
    } catch (error) {
      setError("Error al eliminar la tarea");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      const updatedTasks = await getAllTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const updatedTask = {
        ...task,
        status: 'FINALIZADA' as Task['status']
      };
      
      await updateTask(id, updatedTask);
      const updatedTasks = await getAllTasks();
      setTasks(updatedTasks);
      setSuccessMessage("Tarea completada con éxito");
    } catch (error) {
      console.error('Error al completar la tarea:', error);
      setError("Error al completar la tarea");
    }
  };

  const handleEdit = async (taskId: string, title: string, description: string, status: Task['status'], priority: Task['priority'], dueDate: string, assignedTo: string, projectId: string) => {
    try {
      await updateTask(taskId, {
        title,
        description,
        status,
        priority,
        dueDate,
        assigneeId: assignedTo,
        projectId: projectId
      });
      const updatedTasks = await getAllTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error al editar la tarea:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="p-6 md:p-8">
        {/* Header Section */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Tareas
              </h1>
              <p className="text-slate-600">Gestiona y organiza todas tus tareas en un solo lugar</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                {tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {(successMessage || error) && (
          <div className={`mb-6 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800 font-medium">{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Filter and Search */}
        <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Tarea
            </button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="max-w-6xl">
            <TaskGrid
              tasks={tasks}
              loading={loading}
              searchTerm={searchTerm}
              isVisible={isVisible}
              onDelete={handleDeleteClick}
              onEdit={handleEdit}
              onComplete={handleComplete}
              availableUsers={users}
              availableProjects={projects}
            />
          </div>
        </div>

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          loading={loading}
          availableUsers={users}
          availableProjects={projects}
        />

        {/* Delete Task Dialog */}
        <DeleteTaskDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setTaskToDelete("");
          }}
          onConfirm={handleDeleteConfirm}
          loading={loading}
        />
      </div>
    </div>
  );
}
