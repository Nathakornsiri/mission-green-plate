import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { teachersAPI } from '../api';
import ClassroomRoster from '../components/teacher/ClassroomRoster';
import StudentTimeline from '../components/teacher/StudentTimeline';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [scanNotif, setScanNotif] = useState(null);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
    teachersAPI.classroomSummary()
      .then((res) => setSummary(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const handleScan = (e) => {
      refresh();
      setScanNotif(e.detail);
      setTimeout(() => setScanNotif(null), 4000);
    };
    window.addEventListener('greenplate:scan', handleScan);
    return () => window.removeEventListener('greenplate:scan', handleScan);
  }, [refresh]);

  const today = new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="min-h-screen gp-bg">
      {/* IoT scan notification */}
      {scanNotif && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold text-sm animate-scale-in
          ${scanNotif.game_unlocked
            ? 'bg-[#4CAF50] text-white shadow-green-200'
            : 'bg-[#FF6B35] text-white shadow-orange-200'
          }`}
        >
          📡 IoT สแกน: {scanNotif.student_uid} —
          {scanNotif.game_unlocked ? ` ✅ กินหมด` : ` ❌ กินไม่หมด`}
        </div>
      )}

      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#C8E6C9] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌱</span>
            <div>
              <h1 className="font-black text-[#1B4332] text-sm leading-tight">MISSION GREEN PLATE</h1>
              <p className="text-xs text-[#52796F]">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#1B4332]">{user?.name}</p>
              <p className="text-xs text-[#4CAF50] font-medium">ครูประจำชั้น {user?.classroom}</p>
            </div>
            <button
              onClick={logout}
              className="text-xs text-[#52796F] hover:text-red-500 transition-colors px-3 py-1.5 border border-[#C8E6C9] hover:border-red-300 rounded-xl"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Teacher Profile + Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="eco-card p-5 md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] flex items-center justify-center text-2xl font-black text-white shadow-md">
                {user?.name?.[0] || '?'}
              </div>
              <div>
                <p className="font-bold text-[#1B4332]">{user?.name}</p>
                <p className="text-sm text-[#4CAF50] font-medium">ห้อง {user?.classroom}</p>
                <p className="text-xs text-[#52796F]">ชั้น ป.{user?.grade}</p>
              </div>
            </div>
          </div>

          {summary && [
            { label: 'นักเรียนทั้งหมด', value: summary.total_students,       icon: '👥', color: 'text-[#1B4332]',  bg: 'bg-[#E8F5E9]' },
            { label: 'กินหมด ✅',        value: summary.finished_count ?? 0,  icon: '🍽️', color: 'text-[#2E7D32]',  bg: 'bg-green-50' },
            { label: 'กินไม่หมด ❌',     value: summary.not_finished_count ?? 0, icon: '🗑️', color: 'text-[#FF6B35]', bg: 'bg-orange-50' },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className={`eco-card p-5 flex items-center gap-4 ${bg}`}>
              <span className="text-3xl">{icon}</span>
              <div>
                <p className={`text-3xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-[#52796F]">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Refresh */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#52796F]">🔍</span>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="ค้นหาชื่อนักเรียน หรือเลขประจำตัว..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => { refresh(); setSelectedStudent(null); }}
            className="btn-primary px-5 text-sm"
          >
            🔄 รีเฟรช
          </button>
        </div>

        {/* Roster + Timeline */}
        <div className={`grid gap-6 ${selectedStudent ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          <div>
            <ClassroomRoster
              classroom={user?.classroom}
              search={search}
              refreshKey={refreshKey}
              selectedId={selectedStudent?.id}
              onSelect={setSelectedStudent}
            />
          </div>
          {selectedStudent && (
            <div className="animate-slide-up">
              <StudentTimeline student={selectedStudent} onClose={() => setSelectedStudent(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
