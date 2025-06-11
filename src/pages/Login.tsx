import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, AlertCircle } from 'lucide-react';
import { loginApi } from '../api/auth'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Animate entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor ingresa email y contraseña');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const { token, user } = await loginApi(email, password);
      if (!token || !user) {
        throw new Error('Respuesta inválida del servidor');
      }
      login(token, user);
      navigate('/');
    } catch (e: any) {
      console.error('Error en login:', e);
      if (e.message === 'Error en el login') {
        setError('Credenciales inválidas');
      } else if (e.message === 'Respuesta inválida del servidor') {
        setError('Error en la respuesta del servidor');
      } else if (e.message === 'Failed to fetch') {
        setError('No se pudo conectar con el servidor. Verifica que esté en ejecución.');
      } else {
        setError('Error al conectar con el servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleLogin();
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

      {/* Login Card */}
      <div className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="relative p-8 pb-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <LogIn size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Bienvenido
              </h2>
              <p className="text-slate-600">Inicia sesión en tu cuenta</p>
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
                  className="w-full pl-14 pr-4 py-4 bg-slate-100/70 backdrop-blur-sm border border-white/20 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
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
                  className="w-full pl-14 pr-12 py-4 bg-slate-100/70 backdrop-blur-sm border border-white/20 rounded-2xl text-slate-700 placeholder-slate-500 outline-none focus:bg-white/80 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
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

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                isLoading || !email || !password
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-slate-600">
                ¿No tienes cuenta?{' '}
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
                  Regístrate aquí
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