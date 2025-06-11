import { memo, useState } from "react";
import { Mail, Trash2, X, Check } from "lucide-react";
import { User as UserType } from "../../api/users";
import { deleteProjectMember } from "../../api/members";

interface MemberCardProps {
  member: UserType & { projectMemberId: string };
  onMemberDeleted: () => void;
}

const MemberCard = memo(({ member, onMemberDeleted }: MemberCardProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProjectMember(member.projectMemberId);
      onMemberDeleted();
    } catch (error) {
      alert('Error al eliminar el miembro del proyecto');
    } finally {
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  return (
    <div className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/60 transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md">
          <img
              className="h-10 w-10 rounded-full"
              src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.username)}&background=random`}
              alt={member.username}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-800">{member.username}</h4>
            <span className={`px-2 py-1 text-xs rounded-full border ${
              member.role === 'OWNER' 
                ? 'bg-red-100 text-red-800 border-red-200' 
                : member.role === 'MANAGER'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}>
              {member.role}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
            <Mail size={14} />
            {member.email}
          </div>
        </div>
        {member.role !== 'OWNER' && !isConfirming && (
          <button
            onClick={() => setIsConfirming(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
            title="Eliminar miembro"
          >
            <Trash2 size={18} />
          </button>
        )}
        {isConfirming && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">¿Eliminar?</span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-emerald-100 border border-emerald-200 text-emerald-600 hover:bg-emerald-200 rounded-xl transition-colors duration-200"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
              ) : (
                <Check size={18} />
              )}
            </button>
            <button
              onClick={() => setIsConfirming(false)}
              className="p-2 bg-red-100 border border-red-200 text-red-600 hover:bg-red-200 rounded-xl transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

MemberCard.displayName = 'MemberCard';

export default MemberCard;
