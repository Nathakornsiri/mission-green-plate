import { useState, useEffect } from 'react';
import MascotGreenPlate from '../mascot/MascotGreenPlate';

export default function ZeroWasteTracker({ todayStatus, studentName }) {
  const [showZeroPop, setShowZeroPop] = useState(false);

  useEffect(() => {
    if (todayStatus === 'finished') {
      const t = setTimeout(() => setShowZeroPop(true), 400);
      return () => clearTimeout(t);
    } else {
      setShowZeroPop(false);
    }
  }, [todayStatus]);

  const mascotState = todayStatus === 'finished' ? 'happy' : todayStatus === 'not_finished' ? 'pouty' : 'neutral';
  const trashFill   = todayStatus === 'finished' ? 0 : todayStatus === 'not_finished' ? 90 : 20;

  return (
    <div className="eco-card p-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-[#1B4332] text-sm">🗑️ มาตรวัดขยะอาหาร</h3>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          todayStatus === 'finished'
            ? 'bg-green-100 text-green-700'
            : todayStatus === 'not_finished'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-500'
        }`}>
          {todayStatus === 'finished' ? '✅ กินหมด' : todayStatus === 'not_finished' ? '❌ กินเหลือ' : '⏳ รอสแกน'}
        </span>
      </div>

      {/* Body: always side-by-side */}
      <div className="flex items-center gap-3">
        {/* Mascot — compact on mobile */}
        <div className="relative flex-shrink-0">
          <MascotGreenPlate
            state={mascotState}
            size={72}
            className={
              todayStatus === 'finished' ? 'animate-bounce-happy' :
              todayStatus === 'not_finished' ? 'animate-wiggle' : 'animate-float'
            }
          />
          {showZeroPop && (
            <div className="absolute -top-3 -right-3 animate-zero-pop bg-[#4CAF50] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
              0%! 🎉
            </div>
          )}
        </div>

        {/* Tracker graphics */}
        <div className="flex items-end gap-3 flex-shrink-0">
          <div className="flex flex-col items-center gap-0.5">
            <TrashCan fillPercent={trashFill} />
            <span className="text-[9px] text-[#52796F]">ขยะวันนี้</span>
          </div>
          <span className="text-lg text-[#4CAF50] pb-4">{todayStatus === 'finished' ? '→' : '↔'}</span>
          <div className="flex flex-col items-center gap-0.5">
            {todayStatus === 'finished' ? (
              <div className="animate-tree-grow"><TreeGraphic /></div>
            ) : (
              <EmptyTrashGoal />
            )}
            <span className="text-[9px] text-[#52796F]">
              {todayStatus === 'finished' ? 'ต้นไม้งอก!' : 'เป้าหมาย'}
            </span>
          </div>
        </div>

        {/* Speech text */}
        <div className="flex-1 min-w-0">
          {todayStatus === 'finished' ? (
            <>
              <p className="text-xs font-bold text-[#2E7D32] leading-snug">ยอดเยี่ยม!</p>
              <p className="text-xs text-[#52796F] leading-snug mt-0.5">วันนี้กินหมดเกลี้ยง ลดขยะได้ 100%! 🌱</p>
            </>
          ) : todayStatus === 'not_finished' ? (
            <>
              <p className="text-xs font-bold text-[#E65100] leading-snug">ยังมีอาหารเหลือนะ</p>
              <p className="text-xs text-[#52796F] leading-snug mt-0.5">มื้อหน้าลองตักพอดีอิ่มนะ 🥺</p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-[#1B4332] leading-snug">รอสแกนถาดอยู่!</p>
              <p className="text-xs text-[#52796F] leading-snug mt-0.5">เป้าหมาย: ขยะ 0% ทุกวัน</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TrashCan({ fillPercent }) {
  const fill = Math.max(0, Math.min(100, fillPercent));
  const fillColor = fill > 60 ? '#FF6B35' : fill > 20 ? '#FFD600' : '#A5D6A7';
  const fillHeight = (fill / 100) * 36;
  const fillY = 42 - fillHeight;

  return (
    <svg width="44" height="58" viewBox="0 0 44 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="5" width="32" height="6" rx="3" fill="#90A4AE" />
      <rect x="15" y="2" width="14" height="5" rx="2.5" fill="#90A4AE" />
      <rect x="8" y="11" width="28" height="42" rx="5" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1.5" />
      <clipPath id="tc2"><rect x="8" y="11" width="28" height="42" rx="5" /></clipPath>
      <rect x="8" y={fillY + 11} width="28" height={fillHeight} fill={fillColor} opacity="0.7" clipPath="url(#tc2)"
        style={{ transition: 'all 0.8s ease-out' }} />
      <line x1="16" y1="15" x2="16" y2="49" stroke="#B0BEC5" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1="22" y1="15" x2="22" y2="49" stroke="#B0BEC5" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1="28" y1="15" x2="28" y2="49" stroke="#B0BEC5" strokeWidth="1.2" strokeDasharray="3 3" />
      <text x="22" y="34" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#455A64">{fill}%</text>
    </svg>
  );
}

function TreeGraphic() {
  return (
    <svg width="44" height="58" viewBox="0 0 44 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="19" y="38" width="6" height="17" rx="3" fill="#795548" />
      <ellipse cx="22" cy="37" rx="14" ry="11" fill="#66BB6A" />
      <ellipse cx="22" cy="27" rx="11" ry="10" fill="#4CAF50" />
      <ellipse cx="22" cy="19" rx="8" ry="7" fill="#388E3C" />
      <circle cx="13" cy="31" r="2.5" fill="#A5D6A7" opacity="0.8" />
      <circle cx="31" cy="24" r="2" fill="#A5D6A7" opacity="0.8" />
    </svg>
  );
}

function EmptyTrashGoal() {
  return (
    <svg width="44" height="58" viewBox="0 0 44 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="5" width="32" height="6" rx="3" fill="#A5D6A7" />
      <rect x="15" y="2" width="14" height="5" rx="2.5" fill="#A5D6A7" />
      <rect x="8" y="11" width="28" height="42" rx="5" fill="#F1F8E9" stroke="#A5D6A7" strokeWidth="1.5" />
      <line x1="16" y1="15" x2="16" y2="49" stroke="#C8E6C9" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1="22" y1="15" x2="22" y2="49" stroke="#C8E6C9" strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1="28" y1="15" x2="28" y2="49" stroke="#C8E6C9" strokeWidth="1.2" strokeDasharray="3 3" />
      <text x="22" y="32" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4CAF50">0%</text>
      <text x="22" y="44" textAnchor="middle" fontSize="9">💚</text>
    </svg>
  );
}
