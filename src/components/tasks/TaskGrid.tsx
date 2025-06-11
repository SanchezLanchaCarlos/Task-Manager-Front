import { 
  ClipboardList, 
  Trash2, 
  Loader2,
  Calendar,
  Clock,
  Pencil,
  CheckSquare
} from 'lucide-react';
import { Task } from '../../api/tasks';

interface TaskGridProps {
  tasks: Task[];
  loading: boolean;
  searchTerm: string;
  isVisible: boolean;
  onDelete: (id: number) => void;
}

export function TaskGrid({ tasks, loading, searchTerm, isVisible, onDelete }: TaskGridProps) {
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTasks.map((task, index) => (
        <div
          key={task.id}
          className={`group bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          style={{ transitionDelay: `${index * 100 + 500}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <button
              onClick={() => onDelete(task.id)}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
            {task.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Creada el {task.createdAt ? new Date(task.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : 'No disponible'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{task.status || 'Pendiente'}</span>
            </div>
          </div>

          <button 
            className="flex items-center justify-center gap-2 mb-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-2xl font-medium transition-all duration-300 hover:shadow-lg"
          >
            <CheckSquare className="w-5 h-5" />
            Completar
          </button>

          <button
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white py-3 rounded-2xl font-medium transition-all duration-300 hover:shadow-lg"
          >
            <Pencil className="w-5 h-5" />
            Editar
          </button>
        </div>
      ))}
    </div>
  );
} 