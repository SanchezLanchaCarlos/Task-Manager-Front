import { useEffect, useState } from "react";
import { Project, getAllProjects, createProject, deleteProject } from "../api/projects";
import { 
  Plus, 
  CheckCircle, 
  AlertCircle,
  Search,
} from 'lucide-react';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { ProjectGrid } from '../components/projects/ProjectGrid';
import { DeleteProjectDialog } from '../components/projects/DeleteProjectDialog';
import { User } from "../api/users";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const authUser: User = JSON.parse(localStorage.getItem("authUser") ?? "{}");

  useEffect(() => {
    setIsVisible(true);
    setLoading(true);
    getAllProjects()
      .then((projects) => {
        setProjects(projects);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar los proyectos');
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

  const handleCreate = async (name: string, description: string) => {
    if (!name.trim()) return;
    if (!authUser?.id) {
      setError("Debes iniciar sesión para crear un proyecto");
      return;
    }
    setLoading(true);
    try {
      const newProject = await createProject({
        name,
        description,
        ownerId: authUser.id,
      });
      setProjects((prev) => [...prev, newProject]);
      setSuccessMessage("Proyecto creado con éxito");
      setIsModalOpen(false);
    } catch (error) {
      setIsModalOpen(false);
      setError("Error al crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete || loading) return;
    setLoading(true);
    try {
      await deleteProject(projectToDelete);
      setProjects((prev) => prev.filter((project) => project.id !== projectToDelete));
      setSuccessMessage("Proyecto eliminado con éxito");
    } catch (error) {
      setError("Error al eliminar el proyecto");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="p-6 md:p-8">
        {/* Header Section */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 via-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                Proyectos
              </h1>
              <p className="text-slate-600">Gestiona y organiza todos tus proyectos en un solo lugar</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'}
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
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Proyecto
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="max-w-6xl">
            <ProjectGrid
              projects={projects}
              loading={loading}
              searchTerm={searchTerm}
              isVisible={isVisible}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          loading={loading}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteProjectDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setProjectToDelete(null);
          }}
          onConfirm={confirmDelete}
          loading={loading}
        />
      </div>
    </div>
  );
}