import { useState, useEffect } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { Task } from '../../api/tasks';
import { User } from '../../api/users';
import { Project } from '../../api/projects';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, title: string, description: string, status: Task['status'], priority: Task['priority'], dueDate: string, assignedTo: string, projectId: string) => Promise<void>;
  loading: boolean;
  availableUsers: User[];
  availableProjects: Project[];
  task: Task | null;
}

export default function EditTaskModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading,
  availableUsers,
  availableProjects,
  task
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Task['status']>("NUEVA");
  const [priority, setPriority] = useState<Task['priority']>("NORMAL");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
      setAssignedTo(task.assigneeId ? String(task.assigneeId) : "");
      setProjectId(task.projectId ? String(task.projectId) : "");
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!task || !title.trim() || !assignedTo || !projectId) return;
    await onSubmit(task.id, title, description, status, priority, dueDate, assignedTo, projectId);
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            Editar Tarea
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="taskTitle" className="block text-sm font-medium text-slate-700 mb-2">
              Título de la Tarea
            </label>
            <input
              id="taskTitle"
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 placeholder-slate-500"
              placeholder="Escribe el título de la tarea..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              id="taskDescription"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 placeholder-slate-500 resize-none h-32"
              placeholder="Describe los detalles de la tarea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="taskProject" className="block text-sm font-medium text-slate-700 mb-2">
                Proyecto
              </label>
              <div className="relative">
                <select
                  id="taskProject"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 appearance-none"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Seleccionar proyecto...</option>
                  {availableProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label htmlFor="taskAssignedTo" className="block text-sm font-medium text-slate-700 mb-2">
                Asignar a
              </label>
              <div className="relative">
                <select
                  id="taskAssignedTo"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 appearance-none"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Seleccionar usuario...</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={String(user.id)}>
                      {user.username}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="taskStatus" className="block text-sm font-medium text-slate-700 mb-2">
                Estado
              </label>
              <select
                id="taskStatus"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                disabled={loading}
              >
                <option value="NUEVA">Nueva</option>
                <option value="EN_CURSO">En curso</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>

            <div>
              <label htmlFor="taskPriority" className="block text-sm font-medium text-slate-700 mb-2">
                Prioridad
              </label>
              <select
                id="taskPriority"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                disabled={loading}
              >
                <option value="BAJA">Baja</option>
                <option value="NORMAL">Normal</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <div>
              <label htmlFor="taskDueDate" className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Vencimiento
              </label>
              <div className="relative">
                <input
                  id="taskDueDate"
                  type="date"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-slate-800 [&::-webkit-calendar-picker-indicator]:bg-purple-500 [&::-webkit-calendar-picker-indicator]:p-2 [&::-webkit-calendar-picker-indicator]:rounded-lg [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-purple-600"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
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
              onClick={handleSubmit}
              disabled={loading || !title.trim() || !assignedTo || !projectId}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 