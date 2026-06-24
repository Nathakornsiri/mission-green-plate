import { useState, useEffect } from 'react';
import { mealsAPI, studentsAPI } from '../../api';

export default function ClassroomRoster({ classroom, search, refreshKey, selectedId, onSelect }) {
  const [students, setStudents] = useState([]);
  const [mealMap, setMealMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classroom) return;
    setLoading(true);
    Promise.all([
      studentsAPI.getAll({ classroom }),
      mealsAPI.getToday(classroom),
    ])
      .then(([studRes, mealRes]) => {
        setStudents(studRes.data);
        const map = {};
        for (const r of mealRes.data) map[r.id] = r;
        setMealMap(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [classroom, refreshKey]);

  const filtered = students.filter((s) =>
    !search ||
    s.name.includes(search) ||
    s.username.includes(search) ||
    s.nickname?.includes(search)
  );

  const getStatus = (student) => {
    const meal = mealMap[student.id];
    if (!meal || !meal.menu_name) return 'pending';
    return meal.is_finished ? 'finished' : 'not_finished';
  };

  const statusConfig = {
    finished:     { label: 'กินหมด ✅',    badge: 'badge-finished',     row: 'bg-green-50' },
    not_finished: { label: 'กินไม่หมด ❌', badge: 'badge-not-finished', row: 'bg-orange-50' },
    pending:      { label: 'ยังไม่สแกน',   badge: 'badge-pending',      row: '' },
  };

  const counts = { finished: 0, not_finished: 0, pending: 0 };
  for (const s of filtered) counts[getStatus(s)]++;

  if (loading) {
    return (
      <div className="eco-card p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-float">📋</div>
          <p className="text-[#52796F] mt-2 text-sm">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="eco-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#C8E6C9] flex items-center justify-between bg-[#E8F5E9]">
        <h2 className="font-bold text-[#1B4332]">📋 รายชื่อห้อง {classroom}</h2>
        <div className="flex gap-2 text-xs">
          <span className="badge-finished">✅ {counts.finished}</span>
          <span className="badge-not-finished">❌ {counts.not_finished}</span>
          <span className="badge-pending">⏳ {counts.pending}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-[#52796F] border-b border-[#C8E6C9] bg-white">
              <th className="text-left px-4 py-3 font-semibold">เลข</th>
              <th className="text-left px-4 py-3 font-semibold">ชื่อ - นามสกุล</th>
              <th className="text-left px-4 py-3 font-semibold">เมนูวันนี้</th>
              <th className="text-center px-4 py-3 font-semibold">สถานะ</th>
              <th className="text-center px-4 py-3 font-semibold">⭐ แต้ม</th>
              <th className="text-center px-4 py-3 font-semibold">👾 มอน</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#52796F]">ไม่พบข้อมูล</td>
              </tr>
            ) : (
              filtered.map((student) => {
                const status = getStatus(student);
                const cfg = statusConfig[status];
                const meal = mealMap[student.id];
                const isSelected = selectedId === student.id;

                return (
                  <tr
                    key={student.id}
                    onClick={() => onSelect(isSelected ? null : student)}
                    className={`border-b border-[#E8F5E9] cursor-pointer transition-all duration-150 ${cfg.row}
                      ${isSelected ? 'bg-[#C8E6C9] border-l-4 border-l-[#4CAF50]' : 'hover:bg-[#F1F8E9]'}`}
                  >
                    <td className="px-4 py-3 text-[#52796F] font-mono text-xs">{student.username}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#1B4332]">{student.name}</div>
                      <div className="text-xs text-[#6B9080]">ชื่อเล่น: {student.nickname || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-[#52796F] text-xs">
                      {meal?.menu_name || <span className="text-[#B2DFDB]">-</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cfg.badge}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-[#FF6B35]">
                      {student.current_points_balance ?? 0}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-[#4CAF50]">
                      {student.monsters_killed_count ?? 0}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="px-4 py-2 border-t border-[#C8E6C9] text-xs text-[#6B9080] bg-[#F9FBF9]">
          คลิกที่แถวนักเรียนเพื่อดูประวัติ
        </div>
      )}
    </div>
  );
}
