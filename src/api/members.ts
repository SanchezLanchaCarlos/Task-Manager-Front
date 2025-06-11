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

export async function addProjectMember(projectId: string, userId: string, role: string): Promise<ProjectMember> {
  const response = await api.post('/project-members', {
    projectId,
    userId,
    role
  });
  return response.data;
};

export async function deleteProjectMember(projectMemberId: String): Promise<void> { 
  await api.delete(`/project-members/${projectMemberId}`);
};