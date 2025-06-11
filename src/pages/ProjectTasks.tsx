import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Task, getTasksByProject, createTask, deleteTask } from '../api/tasks';

export default function ProjectTasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (projectId) {
      getTasksByProject(projectId).then(setTasks).catch(console.error);
    }
  }, [projectId]);

  const handleCreate = async () => {
    if (!title.trim() || !projectId) return;
    const newTask = await createTask({ title, projectId: Number(projectId) });
    setTasks(prev => [...prev, newTask]);
    setTitle('');
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tareas del Proyecto #{projectId}</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded w-full"
          placeholder="Nueva tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={handleCreate}
        >
          Añadir
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map(task => (
          <li key={task.id} className="flex justify-between items-center bg-white p-3 rounded shadow">
            <span>{task.title}</span>
            <button
              className="text-red-500 hover:underline"
              onClick={() => handleDelete(task.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
