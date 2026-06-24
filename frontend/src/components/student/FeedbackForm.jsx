import { useState, useEffect } from 'react';
import { feedbackAPI } from '../../api';

export default function FeedbackForm({ onSubmit }) {
  const [suggestion1, setSuggestion1] = useState('');
  const [suggestion2, setSuggestion2] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    feedbackAPI.getMy()
      .then((res) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayFeedback = res.data.find((f) => f.date === todayStr);
        if (todayFeedback) {
          setSuggestion1(todayFeedback.suggestion1 || '');
          setSuggestion2(todayFeedback.suggestion2 || '');
          setSubmitted(true);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion1.trim() && !suggestion2.trim()) {
      setError('กรุณากรอกข้อความอย่างน้อย 1 ช่อง');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await feedbackAPI.submit({ suggestion1: suggestion1.trim(), suggestion2: suggestion2.trim() });
      setSubmitted(true);
      onSubmit?.();
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="eco-card p-5 animate-slide-up">
      <h2 className="font-bold text-[#1B4332] mb-1">💬 แสดงความคิดเห็นถึงครู</h2>
      <p className="text-xs text-[#52796F] mb-4">ส่งความคิดเห็นได้ 1 ครั้งต่อวัน (แก้ไขได้ถ้าส่งซ้ำในวันเดียวกัน)</p>

      {submitted && (
        <div className="mb-4 bg-green-50 border border-green-300 rounded-xl px-4 py-2 text-[#2E7D32] text-sm flex items-center gap-2">
          <span>✅</span>
          <span>ส่งความคิดเห็นวันนี้แล้ว — กดปุ่มเพื่ออัปเดต</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-[#FF6B35] mb-1.5 font-medium">
            🍽️ อยากกินอะไรพิเศษ?
          </label>
          <textarea
            className="input-field resize-none"
            rows={2}
            placeholder="เช่น ข้าวผัดกระเพราไก่ไข่ดาว, ผัดซีอิ๊ว..."
            value={suggestion1}
            onChange={(e) => setSuggestion1(e.target.value)}
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm text-[#4CAF50] mb-1.5 font-medium">
            💡 อยากให้ปรับปรุงตรงไหน?
          </label>
          <textarea
            className="input-field resize-none"
            rows={2}
            placeholder="เช่น อาหารหวานเกินไป, อยากได้น้ำผลไม้..."
            value={suggestion2}
            onChange={(e) => setSuggestion2(e.target.value)}
            maxLength={200}
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
          {submitting ? '⏳ กำลังส่ง...' : submitted ? '🔄 อัปเดตความคิดเห็น' : '📨 ส่งความคิดเห็น'}
        </button>
      </form>
    </div>
  );
}
