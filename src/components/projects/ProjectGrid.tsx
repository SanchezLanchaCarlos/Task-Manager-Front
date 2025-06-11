import { Link } from 'react-router-dom';
import { 
  FolderOpen, 
  Trash2, 
  Eye, 
  Loader2,
  Calendar,
  Users,
  Pencil
} from 'lucide-react';
import { Project } from '../../api/projects';

interface ProjectGridProps {
  projects: Project[];
  loading: boolean;
  searchTerm: string;
  isVisible: boolean;
  onDelete: (id: string) => void;
}

export function ProjectGrid({ projects, loading, searchTerm, isVisible, onDelete }: ProjectGridProps) {
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 w-[calc(100%-16rem)] ml-72">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Cargando proyectos...</p>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-[calc(100%-16rem)] ml-72">
        <div className="text-center">
          <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            {searchTerm ? 'No se encontraron proyectos' : 'No hay proyectos aún'}
          </h3>
          <p className="text-slate-500">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Crea tu primer proyecto para comenzar'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project, index) => (
        <div
          key={project.id}
          className={`group bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-150 hover:-translate-y-2 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          style={{ transitionDelay: `${index * 50 + 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <button
              onClick={() => onDelete(project.id)}
              disabled={loading}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-150 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors duration-150">
            {project.name}
          </h3>

          <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Creado el {project.createdAt ? new Date(project.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : 'No disponible'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>1 miembro</span>
            </div>
          </div>

          <Link 
            to={`/projects/${project.id}`}
            className="flex items-center justify-center gap-2 mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 hover:text-white text-white py-3 rounded-2xl font-medium transition-all duration-150 hover:shadow-lg"
          >
            <Pencil className="w-5 h-5" />
            Detalles
          </Link>

          <Link
            to={`/projects/${project.id}/tasks`}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:text-white hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-2xl font-medium transition-all duration-150 hover:shadow-lg"
          >
            <Eye className="w-5 h-5" />
            Ver Tareas
          </Link>
        </div>
      ))}
    </div>
  );
} 