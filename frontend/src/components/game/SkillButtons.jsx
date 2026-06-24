const SKILLS = [
  {
    id: 1,
    name: 'โจมตีปกติ',
    desc: 'ทำดาเมจ 500 HP',
    emoji: '⚔️',
    cost: 10,
    damage: 500,
    type: 'instant',
    color: 'from-green-700 to-green-900',
    border: 'border-green-600',
    glow: 'shadow-green-900/50',
    textColor: 'text-green-400',
    hoverBg: 'hover:from-green-600 hover:to-green-800',
  },
  {
    id: 2,
    name: 'โจมตีหนัก',
    desc: 'ทำดาเมจ 1,200 HP',
    emoji: '🔥',
    cost: 20,
    damage: 1200,
    type: 'instant',
    color: 'from-orange-700 to-red-900',
    border: 'border-orange-600',
    glow: 'shadow-orange-900/50',
    textColor: 'text-orange-400',
    hoverBg: 'hover:from-orange-600 hover:to-red-800',
  },
  {
    id: 3,
    name: 'พิษขยะ',
    desc: 'ติดพิษ! รวม 2,500 HP',
    emoji: '☠️',
    cost: 40,
    damage: 2500,
    type: 'poison',
    color: 'from-purple-700 to-purple-950',
    border: 'border-purple-600',
    glow: 'shadow-purple-900/50',
    textColor: 'text-purple-400',
    hoverBg: 'hover:from-purple-600 hover:to-purple-900',
  },
];

export default function SkillButtons({ points, onAttack, disabled, isLocked }) {
  return (
    <div className="px-5 pb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500 font-medium">สกิลโจมตี</p>
        <p className="text-xs text-slate-500">
          แต้มคงเหลือ: <span className="text-yellow-400 font-bold">{points}</span> pts
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SKILLS.map((skill) => {
          const canAfford = points >= skill.cost;
          const isDisabled = disabled || !canAfford || isLocked;

          return (
            <button
              key={skill.id}
              onClick={() => !isDisabled && onAttack(skill.id)}
              disabled={isDisabled}
              className={`
                btn-skill bg-gradient-to-b ${skill.color} ${skill.hoverBg}
                border ${skill.border} shadow-lg ${skill.glow}
                ${!canAfford && !isLocked ? 'opacity-40 cursor-not-allowed' : ''}
                ${disabled && !isLocked ? 'opacity-60' : ''}
                ${isLocked ? 'grayscale opacity-30 cursor-not-allowed' : ''}
              `}
            >
              <span className="text-2xl">{skill.emoji}</span>
              <span className={`text-xs font-black ${skill.textColor}`}>{skill.name}</span>
              <span className="text-xs text-slate-300">{skill.desc}</span>
              <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-bold border ${skill.border} ${skill.textColor} bg-black/30`}>
                💎 {skill.cost} pts
              </div>
              {!canAfford && !isLocked && (
                <span className="text-xs text-red-400 mt-0.5">แต้มไม่พอ</span>
              )}
            </button>
          );
        })}
      </div>

      {isLocked && (
        <div className="mt-3 text-center">
          <p className="text-xs text-red-400/70">🔒 กินอาหารให้หมดก่อนถึงจะเล่นได้</p>
        </div>
      )}

      {!isLocked && (
        <div className="mt-3 bg-[#0D2B1A] border border-[#1E4A2E] rounded-xl p-3 flex items-center gap-3">
          <span className="text-xl">💡</span>
          <p className="text-xs text-green-600">
            <span className="text-[#FFD600] font-bold">ปุ่มโจมตีก่อนหน้านี้: ปลดล็อกแล้ว!</span>
            {' '}ใช้สกิลโดยดึงจากแต้มสะสมทั้งหมดของคุณ ({points} pts)
          </p>
        </div>
      )}
    </div>
  );
}
