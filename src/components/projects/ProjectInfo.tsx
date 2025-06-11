import { Edit3, Save, X, Calendar } from 'lucide-react';
import { Project } from '../../api/projects';

interface ProjectInfoProps {
  project: Project;
  isEditing: boolean;
  newName: string;
  newDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ProjectInfo({
  project,
  isEditing,
  newName,
  newDescription,
  onNameChange,
  onDescriptionChange,
  onEdit,
  onCancel,
  onSave
}: ProjectInfoProps) {
  return (
    <div className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 w-full">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre del proyecto
            </label>
            <input
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              value={newName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Nombre del proyecto"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl text-slate-700 outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none"
              rows={3}
              value={newDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Descripción del proyecto"
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={onSave}
            >
              <Save size={18} />
              Guardar
            </button>
            <button
              className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-all duration-300 flex items-center justify-center"
              onClick={onCancel}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{project.name}</h2>
            <p className="text-slate-600">{project.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                Creado el {project.createdAt ? new Date(project.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'No disponible'}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Activo
              </div>
            </div>
          </div>
          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ml-4"
            onClick={onEdit}
          >
            <Edit3 size={18} />
            Editar
          </button>
        </div>
      )}
    </div>
  );
} 