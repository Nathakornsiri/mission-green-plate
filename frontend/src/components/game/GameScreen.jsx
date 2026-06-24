import { useState, useEffect, useCallback } from 'react';
import { gameAPI } from '../../api';
import MonsterBattle from './MonsterBattle';
import StageMap from './StageMap';
import SkillButtons from './SkillButtons';

export default function GameScreen({ studentId, onProgressUpdate }) {
  const [progress, setProgress] = useState(null);
  const [attacking, setAttacking] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState('');
  const [monsterKillAnim, setMonsterKillAnim] = useState(false);

  const fetchProgress = useCallback(() => {
    gameAPI.getProgress()
      .then((res) => setProgress(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  useEffect(() => {
    const handler = (e) => {
      if (!studentId || e.detail?.student_id === studentId) fetchProgress();
    };
    window.addEventListener('greenplate:scan', handler);
    return () => window.removeEventListener('greenplate:scan', handler);
  }, [studentId, fetchProgress]);

  const handleAttack = async (skill) => {
    if (attacking || !progress?.play_unlocked_today) return;
    setAttacking(true);
    setError('');
    setLastResult(null);
    try {
      const res = await gameAPI.attack(skill);
      const result = res.data;
      setLastResult(result);
      if (result.monster_killed) {
        setMonsterKillAnim(true);
        setTimeout(() => setMonsterKillAnim(false), 800);
      }
      setProgress((prev) => prev ? {
        ...prev,
        current_points_balance: result.points.new_balance,
        current_stage: result.new_stage,
        current_monster_hp: result.monster_hp.current,
        current_monster_max_hp: result.monster_hp.max,
        monsters_killed_count: result.monsters_killed_count,
      } : prev);
      onProgressUpdate?.();
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setAttacking(false);
    }
  };

  if (!progress) {
    return (
      <div className="glass-card p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-float">⚔️</div>
          <p className="text-green-400 mt-3">กำลังโหลดเกม...</p>
        </div>
      </div>
    );
  }

  const isLocked = !progress.play_unlocked_today;
  const hpPercent = progress.current_monster_max_hp > 0
    ? Math.max(0, (progress.current_monster_hp / progress.current_monster_max_hp) * 100)
    : 100;

  return (
    <div className="space-y-4 animate-slide-up">
      <StageMap currentStage={progress.current_stage} monstersKilled={progress.monsters_killed_count} />

      {/* Battle Arena — dark forest green zone */}
      <div className="glass-card overflow-hidden relative">
        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl"
               style={{ background: 'rgba(13,43,26,0.94)', backdropFilter: 'blur(4px)' }}>
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🔒</div>
              <p className="text-2xl font-black text-[#FF6B35] mb-2">กินไม่หมด อดเล่นเกม!</p>
              <p className="text-green-700 text-sm">กินอาหารให้หมดในวันนี้เพื่อปลดล็อกการเล่น</p>
              <div className="mt-4 px-4 py-2 bg-orange-900/30 border border-orange-700/40 rounded-xl text-orange-400 text-sm">
                ⚠️ ถ้ากินไม่หมด — จะถูกหักแต้ม 5 แต้ม
              </div>
            </div>
          </div>
        )}

        <div className={isLocked ? 'pointer-events-none select-none opacity-25' : ''}>
          <div className="px-5 py-3 border-b border-[#1E4A2E] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-green-600">⚔️ ด่านที่ {progress.current_stage}</span>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                isLocked ? 'bg-orange-900/30 text-orange-400' : 'bg-green-900/40 text-green-400'
              }`}>
                {isLocked ? '🔒 ล็อก' : '🔓 พร้อมเล่น'}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-700">แต้มคงเหลือ:</span>
              <span className="text-[#FFD600] font-black text-lg">{progress.current_points_balance}</span>
              <span className="text-xs text-green-800">pts</span>
            </div>
          </div>

          <MonsterBattle
            stage={progress.current_stage}
            hpCurrent={progress.current_monster_hp}
            hpMax={progress.current_monster_max_hp}
            hpPercent={hpPercent}
            isKilling={monsterKillAnim}
            lastResult={lastResult}
            isLocked={isLocked}
          />

          {lastResult && (
            <div className="px-5 pb-3">
              <div className={`text-center text-sm py-2 px-4 rounded-xl border ${
                lastResult.monster_killed
                  ? 'bg-yellow-900/30 border-yellow-700/50 text-yellow-400'
                  : lastResult.skill_type === 'poison'
                    ? 'bg-purple-900/30 border-purple-700/50 text-purple-400'
                    : 'bg-green-900/30 border-green-700/50 text-green-400'
              }`}>
                {lastResult.monster_killed
                  ? `🎉 มอนสเตอร์ตายแล้ว! ฆ่าไปทั้งหมด ${lastResult.monsters_killed_count} ตัว`
                  : lastResult.skill_type === 'poison'
                    ? `☠️ ติดพิษ! ดาเมจ ${lastResult.damage_dealt.toLocaleString()} HP`
                    : `💥 โจมตี ${lastResult.damage_dealt.toLocaleString()} HP! เหลือ ${progress.current_monster_hp.toLocaleString()} HP`
                }
              </div>
            </div>
          )}

          {error && (
            <div className="px-5 pb-3">
              <div className="text-center text-sm py-2 px-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-400">
                ⚠️ {error}
              </div>
            </div>
          )}

          <SkillButtons
            points={progress.current_points_balance}
            onAttack={handleAttack}
            disabled={attacking || isLocked}
            isLocked={isLocked}
          />
        </div>
      </div>

      {!isLocked && (
        <div className="eco-card p-4 border-l-4 border-l-[#FFD600]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD600]/20 flex items-center justify-center text-xl flex-shrink-0">⚡</div>
            <div>
              <p className="font-bold text-[#1B4332] text-sm">เกมปลดล็อกแล้ว!</p>
              <p className="text-xs text-[#52796F]">
                ใช้แต้มสะสมทั้งหมด ({progress.current_points_balance} pts) โจมตีมอนสเตอร์ได้เลย
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
