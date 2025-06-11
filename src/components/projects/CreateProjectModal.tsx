import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string) => Promise<void>;
  loading: boolean;
}

export default function CreateProjectModal({ isOpen, onClose, onSubmit, loading }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onSubmit(name, description);
    setName("");
    setDescription("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            Crear Nuevo Proyecto
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-2">
              Nombre del Proyecto
            </label>
            <input
              id="projectName"
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-800 placeholder-slate-500"
              placeholder="Escribe el nombre del proyecto..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium text-slate-700 mb-2">
              Descripción
            </label>
            <textarea
              id="projectDescription"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-slate-800 placeholder-slate-500 resize-none h-32"
              placeholder="Describe el propósito y objetivos del proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
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
              disabled={loading || !name.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Crear Proyecto
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 