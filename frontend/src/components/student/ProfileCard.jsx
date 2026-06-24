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
      {/* Row 1: Avatar + Name/Info */}
      <div className="flex items-center gap-3">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stageColor} flex items-center justify-center text-2xl font-black text-white shadow-md flex-shrink-0`}>
          {user?.name?.[0] || '?'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <h2 className="font-black text-[#1B4332] text-base leading-tight">{user?.name}</h2>
            {user?.nickname && (
              <span className="text-xs text-[#52796F]">({user.nickname})</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
            <span className="text-xs text-[#52796F]">🏫 {user?.classroom}</span>
            <span className="text-[#B2DFDB] text-xs">·</span>
            <span className="text-xs text-[#52796F]">⚔️ ด่าน {stage}</span>
            <span className="text-[#B2DFDB] text-xs">·</span>
            <span className="text-xs text-[#52796F]">👾 {student.monsters_killed_count ?? 0} ตัว</span>
          </div>

          {student.teacher_name && (
            <p className="text-xs text-[#4CAF50] font-medium mt-0.5 truncate">
              👩‍🏫 {student.teacher_name}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Stats — always below, full-width on mobile */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-[#E8F5E9]">
        <div className="flex-1 text-center bg-orange-50 rounded-xl py-2">
          <p className="text-xl font-black text-[#FF6B35]">{student.current_points_balance ?? 0}</p>
          <p className="text-[10px] text-[#52796F] leading-tight">แต้มคงเหลือ</p>
        </div>
        <div className="flex-1 text-center bg-green-50 rounded-xl py-2">
          <p className="text-xl font-black text-[#4CAF50]">{student.total_points_earned ?? 0}</p>
          <p className="text-[10px] text-[#52796F] leading-tight">แต้มรวม</p>
        </div>
        <div className="flex-1 text-center rounded-xl py-2">
          <div className={`mx-auto w-fit px-2 py-0.5 rounded-lg text-xs font-bold ${
            isUnlocked
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-orange-100 text-orange-600 border border-orange-200'
          }`}>
            {isUnlocked ? '🔓 เล่นได้' : '🔒 ล็อก'}
          </div>
          <p className="text-[10px] text-[#52796F] mt-1 leading-tight">วันนี้</p>
        </div>
      </div>
    </div>
  );
}
