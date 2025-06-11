import { useEffect, useState } from "react";
import { Task, getAllTasks, createTask, deleteTask } from "../api/tasks";
import { 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Search,
} from 'lucide-react';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { TaskGrid } from '../components/tasks/TaskGrid';
import { User } from "../api/users";
import { useParams } from "react-router-dom";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const authUser: User = JSON.parse(localStorage.getItem("authUser") ?? "{}");
  const projectId = useParams().id;

  useEffect(() => {
    setIsVisible(true);
    setLoading(true);
    getAllTasks()
      .then((tasks) => {
        setTasks(tasks);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar las tareas');
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

  const handleCreate = async (title: string, description: string, status: string, priority: string, dueDate: string) => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const newTask = await createTask({ 
        title, 
        description,
        status: status as Task['status'],
        priority: priority as Task['priority'],
        dueDate,
        userId: authUser.id,
        projectId: projectId,
      });
      setTasks((prev) => [...prev, newTask]);
      setSuccessMessage("Tarea creada con éxito");
      setIsModalOpen(false);
    } catch (error) {
      setError("Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (loading) return;
    setLoading(true);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setSuccessMessage("Tarea eliminada con éxito");
    } catch (error) {
      setError("Error al eliminar la tarea");
    } finally {
      setLoading(false);
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
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Create Task Modal */}
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          loading={loading}
        />
      </div>
    </div>
  );
}
