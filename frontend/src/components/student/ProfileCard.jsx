const STAGE_COLORS = [
  'from-slate-400 to-slate-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-yellow-600',
  'from-orange-400 to-orange-600',
  'from-red-400 to-red-600',
  'from-pink-400 to-pink-600',
  'from-blue-400 to-blue-600',
  'from-cyan-400 to-cyan-600',
  'from-purple-400 to-purple-600',
  'from-violet-400 to-pink-600',
];

export default function ProfileCard({ student, user }) {
  const stage = student.current_stage ?? 1;
  const stageColor = STAGE_COLORS[(stage - 1) % 10];
  const isUnlocked = student.play_unlocked_today === 1;

  return (
    <div className="eco-card p-4 animate-slide-up">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stageColor} flex items-center justify-center text-2xl font-black text-white shadow-md flex-shrink-0`}>
          {user?.name?.[0] || '?'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-black text-[#1B4332] text-lg leading-tight">{user?.name}</h2>
            {user?.nickname && (
              <span className="text-sm text-[#52796F]">({user.nickname})</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <span className="text-xs text-[#52796F]">🏫 ห้อง {user?.classroom}</span>
            <span className="text-xs text-[#52796F]">⚔️ ด่าน {stage}</span>
            <span className="text-xs text-[#52796F]">👾 ฆ่าแล้ว {student.monsters_killed_count ?? 0} ตัว</span>
          </div>
          {/* Teacher name */}
          {student.teacher_name && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs text-[#4CAF50] font-medium">
                👩‍🏫 ครูประจำชั้น: {student.teacher_name}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-3 flex-shrink-0">
          <div className="text-center">
            <p className="text-2xl font-black text-[#FF6B35]">{student.current_points_balance ?? 0}</p>
            <p className="text-xs text-[#52796F]">แต้มคงเหลือ</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-[#4CAF50]">{student.total_points_earned ?? 0}</p>
            <p className="text-xs text-[#52796F]">แต้มรวม</p>
          </div>
          <div className="text-center">
            <div className={`px-3 py-1 rounded-xl text-xs font-bold ${
              isUnlocked
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-orange-100 text-orange-600 border border-orange-200'
            }`}>
              {isUnlocked ? '🔓 เล่นได้' : '🔒 ล็อก'}
            </div>
            <p className="text-xs text-[#52796F] mt-1">วันนี้</p>
          </div>
        </div>
      </div>
    </div>
  );
}
