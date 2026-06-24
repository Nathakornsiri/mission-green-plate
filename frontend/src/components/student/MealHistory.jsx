import { useState, useEffect } from 'react';
import { mealsAPI } from '../../api';

export default function MealHistory({ studentId }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    mealsAPI.getStudent(studentId, 30)
      .then((res) => setRecords(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' });

  const finished = records.filter((r) => r.is_finished).length;
  const total = records.length;
  const streak = (() => {
    let count = 0;
    for (const r of records) {
      if (r.is_finished) count++;
      else break;
    }
    return count;
  })();

  return (
    <div className="eco-card overflow-hidden animate-slide-up">
      <div className="px-5 py-4 border-b border-[#C8E6C9] bg-[#E8F5E9]">
        <h2 className="font-bold text-[#1B4332] mb-3">📜 ประวัติการกินอาหาร</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'กินหมดทั้งหมด', value: finished, color: 'text-[#2E7D32]', bg: 'bg-green-50' },
            { label: `จาก ${total} วัน`, value: total > 0 ? `${Math.round(finished / total * 100)}%` : '0%', color: 'text-[#4CAF50]', bg: 'bg-white' },
            { label: '🔥 วันติดต่อกัน', value: streak, color: 'text-[#FF6B35]', bg: 'bg-orange-50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`text-center ${bg} rounded-xl py-2 border border-[#C8E6C9]`}>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-[#52796F]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto max-h-72">
        {loading ? (
          <div className="py-6 text-center"><div className="text-2xl animate-float">🍽️</div></div>
        ) : records.length === 0 ? (
          <div className="py-8 text-center text-[#52796F] text-sm">ยังไม่มีประวัติการกินอาหาร</div>
        ) : (
          <div className="divide-y divide-[#E8F5E9]">
            {records.map((r) => (
              <div
                key={r.id}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                  r.is_finished ? 'hover:bg-green-50' : 'hover:bg-orange-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${r.is_finished ? 'bg-[#4CAF50]' : 'bg-[#FF6B35]'}`} />
                <span className="text-xs text-[#52796F] w-24 flex-shrink-0 font-mono">{formatDate(r.date)}</span>
                <span className="flex-1 text-[#1B4332] truncate">{r.menu_name}</span>
                <span className={r.is_finished ? 'badge-finished' : 'badge-not-finished'}>
                  {r.is_finished ? '✅' : '❌'}
                </span>
                <span className={`text-xs font-bold w-12 text-right ${r.points_changed > 0 ? 'text-[#2E7D32]' : 'text-[#FF6B35]'}`}>
                  {r.points_changed > 0 ? '+' : ''}{r.points_changed}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
