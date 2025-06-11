import api from "./axios";

export type ProjectMember = {
  id: string;
  userId: string;
  projectId: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getProjectMembers(projectId: string): Promise<ProjectMember[]> {
  const response = await api.get(`/project-members/project/${projectId}`);
  return response.data;
};