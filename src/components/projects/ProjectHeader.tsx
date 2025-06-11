import { Folder } from 'lucide-react';

export default function ProjectHeader() {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
        <Folder size={28} className="text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Detalles del Proyecto
        </h1>
        <p className="text-slate-600 mt-2">Gestiona tu proyecto y su información</p>
      </div>
    </div>
  );
} 