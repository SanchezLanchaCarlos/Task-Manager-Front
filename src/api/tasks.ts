import api from "./axios";

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'NUEVA' | 'EN_CURSO' | 'FINALIZADA';
    priority: 'BAJA' | 'NORMAL' | 'ALTA';
    dueDate?: string;
    createdAt?: string;
    assigneeId?: string;
    projectId?: string;
}

export async function getAllTasks(): Promise<Task[]> {
    try {
        const response = await api.get('/tasks');
        return response.data;
    } catch (error) {
        console.error('Error en getAllTasks:', error);
        throw new Error('Error al obtener las tareas');
    }
}
  
export async function getTasksByProject(projectId: string): Promise<Task[]> {
    try {
        const response = await api.get(`/tasks/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error en getTasksByProject:', error);
        throw new Error('Error al obtener las tareas');
    }
}

export async function getTasksByUser(userId: string): Promise<Task[]> {
    try {
        const response = await api.get(`/tasks/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error en getTasksByUser:', error);
        throw new Error('Error al obtener las tareas');
    }
}

export async function getTaskById(id: string): Promise<Task> {
    try {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en getTaskById:', error);
        throw new Error('Error al obtener la tarea');
    }
}
  
export async function createTask(task: Partial<Task>): Promise<Task> {
    try {
        const response = await api.post('/tasks', task);
        return response.data;
    } catch (error: any) {
        console.error('Error en createTask:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Error al crear la tarea');
    }
}

export const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
    try {
        const response = await api.put(`/tasks/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        throw error;
    }
};
  
export async function deleteTask(id: string): Promise<void> {
    try {
        await api.delete(`/tasks/${id}`);
    } catch (error) {
        console.error('Error en deleteTask:', error);
        throw new Error('Error al eliminar la tarea');
    }
}

export async function getTaskByProjectId(projectId: string): Promise<Task[]> {
    try {
        const response = await api.get(`/tasks/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error('Error en getTaskByProjectId:', error);
        throw new Error('Error al obtener las tareas');
    }
}
  