export default function FeedbackViewer({ feedback, studentName }) {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' });

  return (
    <div className="overflow-y-auto max-h-[600px]">
      <div className="px-5 py-3 border-b border-[#C8E6C9] bg-purple-50">
        <p className="text-sm text-purple-700 font-medium">💬 ความคิดเห็นของ {studentName}</p>
      </div>

      {feedback.length === 0 ? (
        <div className="py-10 text-center text-[#52796F] text-sm">ยังไม่มีความคิดเห็น</div>
      ) : (
        <div className="divide-y divide-[#E8F5E9]">
          {feedback.map((f) => (
            <div key={f.id} className="px-5 py-4 hover:bg-[#F9FBF9] transition-colors">
              <p className="text-xs text-[#52796F] mb-2 font-mono">{formatDate(f.date)}</p>
              {f.suggestion1 && (
                <div className="mb-2">
                  <p className="text-xs text-[#FF6B35] mb-1 font-medium">🍽️ อยากกินอะไรพิเศษ:</p>
                  <p className="text-sm text-[#1B4332] bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                    {f.suggestion1}
                  </p>
                </div>
              )}
              {f.suggestion2 && (
                <div>
                  <p className="text-xs text-[#4CAF50] mb-1 font-medium">💡 อยากปรับปรุงตรงไหน:</p>
                  <p className="text-sm text-[#1B4332] bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    {f.suggestion2}
                  </p>
                </div>
              )}
              {!f.suggestion1 && !f.suggestion2 && (
                <p className="text-xs text-[#6B9080]">ไม่มีความคิดเห็น</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
