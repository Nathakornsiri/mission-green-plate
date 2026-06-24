import { useState, useEffect } from 'react';
import { studentsAPI, feedbackAPI } from '../../api';
import FeedbackViewer from './FeedbackViewer';

export default function StudentTimeline({ student, onClose }) {
  const [timeline, setTimeline] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!student?.id) return;
    setLoading(true);
    Promise.all([
      studentsAPI.getTimeline(student.id),
      feedbackAPI.getStudent(student.id),
    ])
      .then(([tRes, fRes]) => { setTimeline(tRes.data); setFeedback(fRes.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [student?.id]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('th-TH', {
      weekday: 'short', day: 'numeric', month: 'short', year: '2-digit',
    });

  return (
    <div className="eco-card overflow-hidden h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#C8E6C9] flex items-center justify-between bg-[#E8F5E9]">
        <div>
          <h2 className="font-bold text-[#1B4332]">📅 ประวัติ: {student.name}</h2>
          <p className="text-xs text-[#52796F]">ห้อง {student.classroom} • เลขที่ {student.username}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
              showFeedback
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'border-[#C8E6C9] text-[#52796F] hover:bg-[#E8F5E9]'
            }`}
          >
            💬 ความคิดเห็น ({feedback.length})
          </button>
          <button
            onClick={onClose}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#C8E6C9] text-[#52796F] hover:text-red-500 hover:border-red-300 transition-colors"
          >
            ✕ ปิด
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="text-3xl animate-float">⏳</div>
          <p className="text-[#52796F] mt-2 text-sm">กำลังโหลด...</p>
        </div>
      ) : showFeedback ? (
        <FeedbackViewer feedback={feedback} studentName={student.name} />
      ) : (
        <div className="overflow-y-auto max-h-[600px]">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-px border-b border-[#C8E6C9]">
            {[
              { label: 'กินหมดทั้งหมด', value: timeline.filter(r => r.is_finished).length,  color: 'text-[#2E7D32]', bg: 'bg-green-50' },
              { label: 'กินไม่หมด',     value: timeline.filter(r => !r.is_finished).length, color: 'text-[#FF6B35]', bg: 'bg-orange-50' },
              { label: 'แต้มสะสม',      value: student.total_points_earned ?? 0,             color: 'text-[#FF6B35]', bg: 'bg-white' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} px-4 py-3 text-center`}>
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-[#52796F]">{label}</p>
              </div>
            ))}
          </div>

          {timeline.length === 0 ? (
            <div className="py-10 text-center text-[#52796F] text-sm">ยังไม่มีประวัติการกินอาหาร</div>
          ) : (
            <div className="divide-y divide-[#E8F5E9]">
              {timeline.map((record) => (
                <div
                  key={record.id}
                  className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                    record.is_finished ? 'hover:bg-green-50' : 'hover:bg-orange-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${record.is_finished ? 'bg-[#4CAF50]' : 'bg-[#FF6B35]'}`} />
                  <div className="text-xs text-[#52796F] w-28 flex-shrink-0 font-mono">
                    {formatDate(record.date)}
                  </div>
                  <div className="flex-1 text-sm text-[#1B4332] font-medium truncate">{record.menu_name}</div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={record.is_finished ? 'badge-finished' : 'badge-not-finished'}>
                      {record.is_finished ? '✅ กินหมด' : '❌ กินไม่หมด'}
                    </span>
                    <span className={`text-xs font-bold ${record.points_changed > 0 ? 'text-[#2E7D32]' : 'text-[#FF6B35]'}`}>
                      {record.points_changed > 0 ? '+' : ''}{record.points_changed} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
