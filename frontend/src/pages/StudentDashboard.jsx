import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentsAPI } from '../api';
import ProfileCard from '../components/student/ProfileCard';
import ZeroWasteTracker from '../components/student/ZeroWasteTracker';
import Leaderboard from '../components/student/Leaderboard';
import GameScreen from '../components/game/GameScreen';
import MealHistory from '../components/student/MealHistory';
import FeedbackForm from '../components/student/FeedbackForm';

function getTodayStatus(studentData) {
  if (!studentData) return 'none';
  const today = new Date().toISOString().split('T')[0];
  if (studentData.last_unlock_date !== today) return 'none';
  return studentData.play_unlocked_today === 1 ? 'finished' : 'not_finished';
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [activeTab, setActiveTab] = useState('game');
  const [loading, setLoading] = useState(true);
  const [scanFlash, setScanFlash] = useState(null);

  const fetchStudentData = useCallback(() => {
    if (!user?.id) return;
    studentsAPI.getById(user.id)
      .then((res) => setStudentData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  useEffect(() => { fetchStudentData(); }, [fetchStudentData]);

  useEffect(() => {
    const handleScan = (e) => {
      if (e.detail?.student_id === user?.id) {
        fetchStudentData();
        setScanFlash(e.detail.game_unlocked ? 'unlock' : 'lock');
        setTimeout(() => setScanFlash(null), 4000);
        setActiveTab('game');
      }
    };
    window.addEventListener('greenplate:scan', handleScan);
    return () => window.removeEventListener('greenplate:scan', handleScan);
  }, [user?.id, fetchStudentData]);

  if (loading) {
    return (
      <div className="min-h-screen gp-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">🌱</div>
          <p className="text-[#4CAF50] font-bold">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const todayStatus = getTodayStatus(studentData);

  const tabs = [
    { id: 'game',        label: '⚔️ เกม' },
    { id: 'leaderboard', label: '🏆 อันดับ' },
    { id: 'history',     label: '📜 ประวัติ' },
  ];

  return (
    <div className="min-h-screen gp-bg">
      {/* Scan flash notification */}
      {scanFlash && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold text-sm animate-scale-in
          ${scanFlash === 'unlock'
            ? 'bg-green-500 text-white shadow-green-200'
            : 'bg-[#FF6B35] text-white shadow-orange-200'
          }`}
        >
          {scanFlash === 'unlock'
            ? '📡 สแกนสำเร็จ! 🔓 เกมปลดล็อกแล้ว — กดเล่นได้เลย!'
            : '📡 สแกนสำเร็จ! 🔒 กินไม่หมด — อดเล่นเกมวันนี้'
          }
        </div>
      )}

      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[#C8E6C9] shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-black text-[#1B4332] text-sm hidden sm:block">MISSION GREEN PLATE</span>
          </div>

          <div className="flex gap-1 bg-[#E8F5E9] rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#4CAF50] text-white shadow-sm'
                    : 'text-[#52796F] hover:text-[#1B4332]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {studentData && (
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#1B4332]">{user?.nickname || user?.name}</p>
                <p className="text-xs text-[#FF6B35] font-bold">⭐ {studentData.current_points_balance} แต้ม</p>
              </div>
            )}
            <button
              onClick={logout}
              className="text-xs text-[#52796F] hover:text-red-500 transition-colors border border-[#C8E6C9] hover:border-red-300 px-2.5 py-1 rounded-lg"
            >
              ออก
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        {/* Profile card */}
        {studentData && <ProfileCard student={studentData} user={user} />}

        {/* Mascot + Zero Waste Tracker */}
        <ZeroWasteTracker todayStatus={todayStatus} studentName={user?.name} />

        {/* Tab content */}
        <div>
          {activeTab === 'game' && (
            <GameScreen studentId={user?.id} onProgressUpdate={fetchStudentData} />
          )}
          {activeTab === 'leaderboard' && <Leaderboard user={user} />}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <MealHistory studentId={user?.id} />
              <FeedbackForm onSubmit={fetchStudentData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
