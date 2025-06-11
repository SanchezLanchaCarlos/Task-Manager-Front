import { memo } from "react";
import { Mail } from "lucide-react";
import { User as UserType } from "../../api/users";

interface MemberCardProps {
  member: UserType;
}

const MemberCard = memo(({ member }: MemberCardProps) => (
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
    </div>
  </div>
));

MemberCard.displayName = 'MemberCard';

export default MemberCard;
