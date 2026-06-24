import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MascotGreenPlate from '../components/mascot/MascotGreenPlate';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username.trim(), password);
      navigate(user.role === 'teacher' ? '/teacher' : '/student', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (u, p, r) => { setRole(r); setUsername(u); setPassword(p); setError(''); };

  return (
    <div className="min-h-screen gp-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#4CAF50]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD600]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-48 h-48 bg-[#FF6B35]/08 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md animate-scale-in relative z-10">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <MascotGreenPlate state="happy" size={100} className="animate-float" />
          </div>
          <h1 className="text-3xl font-black text-[#1B4332] tracking-wide">
            MISSION <span className="text-[#4CAF50]">GREEN</span> PLATE
          </h1>
          <p className="text-[#52796F] mt-1.5 text-sm">ระบบบันทึกการกินอาหาร · ลดขยะ · รับแต้มเล่นเกม</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-8 h-0.5 bg-[#4CAF50] rounded-full" />
            <span className="text-xs text-[#4CAF50] font-bold">Zero Waste Mission</span>
            <span className="w-8 h-0.5 bg-[#4CAF50] rounded-full" />
          </div>
        </div>

        {/* Role Tabs */}
        <div className="eco-card p-1.5 flex mb-5 gap-1.5">
          <button
            onClick={() => { setRole('student'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              role === 'student'
                ? 'bg-[#4CAF50] text-white shadow-md'
                : 'text-[#52796F] hover:bg-[#E8F5E9]'
            }`}
          >
            🎮 นักเรียน
          </button>
          <button
            onClick={() => { setRole('teacher'); setError(''); }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              role === 'teacher'
                ? 'bg-[#1B4332] text-white shadow-md'
                : 'text-[#52796F] hover:bg-[#E8F5E9]'
            }`}
          >
            📋 ครูประจำชั้น
          </button>
        </div>

        {/* Form */}
        <div className="eco-card p-6 animate-slide-up">
          {/* Role banner */}
          <div className={`rounded-xl px-4 py-2.5 mb-5 flex items-center gap-3 ${
            role === 'student' ? 'bg-[#E8F5E9]' : 'bg-[#E8F5E9]'
          }`}>
            <span className="text-2xl">{role === 'student' ? '🎮' : '📋'}</span>
            <div>
              <p className="font-bold text-[#1B4332] text-sm">
                {role === 'student' ? 'เข้าสู่ระบบนักเรียน' : 'เข้าสู่ระบบครู'}
              </p>
              <p className="text-xs text-[#52796F]">
                {role === 'student' ? 'กินหมด = เล่นเกมได้ + แต้ม' : 'ดูรายชื่อห้องเรียนและประวัติ'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1B4332] mb-1.5">
                {role === 'student' ? '🪪 เลขประจำตัวนักเรียน' : '🪪 รหัสครู'}
              </label>
              <input
                type="text"
                className="input-field"
                placeholder={role === 'student' ? 'เช่น 31001' : 'เช่น teacher01'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1B4332] mb-1.5">🔒 รหัสผ่าน</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm text-center">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-black text-lg transition-all duration-200 active:scale-95 text-white shadow-md
                ${loading ? 'opacity-60 cursor-not-allowed' : ''}
                ${role === 'student'
                  ? 'bg-[#4CAF50] hover:bg-[#43A047]'
                  : 'bg-[#1B4332] hover:bg-[#2E7D32]'
                }`}
            >
              {loading
                ? '⏳ กำลังเข้าสู่ระบบ...'
                : role === 'student' ? '🎮 เข้าสู่ระบบ!' : '📋 เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-5 pt-4 border-t border-[#E8F5E9]">
            <p className="text-xs text-[#52796F] text-center mb-3">บัญชีทดสอบด่วน</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('31001', 'pass31001', 'student')}
                className="text-xs bg-[#E8F5E9] hover:bg-[#C8E6C9] border border-[#A5D6A7] text-[#2E7D32] rounded-xl px-2 py-2 transition-colors font-medium"
              >
                🎮 นักเรียน 31001
              </button>
              <button
                type="button"
                onClick={() => fillDemo('32002', 'pass32002', 'student')}
                className="text-xs bg-[#E8F5E9] hover:bg-[#C8E6C9] border border-[#A5D6A7] text-[#2E7D32] rounded-xl px-2 py-2 transition-colors font-medium"
              >
                ⭐ นักเรียน 32002
              </button>
              <button
                type="button"
                onClick={() => fillDemo('teacher01', 'password123', 'teacher')}
                className="text-xs bg-[#E8F5E9] hover:bg-[#C8E6C9] border border-[#A5D6A7] text-[#1B4332] rounded-xl px-2 py-2 transition-colors font-medium col-span-2"
              >
                📋 ครู teacher01 (ห้อง 3/1)
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[#6B9080] text-xs mt-5">
          Mission Green Plate · ลดขยะอาหาร รักษ์โลก 🌍
        </p>
      </div>
    </div>
  );
}
