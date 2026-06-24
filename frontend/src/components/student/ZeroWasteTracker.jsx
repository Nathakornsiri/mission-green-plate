import { useState, useEffect } from 'react';
import MascotGreenPlate from '../mascot/MascotGreenPlate';

/**
 * todayStatus:
 *   'finished'     — scanned and ate all food today ✅
 *   'not_finished' — scanned but left food ❌
 *   'none'         — no scan yet today ⏳
 */
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
    <div className="eco-card p-5 flex flex-col sm:flex-row items-center gap-5">
      {/* === Mascot === */}
      <div className="relative flex flex-col items-center flex-shrink-0">
        <MascotGreenPlate
          state={mascotState}
          size={110}
          className={todayStatus === 'finished' ? 'animate-bounce-happy' : todayStatus === 'not_finished' ? 'animate-wiggle' : 'animate-float'}
        />

        {/* 0% pop badge — happy only */}
        {showZeroPop && (
          <div className="absolute -top-4 -right-4 animate-zero-pop bg-[#4CAF50] text-white text-sm font-black px-3 py-1 rounded-full shadow-lg">
            0% ขยะ! 🎉
          </div>
        )}

        {/* Speech bubble */}
        <div className="mt-3 speech-bubble text-center max-w-[140px]">
          {todayStatus === 'finished' ? (
            <p className="text-xs font-bold text-[#2E7D32]">เย้! กินหมดเกลี้ยงเลย!</p>
          ) : todayStatus === 'not_finished' ? (
            <p className="text-xs font-medium text-[#E65100]">คำต่อไป ลองตักพอดีอิ่มกันนะ 🥺</p>
          ) : (
            <p className="text-xs font-medium text-[#52796F]">รอสแกนถาดอยู่นะ!</p>
          )}
        </div>
      </div>

      {/* === Zero Waste Tracker === */}
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-black text-[#1B4332] text-sm">มาตรวัดขยะอาหาร</h3>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            todayStatus === 'finished'
              ? 'bg-green-100 text-green-700'
              : todayStatus === 'not_finished'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-500'
          }`}>
            {todayStatus === 'finished' ? '✅ กินหมด' : todayStatus === 'not_finished' ? '❌ กินเหลือ' : '⏳ ยังไม่สแกน'}
          </span>
        </div>

        <div className="flex items-end gap-6 mt-3">
          {/* Trash can graphic */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <TrashCan fillPercent={trashFill} />
            <span className="text-xs text-[#52796F] font-medium">ปริมาณขยะ</span>
          </div>

          {/* Arrow / transform */}
          <div className="flex flex-col items-center text-2xl text-[#4CAF50] flex-shrink-0">
            {todayStatus === 'finished' ? '→' : '↔'}
          </div>

          {/* Right side: tree or trash goal */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            {todayStatus === 'finished' ? (
              <div className="animate-tree-grow">
                <TreeGraphic />
              </div>
            ) : (
              <EmptyTrashGoal />
            )}
            <span className="text-xs text-[#52796F] font-medium">
              {todayStatus === 'finished' ? 'ต้นไม้เติบโต!' : 'เป้าหมาย 0%'}
            </span>
          </div>

          {/* Text description */}
          <div className="flex-1 text-sm text-[#52796F] leading-relaxed hidden sm:block">
            {todayStatus === 'finished' ? (
              <p>
                <span className="font-bold text-[#2E7D32]">ยอดเยี่ยม!</span> วันนี้{studentName || 'คุณ'}กินหมดเกลี้ยง
                ช่วยลดขยะอาหารได้ 100% ต้นไม้ของเราเติบโตขึ้นแล้ว! 🌱
              </p>
            ) : todayStatus === 'not_finished' ? (
              <p>
                ยังมีอาหารเหลืออยู่นะ ลองตักพอดีในมื้อหน้า
                เพื่อให้ขยะอาหารเป็น <span className="font-bold text-[#4CAF50]">0%</span> และต้นไม้จะงอกขึ้นมา! 🌿
              </p>
            ) : (
              <p>
                เมื่อสแกนถาดอาหารแล้ว ระบบจะบันทึกว่ากินหมดไหม
                เป้าหมายคือขยะอาหาร <span className="font-bold text-[#4CAF50]">0%</span> ทุกวัน!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* === Trash Can SVG === */
function TrashCan({ fillPercent }) {
  const fill = Math.max(0, Math.min(100, fillPercent));
  const fillColor = fill > 60 ? '#FF6B35' : fill > 20 ? '#FFD600' : '#A5D6A7';
  const fillHeight = (fill / 100) * 44;
  const fillY = 52 - fillHeight;

  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lid */}
      <rect x="8" y="6" width="40" height="8" rx="4" fill="#90A4AE" />
      <rect x="20" y="2" width="16" height="6" rx="3" fill="#90A4AE" />
      {/* Body */}
      <rect x="10" y="14" width="36" height="50" rx="6" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="2" />
      {/* Fill level */}
      <clipPath id="trashClip">
        <rect x="10" y="14" width="36" height="50" rx="6" />
      </clipPath>
      <rect
        x="10"
        y={fillY + 14}
        width="36"
        height={fillHeight}
        fill={fillColor}
        opacity="0.7"
        clipPath="url(#trashClip)"
        style={{ transition: 'all 0.8s ease-out' }}
      />
      {/* Stripes on body */}
      <line x1="20" y1="18" x2="20" y2="60" stroke="#B0BEC5" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="28" y1="18" x2="28" y2="60" stroke="#B0BEC5" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="36" y1="18" x2="36" y2="60" stroke="#B0BEC5" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* Percentage label */}
      <text x="28" y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#455A64">
        {fill}%
      </text>
    </svg>
  );
}

/* === Growing Tree SVG === */
function TreeGraphic() {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trunk */}
      <rect x="24" y="48" width="8" height="20" rx="4" fill="#795548" />
      {/* Lower canopy */}
      <ellipse cx="28" cy="46" rx="18" ry="14" fill="#66BB6A" />
      {/* Upper canopy */}
      <ellipse cx="28" cy="34" rx="14" ry="12" fill="#4CAF50" />
      {/* Top */}
      <ellipse cx="28" cy="24" rx="10" ry="9" fill="#388E3C" />
      {/* Leaf sparkles */}
      <circle cx="16" cy="38" r="3" fill="#A5D6A7" opacity="0.8" />
      <circle cx="40" cy="30" r="2.5" fill="#A5D6A7" opacity="0.8" />
      <circle cx="22" cy="20" r="2" fill="#C8E6C9" opacity="0.9" />
    </svg>
  );
}

/* === Empty Trash Goal SVG === */
function EmptyTrashGoal() {
  return (
    <svg width="56" height="72" viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lid */}
      <rect x="8" y="6" width="40" height="8" rx="4" fill="#A5D6A7" />
      <rect x="20" y="2" width="16" height="6" rx="3" fill="#A5D6A7" />
      {/* Body empty */}
      <rect x="10" y="14" width="36" height="50" rx="6" fill="#F1F8E9" stroke="#A5D6A7" strokeWidth="2" />
      {/* Stripes */}
      <line x1="20" y1="18" x2="20" y2="60" stroke="#C8E6C9" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="28" y1="18" x2="28" y2="60" stroke="#C8E6C9" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="36" y1="18" x2="36" y2="60" stroke="#C8E6C9" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* 0% label */}
      <text x="28" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#4CAF50">0%</text>
      {/* Heart */}
      <text x="28" y="55" textAnchor="middle" fontSize="10">💚</text>
    </svg>
  );
}
