import { useState, useEffect, useRef } from 'react';
import { demoAPI } from '../../api';
import api from '../../api';

const PRESET_MENUS = [
  'ข้าวผัดกะเพราไก่ไข่ดาว',
  'ข้าวมันไก่',
  'ก๋วยเตี๋ยวน้ำตุ๋น',
  'ข้าวหน้าเป็ดย่าง',
  'แกงเขียวหวานไก่ราดข้าว',
  'ผัดซีอิ๊วหมูไข่',
  'ข้าวหมูแดงราดข้าว',
  'ต้มยำกุ้งน้ำข้น',
  'ผัดไทยกุ้งสด',
  'ส้มตำไก่ย่าง',
];

const SCAN_STEPS = [
  { text: 'อ่านบัตร RFID...', icon: '📡', delay: 400 },
  { text: 'ตรวจสอบข้อมูล...', icon: '🔍', delay: 400 },
  { text: 'กำลังบันทึก...', icon: '💾', delay: 300 },
];

export default function IoTSimulator() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedUid, setSelectedUid] = useState('');
  const [menuName, setMenuName] = useState(PRESET_MENUS[0]);
  const [customMenu, setCustomMenu] = useState('');
  const [useCustomMenu, setUseCustomMenu] = useState(false);
  const [isFinished, setIsFinished] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [pulse, setPulse] = useState(false);

  // Pulse the button every few seconds to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchStudents = () => {
    demoAPI.getStudents()
      .then((res) => {
        setStudents(res.data);
        if (!selectedUid && res.data.length > 0) setSelectedUid(res.data[0].username);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (open) fetchStudents();
  }, [open]);

  const selectedStudent = students.find((s) => s.username === selectedUid);
  const finalMenu = useCustomMenu ? customMenu.trim() : menuName;

  const handleScan = async () => {
    if (!selectedUid || !finalMenu || scanning) return;
    setScanning(true);
    setResult(null);
    setError('');
    setScanStep(0);

    // Run through animation steps
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i);
      await new Promise((r) => setTimeout(r, SCAN_STEPS[i].delay));
    }

    try {
      const res = await api.post('/meal-records', {
        student_uid: selectedUid,
        menu_name: finalMenu,
        is_finished: isFinished,
      });
      setResult({ success: true, data: res.data });

      // Broadcast to all listening components
      window.dispatchEvent(new CustomEvent('greenplate:scan', {
        detail: {
          student_id: res.data.student.id,
          student_uid: selectedUid,
          game_unlocked: res.data.game_unlocked,
          points: res.data.points,
          is_finished: isFinished,
        },
      }));

      // Re-fetch student list to show updated status
      fetchStudents();
    } catch (err) {
      const msg = err.response?.data?.error || 'เกิดข้อผิดพลาด';
      setError(msg);
      setResult({ success: false });
    } finally {
      setScanning(false);
      setScanStep(0);
    }
  };

  const randomMenu = () => {
    const r = PRESET_MENUS[Math.floor(Math.random() * PRESET_MENUS.length)];
    setMenuName(r);
    setUseCustomMenu(false);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => { setOpen(!open); setMinimized(false); }}
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl
          bg-gradient-to-r from-[#2E7D32] to-[#1B4332] border border-[#4CAF50]/50
          text-white font-bold text-sm shadow-2xl shadow-green-900/40
          transition-all duration-300 hover:scale-105 active:scale-95
          ${pulse ? 'scale-110 shadow-green-400/50' : ''}
          ${open ? 'ring-2 ring-[#4CAF50]' : ''}
        `}
      >
        <span className={`text-lg ${scanning ? 'animate-spin' : 'animate-pulse'}`}>📡</span>
        <span className="hidden sm:block">IoT Simulator</span>
        {!open && (
          <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-green-400 animate-ping" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className={`fixed bottom-20 right-5 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl shadow-green-900/30
          border border-[#4CAF50]/40 transition-all duration-300
          ${minimized ? 'h-12' : 'h-auto'}
        `}
          style={{ background: 'linear-gradient(145deg, #0D2B1A 0%, #122D1C 100%)' }}
        >
          {/* Panel Header */}
          <div
            className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
            style={{ background: 'linear-gradient(90deg, #1B5E20, #2E7D32)' }}
            onClick={() => setMinimized(!minimized)}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <span className="text-xs font-black text-white tracking-widest">📡 IOT SIMULATOR</span>
            </div>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); setMinimized(!minimized); }}
                className="text-xs text-cyan-200 hover:text-white px-1">
                {minimized ? '▲' : '—'}
              </button>
              <button onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                className="text-xs text-cyan-200 hover:text-red-400 px-1">✕</button>
            </div>
          </div>

          {!minimized && (
            <div className="p-4 space-y-4">
              {/* Student Selector */}
              <div>
                <label className="block text-xs text-cyan-400 mb-1.5 font-bold tracking-wide uppercase">
                  👤 เลือกนักเรียน
                </label>
                <select
                  value={selectedUid}
                  onChange={(e) => { setSelectedUid(e.target.value); setResult(null); setError(''); }}
                  className="w-full bg-[#061218] border border-cyan-800/60 rounded-xl px-3 py-2.5
                    text-white text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {students.map((s) => (
                    <option key={s.username} value={s.username}>
                      {s.name} ({s.classroom}) • {s.today_record ? (s.today_record.is_finished ? '✅ สแกนแล้ว' : '❌ สแกนแล้ว') : '⏳ ยังไม่สแกน'}
                    </option>
                  ))}
                </select>

                {/* Student status chip */}
                {selectedStudent && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-cyan-300">⭐ {selectedStudent.current_points_balance} pts</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400">ด่าน {selectedStudent.current_stage}</span>
                    {selectedStudent.today_record && (
                      <>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-amber-400">⚠️ สแกนวันนี้แล้ว</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Menu */}
              <div>
                <label className="block text-xs text-cyan-400 mb-1.5 font-bold tracking-wide uppercase">
                  🍽️ เมนูอาหาร
                </label>
                <div className="flex gap-2">
                  <select
                    value={menuName}
                    onChange={(e) => { setMenuName(e.target.value); setUseCustomMenu(false); }}
                    disabled={useCustomMenu}
                    className="flex-1 bg-[#061218] border border-cyan-800/60 rounded-xl px-3 py-2
                      text-white text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                  >
                    {PRESET_MENUS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <button
                    onClick={randomMenu}
                    title="สุ่มเมนู"
                    className="px-3 py-2 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-800/50
                      rounded-xl text-lg transition-colors"
                  >🎲</button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="custom-menu" checked={useCustomMenu}
                    onChange={(e) => setUseCustomMenu(e.target.checked)}
                    className="accent-cyan-500" />
                  <label htmlFor="custom-menu" className="text-xs text-slate-400 cursor-pointer">กำหนดเอง</label>
                  {useCustomMenu && (
                    <input
                      type="text"
                      value={customMenu}
                      onChange={(e) => setCustomMenu(e.target.value)}
                      placeholder="พิมพ์เมนู..."
                      className="flex-1 bg-[#061218] border border-cyan-800/60 rounded-lg px-2 py-1
                        text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  )}
                </div>
              </div>

              {/* Status Toggle */}
              <div>
                <label className="block text-xs text-cyan-400 mb-1.5 font-bold tracking-wide uppercase">
                  📊 สถานะการกิน
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsFinished(true)}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all duration-200
                      ${isFinished
                        ? 'bg-green-900/60 border-green-500 text-green-300 shadow-lg shadow-green-900/40'
                        : 'bg-transparent border-[#1e2a3a] text-slate-500 hover:border-green-800'
                      }`}
                  >
                    ✅ กินหมด<br/><span className="text-xs font-normal opacity-70">+10 แต้ม</span>
                  </button>
                  <button
                    onClick={() => setIsFinished(false)}
                    className={`py-3 rounded-xl border font-bold text-sm transition-all duration-200
                      ${!isFinished
                        ? 'bg-red-900/60 border-red-500 text-red-300 shadow-lg shadow-red-900/40'
                        : 'bg-transparent border-[#1e2a3a] text-slate-500 hover:border-red-800'
                      }`}
                  >
                    ❌ กินไม่หมด<br/><span className="text-xs font-normal opacity-70">-5 แต้ม + ล็อกเกม</span>
                  </button>
                </div>
              </div>

              {/* Scan Button */}
              <button
                onClick={handleScan}
                disabled={scanning || !selectedUid || !finalMenu}
                className={`w-full py-3.5 rounded-xl font-black text-sm transition-all duration-200 relative overflow-hidden
                  ${scanning
                    ? 'bg-cyan-900/40 text-cyan-400 cursor-wait'
                    : 'bg-gradient-to-r from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 text-white active:scale-95'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {scanning ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    {SCAN_STEPS[scanStep]?.icon} {SCAN_STEPS[scanStep]?.text}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-lg">🔭</span>
                    SIMULATE SCAN
                  </span>
                )}
                {/* Scan progress bar */}
                {scanning && (
                  <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-400 animate-pulse" style={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }} />
                )}
              </button>

              {/* Result */}
              {result?.success && result.data && (
                <div className="animate-scale-in bg-green-950/60 border border-green-700/50 rounded-xl p-3 space-y-1">
                  <p className="text-green-400 font-bold text-sm">✅ สแกนสำเร็จ!</p>
                  <div className="grid grid-cols-2 gap-x-2 text-xs text-slate-300">
                    <span>นักเรียน:</span><span className="text-white font-medium">{result.data.student.name}</span>
                    <span>แต้มที่เปลี่ยน:</span>
                    <span className={result.data.meal.points_changed > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {result.data.meal.points_changed > 0 ? '+' : ''}{result.data.meal.points_changed} pts
                    </span>
                    <span>แต้มคงเหลือ:</span><span className="text-yellow-400 font-bold">{result.data.points.new_balance} pts</span>
                    <span>เกม:</span>
                    <span className={result.data.game_unlocked ? 'text-green-400' : 'text-red-400'}>
                      {result.data.game_unlocked ? '🔓 ปลดล็อกแล้ว' : '🔒 ล็อกแล้ว'}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-950/60 border border-red-700/50 rounded-xl p-3 text-red-400 text-xs">
                  ⚠️ {error}
                </div>
              )}

              {/* Quick reset */}
              <div className="pt-1 border-t border-[#1e2a3a] flex items-center justify-between">
                <span className="text-xs text-slate-600">Demo Panel v1.0</span>
                <button
                  onClick={fetchStudents}
                  className="text-xs text-cyan-700 hover:text-cyan-400 transition-colors"
                >
                  🔄 รีเฟรช
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
