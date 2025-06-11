import { useState } from 'react';
import { Task } from '../../api/tasks';
import { CheckCircle2, Pencil, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EditTaskModal from './EditTaskModal';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => Promise<void>;
  onEdit: (taskId: string, title: string, description: string, status: Task['status'], priority: Task['priority'], dueDate: string, assignedTo: string, projectId: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  availableUsers: any[];
  availableProjects: any[];
}

export default function TaskCard({ 
  task, 
  onDelete, 
  onEdit,
  onComplete,
  availableUsers,
  availableProjects 
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      setIsDeleting(true);
      try {
        await onDelete(String(task.id));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onComplete(String(task.id));
    } finally {
      setIsCompleting(false);
    }
  };

  const handleEdit = async (taskId: string, title: string, description: string, status: Task['status'], priority: Task['priority'], dueDate: string, assignedTo: string, projectId: string) => {
    await onEdit(taskId, title, description, status, priority, dueDate, assignedTo, projectId);
    setIsEditModalOpen(false);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'ALTA':
        return 'bg-red-100 text-red-700';
      case 'NORMAL':
        return 'bg-yellow-100 text-yellow-700';
      case 'BAJA':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'FINALIZADA':
        return 'bg-green-100 text-green-700';
      case 'EN_CURSO':
        return 'bg-blue-100 text-blue-700';
      case 'NUEVA':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-slate-800">{task.title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleComplete}
              disabled={isCompleting || task.status === 'FINALIZADA'}
              className={`p-2 rounded-lg transition-all duration-300 ${
                task.status === 'FINALIZADA' 
                  ? 'bg-green-100 text-green-600 cursor-default' 
                  : 'hover:bg-green-50 text-slate-400 hover:text-green-600'
              }`}
              title={task.status === 'FINALIZADA' ? 'Tarea completada' : 'Marcar como completada'}
            >
              {isCompleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all duration-300"
              title="Eliminar tarea"
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <p className="text-slate-600 mb-4 line-clamp-2">{task.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            {task.dueDate ? format(new Date(task.dueDate), "d 'de' MMMM, yyyy", { locale: es }) : 'Sin fecha de vencimiento'}
          </span>
        </div>
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        loading={false}
        availableUsers={availableUsers}
        availableProjects={availableProjects}
        task={task}
      />
    </>
  );
}
