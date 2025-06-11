const API_URL = 'http://localhost:8080/api/auth'; // Ajusta si es necesario

type LoginResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar: string;
    createdAt: string;
  };
};

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Error en el login');

  return res.json(); // Este resultado debe tener la forma de LoginResponse
}

export async function register(email: string, password: string, username: string, role: string){
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username, role }),
  });

  if (!response.ok) throw new Error('Error al registrar');
  return response.json(); // podría devolver un mensaje o el token
}
