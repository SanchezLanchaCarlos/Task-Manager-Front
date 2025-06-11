import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="fixed top-4 left-40 z-[60] p-2 bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-lg border border-slate-700/50 md:hidden hover:bg-slate-700/90 transition-colors duration-200"
    >
      {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
    </button>
  );
} 