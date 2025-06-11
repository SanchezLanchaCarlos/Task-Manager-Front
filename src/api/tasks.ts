import api from "./axios";

export type Task = {
    id: number;
    title: string;
    description?: string;
    status: 'NUEVA' | 'EN_CURSO' | 'FINALIZADA';
    priority: 'BAJA' | 'NORMAL' | 'ALTA';
    dueDate?: string;
    userId: string;
    projectId: string;
    createdAt?: string;
};

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
        const response = await api.post('/tasks/', JSON.stringify(task));
        return response.data;
    } catch (error) {
        console.error('Error en createTask:', error);
        throw new Error('Error al crear la tarea');
    }
}

export async function updateTask(id: string, task: Partial<Task>): Promise<Task> {
    try {
        const response = await api.put(`/tasks/${id}`, JSON.stringify(task));
        return response.data;
    } catch (error) {
        console.error('Error en updateTask:', error);
        throw new Error('Error al actualizar la tarea');
    }
}
  
export async function deleteTask(id: number): Promise<void> {
    try {
        await api.delete(`/tasks/${id}`);
    } catch (error) {
        console.error('Error en deleteTask:', error);
        throw new Error('Error al eliminar la tarea');
    }
}
  