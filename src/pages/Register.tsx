import { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await register(email, password, username, role);
      setSuccess('Registro exitoso. Redirigiendo...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Error al registrar. Intenta con otro nombre de usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-bl from-purple-200/15 to-pink-200/15 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Register Card */}
      <div className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="relative p-8 pb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <UserPlus size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Crear Cuenta
              </h2>
              <p className="text-slate-600">Únete a nuestra plataforma</p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center gap-3 text-red-700">
                <AlertCircle size={20} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-2xl flex items-center gap-3 text-green-700">
                <CheckCircle size={20} />
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre de usuario
              </label>
              <div className="relative">
                <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-2 rounded-full shadow-lg ml-3">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="tu_usuario"
                  className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-white/20 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyPress}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 p-2 rounded-full shadow-lg ml-3">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-white/20 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-300 ml-3">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-12 py-4 bg-slate-100/70 backdrop-blur-sm border border-white/20 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Role Field */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de cuenta
              </label>
              <div className="relative">
                <div className="absolute top-1/2 transform z-10 -translate-y-1/2 text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 p-2 rounded-full shadow-lg ml-3">
                  <Shield size={20} />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-white/20 rounded-2xl text-slate-700 outline-none focus:bg-white/80 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading || !email || !password || !username}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                isLoading || !email || !password || !username
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Registrando...
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                ¿Ya tienes cuenta?{' '}
                <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-200">
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 Task Manager. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}