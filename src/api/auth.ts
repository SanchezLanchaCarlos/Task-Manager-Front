const API_URL = 'http://localhost:8080/api/auth';

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
  password?: string;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const errorData = await res.text();
      throw new Error('Error en el login');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function register(email: string, password: string, username: string, role: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username, role }),
  });

  if (!response.ok) throw new Error('Error al registrar');
}
