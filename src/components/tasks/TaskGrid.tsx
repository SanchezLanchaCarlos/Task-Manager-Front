import { Link } from 'react-router-dom';
import { 
  ClipboardList, 
  Trash2, 
  Loader2,
  Calendar,
  Users,
  Pencil,
  Eye,
  CheckSquare
} from 'lucide-react';
import { Task } from '../../api/tasks';
import { User } from '../../api/users';
import { Project } from '../../api/projects';
import { useState } from 'react';
import EditTaskModal from './EditTaskModal';

interface TaskGridProps {
  tasks: Task[];
  loading: boolean;
  searchTerm: string;
  isVisible: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (taskId: string, title: string, description: string, status: Task['status'], priority: Task['priority'], dueDate: string, assignedTo: string, projectId: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  availableUsers: User[];
  availableProjects: Project[];
}

export default function TaskGrid({ 
  tasks, 
  loading, 
  searchTerm,
  isVisible,
  onDelete,
  onEdit,
  onComplete,
  availableUsers,
  availableProjects
}: TaskGridProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (taskId: string, title: string, description: string, status: Task['status'], priority: Task['priority'], dueDate: string, assignedTo: string, projectId: string) => {
    await onEdit(taskId, title, description, status, priority, dueDate, assignedTo, projectId);
    setIsEditModalOpen(false);
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 w-[calc(100%-16rem)] ml-72">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Cargando tareas...</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-[calc(100%-16rem)] ml-72">
        <div className="text-center">
          <ClipboardList className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            {searchTerm ? 'No se encontraron tareas' : 'No hay tareas aún'}
          </h3>
          <p className="text-slate-500">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Crea tu primera tarea para comenzar'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {filteredTasks.map((task, index) => (
          <div
            key={task.id}
            className={`group bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl hover:shadow-2xl border-2 border-slate-200/50 transition-all duration-150 hover:-translate-y-2 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: `${index * 50 + 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={() => onDelete(task.id)}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-150 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors duration-150">
              {task.title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Vence el {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'No disponible'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{task.assigneeId ? 'Asignada' : 'Sin asignar'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm mb-6">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === 'FINALIZADA' 
                  ? 'bg-emerald-100 text-emerald-700'
                  : task.status === 'EN_CURSO'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {task.status === 'FINALIZADA' 
                  ? 'Completada'
                  : task.status === 'EN_CURSO'
                  ? 'En curso'
                  : 'Nueva'}
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.priority === 'ALTA'
                  ? 'bg-red-100 text-red-700'
                  : task.priority === 'NORMAL'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {task.priority === 'ALTA'
                  ? 'Alta prioridad'
                  : task.priority === 'NORMAL'
                  ? 'Prioridad normal'
                  : 'Baja prioridad'}
              </div>
            </div>

            <button 
              onClick={() => handleEditClick(task)}
              className="flex items-center justify-center gap-2 mb-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:text-white hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-2xl font-medium transition-all duration-150 hover:shadow-lg w-full"
            >
              <Pencil className="w-5 h-5" />
              Editar
            </button>

            <button
              onClick={() => onComplete(task.id)}
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:text-white hover:from-slate-600 hover:to-slate-700 text-white py-3 rounded-2xl font-medium transition-all duration-150 hover:shadow-lg"
            >
              <CheckSquare className="w-5 h-5" />
              Completar
            </button>
          </div>
        ))}
      </div>

      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          task={selectedTask}
          availableUsers={availableUsers}
          availableProjects={availableProjects}
          loading={loading}
        />
      )}
    </>
  );
} 