import api from "./axios";

export type Project = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAllProjects(): Promise<Project[]> {
  const response = await api.get<Project[]>("/projects");
  return response.data;
}

export async function getProjectById(id: string): Promise<Project> {
  const response = await api.get<Project>(`/projects/${id}`);
  return response.data;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const response = await api.put<Project>(`/projects/${id}`, JSON.stringify(data));
  return response.data;
}

export async function createProject(data: Omit<Project, "id" | "updatedAt" | "createdAt">) {
  const response = await api.post<Project>("/projects", JSON.stringify(data));
  return response.data;
}

export async function deleteProject(id: string) {
  await api.delete(`/projects/${id}`);
}
