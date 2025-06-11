import api from "./axios";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getAllUsers(): Promise<User[]> {
  const response = await api.get('/users');
  return response.data;
};

export async function getUserById(userId: string): Promise<User> {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export async function updateUser(userId: string, user: Partial<User>): Promise<User> {
  const response = await api.put(`/users/${userId}`, JSON.stringify(user));
  return response.data;
};

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}`);
};