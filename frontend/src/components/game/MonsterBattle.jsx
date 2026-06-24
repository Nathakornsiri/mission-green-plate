import { useState, useEffect, useRef } from 'react';

const MONSTERS = [
  { id: 1, name: 'ขยะกระดูก',      emoji: '💀', color: '#9ca3af', bg: 'from-gray-700 to-gray-900',    glow: 'rgba(156,163,175,0.6)' },
  { id: 2, name: 'ผีผัก',           emoji: '🥦', color: '#4ade80', bg: 'from-green-700 to-green-950',  glow: 'rgba(74,222,128,0.6)' },
  { id: 3, name: 'ปีศาจข้าว',       emoji: '🍚', color: '#fbbf24', bg: 'from-yellow-600 to-yellow-900',glow: 'rgba(251,191,36,0.6)' },
  { id: 4, name: 'อสูรเส้น',        emoji: '🍜', color: '#fb923c', bg: 'from-orange-600 to-orange-900',glow: 'rgba(251,146,60,0.6)' },
  { id: 5, name: 'มารเนื้อ',        emoji: '🍖', color: '#f87171', bg: 'from-red-600 to-red-950',      glow: 'rgba(248,113,113,0.6)' },
  { id: 6, name: 'ผีไข่',           emoji: '🥚', color: '#fde68a', bg: 'from-yellow-500 to-amber-900', glow: 'rgba(253,230,138,0.6)' },
  { id: 7, name: 'ปลาซอมบี้',       emoji: '🐟', color: '#60a5fa', bg: 'from-blue-600 to-blue-950',   glow: 'rgba(96,165,250,0.6)' },
  { id: 8, name: 'แครอทครัชเชอร์', emoji: '🥕', color: '#f97316', bg: 'from-orange-500 to-red-900',   glow: 'rgba(249,115,22,0.6)' },
  { id: 9, name: 'ซุปสเปกเตอร์',   emoji: '🍲', color: '#c084fc', bg: 'from-purple-600 to-purple-950',glow: 'rgba(192,132,252,0.6)' },
  { id: 10, name: 'เจ้าแห่งขยะ',   emoji: '👾', color: '#e879f9', bg: 'from-fuchsia-600 to-purple-950',glow: 'rgba(232,121,249,0.6)' },
];

export default function MonsterBattle({ stage, hpCurrent, hpMax, hpPercent, isKilling, lastResult, isLocked }) {
  const monster = MONSTERS[(stage - 1) % 10];
  const [isShaking, setIsShaking] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState([]);
  const [poisonActive, setPoisonActive] = useState(false);
  const arenaRef = useRef(null);
  const dmgIdRef = useRef(0);

  useEffect(() => {
    if (!lastResult) return;

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);

    if (lastResult.skill_type === 'poison') setPoisonActive(true);

    const id = ++dmgIdRef.current;
    const left = 30 + Math.random() * 40;
    setDamageNumbers((prev) => [
      ...prev,
      { id, value: lastResult.damage_dealt, type: lastResult.skill_type, left },
    ]);
    setTimeout(() => {
      setDamageNumbers((prev) => prev.filter((d) => d.id !== id));
    }, 1100);
  }, [lastResult]);

  useEffect(() => {
    if (!poisonActive) return;
    const t = setTimeout(() => setPoisonActive(false), 4000);
    return () => clearTimeout(t);
  }, [poisonActive]);

  const hpColor = hpPercent > 60 ? '#22c55e' : hpPercent > 30 ? '#f59e0b' : '#ef4444';

  return (
    <div ref={arenaRef} className="relative px-5 py-6">
      {/* Monster */}
      <div className="flex flex-col items-center gap-4">
        {/* Monster name + stage */}
        <div className="flex items-center gap-3">
          <div className={`px-4 py-1 rounded-full text-xs font-black bg-gradient-to-r ${monster.bg} border`}
               style={{ borderColor: monster.color + '60', color: monster.color }}>
            ด่าน {stage} — {monster.name}
          </div>
        </div>

        {/* Monster emoji */}
        <div
          className={`relative select-none ${isKilling ? 'animate-kill-flash' : isShaking ? 'animate-shake' : 'animate-float'} ${poisonActive ? 'poison-overlay' : ''}`}
          style={{
            fontSize: '7rem',
            filter: isLocked ? 'grayscale(0.8) blur(1px)' : `drop-shadow(0 0 20px ${monster.glow})`,
            transition: 'filter 0.3s',
          }}
        >
          {monster.emoji}
        </div>

        {/* Damage floating numbers */}
        {damageNumbers.map((d) => (
          <div
            key={d.id}
            className="damage-number"
            style={{
              color: d.type === 'poison' ? '#c084fc' : '#ef4444',
              left: `${d.left}%`,
              top: '20%',
            }}
          >
            -{d.value.toLocaleString()}
          </div>
        ))}

        {/* HP Bar */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">❤️ HP มอนสเตอร์</span>
            <span className="font-bold" style={{ color: hpColor }}>
              {hpCurrent.toLocaleString()} / {hpMax.toLocaleString()}
            </span>
          </div>
          <div className="h-5 bg-[#0D2B1A] rounded-full overflow-hidden border border-[#1E4A2E] relative">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out relative"
              style={{
                width: `${hpPercent}%`,
                background: `linear-gradient(90deg, #ef4444, ${hpColor})`,
                boxShadow: `0 0 8px ${hpColor}80`,
              }}
            >
              {poisonActive && (
                <div className="absolute inset-0 bg-purple-500/30 animate-poison-drip rounded-full" />
              )}
            </div>
          </div>
          {poisonActive && (
            <div className="text-center mt-1.5">
              <span className="text-xs text-purple-400 animate-pulse">☠️ ติดพิษ! กำลังรับดาเมจ...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
