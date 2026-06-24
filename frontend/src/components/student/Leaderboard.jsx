import { useState, useEffect } from 'react';
import { gameAPI } from '../../api';

const RANK_ICONS  = ['🥇', '🥈', '🥉'];
const RANK_COLORS = ['text-[#FFD600]', 'text-slate-400', 'text-amber-600'];

export default function Leaderboard({ user }) {
  const [type, setType] = useState('individual');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    gameAPI.getLeaderboard(type)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type]);

  const tabs = [
    { id: 'individual', label: '👤 รายบุคคล' },
    { id: 'classroom',  label: '🏫 รายห้อง' },
    { id: 'grade',      label: '🏛️ รายชั้น' },
  ];

  return (
    <div className="eco-card overflow-hidden animate-slide-up">
      <div className="px-5 py-4 border-b border-[#C8E6C9] flex items-center justify-between flex-wrap gap-3 bg-[#E8F5E9]">
        <h2 className="font-bold text-[#1B4332]">🏆 ตารางอันดับ</h2>
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-[#C8E6C9]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                type === tab.id
                  ? 'bg-[#FFD600] text-[#1B4332] shadow-sm'
                  : 'text-[#52796F] hover:text-[#1B4332]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[500px]">
        {loading ? (
          <div className="py-10 text-center">
            <div className="text-3xl animate-float">🏆</div>
          </div>
        ) : data.length === 0 ? (
          <div className="py-10 text-center text-[#52796F] text-sm">ยังไม่มีข้อมูล</div>
        ) : (
          <div className="divide-y divide-[#E8F5E9]">
            {data.map((row, idx) => {
              const isMe = type === 'individual' && row.id === user?.id;
              const rankIcon  = idx < 3 ? RANK_ICONS[idx]  : `#${idx + 1}`;
              const rankColor = idx < 3 ? RANK_COLORS[idx] : 'text-[#52796F]';

              return (
                <div
                  key={row.id ?? row.classroom ?? row.grade}
                  className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                    isMe
                      ? 'bg-[#E8F5E9] border-l-4 border-l-[#4CAF50]'
                      : 'hover:bg-[#F1F8E9]'
                  }`}
                >
                  <span className={`text-xl w-8 text-center font-black flex-shrink-0 ${rankColor}`}>
                    {rankIcon}
                  </span>

                  {type === 'individual' && (
                    <>
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                        {row.name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${isMe ? 'text-[#2E7D32]' : 'text-[#1B4332]'}`}>
                          {row.name}{isMe && <span className="ml-1 text-xs text-[#4CAF50]">(คุณ)</span>}
                        </p>
                        <p className="text-xs text-[#52796F]">ห้อง {row.classroom} · 👾 {row.monsters_killed_count} ตัว</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-[#FF6B35]">{row.total_points_earned}</p>
                        <p className="text-xs text-[#52796F]">แต้มรวม</p>
                      </div>
                    </>
                  )}

                  {type === 'classroom' && (
                    <>
                      <div className="flex-1">
                        <p className="font-bold text-[#1B4332]">ห้อง {row.classroom}</p>
                        <p className="text-xs text-[#52796F]">ชั้น ป.{row.grade} · {row.student_count} คน · 👾 {row.total_monsters} ตัว</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-[#FF6B35]">{row.total_points}</p>
                        <p className="text-xs text-[#52796F]">แต้มรวม</p>
                      </div>
                    </>
                  )}

                  {type === 'grade' && (
                    <>
                      <div className="flex-1">
                        <p className="font-bold text-[#1B4332]">ชั้น ป.{row.grade}</p>
                        <p className="text-xs text-[#52796F]">{row.student_count} คน · 👾 {row.total_monsters} ตัว</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-[#FF6B35]">{row.total_points}</p>
                        <p className="text-xs text-[#52796F]">แต้มรวม</p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
