import { Trash2 } from 'lucide-react';

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function DeleteProjectDialog({ isOpen, onClose, onConfirm, loading }: DeleteProjectDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-xl">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800">Eliminar Proyecto</h3>
        </div>
        <p className="text-slate-600 mb-6">
          ¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors duration-150"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-150 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Eliminar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 