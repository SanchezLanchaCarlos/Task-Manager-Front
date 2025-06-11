import { useState, useEffect } from 'react';
import { CheckCircle, FolderPlus, TrendingUp, Users, ClipboardList, AlertCircle } from 'lucide-react';
import { Project, getAllProjects, createProject } from '../api/projects';
import { getAllUsers, User } from '../api/users';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { Link } from 'react-router-dom';
import { getAllTasks, Task } from '../api/tasks';


export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const authUser: User = JSON.parse(localStorage.getItem("authUser") ?? "{}");

  useEffect(() => {
    setIsVisible(true);  
    
    getAllProjects().then(data => {
      setProjects(data);
    }).catch(error => {
      console.error("Error fetching projects:", error);
    });

    getAllUsers().then(data => {
      setUsers(data);
    }).catch(error => {
      console.error("Error fetching users:", error);
    });

    getAllTasks().then(data => {
      setTasks(data);
    }).catch(error => {
      console.error("Error fetching tasks:", error);
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: FolderPlus, label: "Proyectos Activos", value: projects.length.toString() },
    { icon: CheckCircle, label: "Tareas Completadas", value: tasks.filter(task => task.status === 'FINALIZADA').length.toString() },
    { icon: TrendingUp, label: "Productividad", value: `${(tasks.filter(task => task.status === 'FINALIZADA').length / tasks.length * 100)}%` },
    { icon: Users, label: "Colaboradores", value: users.length.toString() },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Bienvenido de vuelta
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tu espacio de productividad te está esperando. Gestiona proyectos, colabora con tu equipo y alcanza tus objetivos.
            </p>
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

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-xl animate-gradient-x hover:animate-gradient-x-fast ${
                  index === 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                  index === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                  index === 2 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  'bg-gradient-to-r from-orange-500 to-red-500'
                }`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
              </div>
              <p className="text-slate-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              ¿Qué quieres hacer hoy?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <FolderPlus className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold">Crear Proyecto</h3>
                    <p className="text-blue-100">Inicia un nuevo proyecto colaborativo</p>
                  </div>
                </div>
              </button>

              <Link 
                to="/tasks"
                className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                    <ClipboardList className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold">Ver Tareas</h3>
                    <p className="text-emerald-100">Revisa tu lista de pendientes</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className={`mt-12 text-center transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
            <p className="text-lg text-slate-700 italic mb-2">
              "La productividad no se trata de hacer más cosas, sino de hacer las cosas correctas."
            </p>
            <p className="text-slate-500 font-medium">— Enfócate en lo que importa —</p>
          </div>
        </div>

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreate}
          loading={loading}
        />
      </div>
    </div>
  );
}