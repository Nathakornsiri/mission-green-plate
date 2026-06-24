import { useRef, useEffect } from 'react';

const MONSTERS = [
  { id: 1,  emoji: '💀', name: 'ขยะกระดูก' },
  { id: 2,  emoji: '🥦', name: 'ผีผัก' },
  { id: 3,  emoji: '🍚', name: 'ปีศาจข้าว' },
  { id: 4,  emoji: '🍜', name: 'อสูรเส้น' },
  { id: 5,  emoji: '🍖', name: 'มารเนื้อ' },
  { id: 6,  emoji: '🥚', name: 'ผีไข่' },
  { id: 7,  emoji: '🐟', name: 'ปลาซอมบี้' },
  { id: 8,  emoji: '🥕', name: 'แครอทครัชเชอร์' },
  { id: 9,  emoji: '🍲', name: 'ซุปสเปกเตอร์' },
  { id: 10, emoji: '👾', name: 'เจ้าแห่งขยะ' },
];

export default function StageMap({ currentStage, monstersKilled }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const idx = currentStage - 1;
    const child = scrollRef.current.children[idx];
    if (child) child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentStage]);

  const cycle = Math.floor(monstersKilled / 10);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-green-300">🗺️ แผนที่ด่าน</h3>
        <span className="text-xs text-green-700">รอบที่ {cycle + 1} · ฆ่าไปแล้ว {monstersKilled} ตัว</span>
      </div>

      <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-1">
        {MONSTERS.map((m) => {
          const isCurrent = m.id === currentStage;
          const isPast    = m.id < currentStage;

          return (
            <div
              key={m.id}
              className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-[#1E4A2E] border-[#4CAF50] shadow-lg shadow-green-900/40 animate-glow-green'
                  : isPast
                    ? 'bg-[#0D2B1A] border-[#1E4A2E] opacity-40'
                    : 'bg-[#0D2B1A] border-[#1E4A2E] opacity-60'
              }`}
            >
              <span className={`text-2xl ${isCurrent ? 'animate-float' : ''}`}>{m.emoji}</span>
              <span className={`text-xs font-bold ${isCurrent ? 'text-green-400' : isPast ? 'text-green-900' : 'text-green-800'}`}>
                {m.id}
              </span>
              {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
