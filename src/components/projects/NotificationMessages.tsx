import { AlertCircle, CheckCircle } from 'lucide-react';

interface NotificationMessagesProps {
  error: string | null;
  successMessage: string | null;
}

export default function NotificationMessages({ error, successMessage }: NotificationMessagesProps) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      {error && (
        <div className="mb-4 p-4 bg-red-50/90 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center gap-3 text-red-700 shadow-lg animate-fade-in-down">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50/90 backdrop-blur-sm border border-green-200/50 rounded-2xl flex items-center gap-3 text-green-700 shadow-lg animate-fade-in-down">
          <CheckCircle size={20} />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}
    </div>
  );
} 