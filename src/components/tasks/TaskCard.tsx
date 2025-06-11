import { memo, useCallback } from "react";
import { CheckSquare, Clock, AlertCircle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  status: string;
  priority: string;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard = memo(({ task }: TaskCardProps) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  return (
    <div className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/60 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800 mb-2">{task.title}</h4>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          {task.status === 'COMPLETED' ? (
            <CheckSquare size={18} className="text-green-500" />
          ) : task.status === 'IN_PROGRESS' ? (
            <Clock size={18} className="text-blue-500" />
          ) : (
            <AlertCircle size={18} className="text-yellow-500" />
          )}
        </div>
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
