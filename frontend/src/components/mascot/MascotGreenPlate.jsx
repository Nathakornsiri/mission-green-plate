/**
 * น้องจานเขียว (Mr. Green Plate) — inline SVG mascot
 * state: 'happy' | 'pouty' | 'neutral'
 */
export default function MascotGreenPlate({ state = 'neutral', size = 120, className = '' }) {
  const isHappy  = state === 'happy';
  const isPouty  = state === 'pouty';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="น้องจานเขียว"
    >
      {/* ===== Drop shadow ===== */}
      <ellipse cx="60" cy="115" rx="30" ry="4" fill="rgba(0,0,0,0.08)" />

      {/* ===== Plate rim ===== */}
      <circle cx="60" cy="60" r="56" fill={isHappy ? '#E8F5E9' : isPouty ? '#FFF3E0' : '#F0FFF4'} />
      <circle cx="60" cy="60" r="56" stroke={isHappy ? '#4CAF50' : isPouty ? '#FF6B35' : '#4CAF50'} strokeWidth="7" />

      {/* ===== Inner plate ===== */}
      <circle cx="60" cy="60" r="46" fill="white" stroke={isHappy ? '#A5D6A7' : isPouty ? '#FFCC80' : '#C8E6C9'} strokeWidth="2" />

      {/* ===== Food swirl on plate ===== */}
      {!isHappy && (
        <>
          <path d="M50 62 Q60 55 70 62 Q65 70 55 68 Z" fill={isPouty ? '#FFCC80' : '#C8E6C9'} opacity="0.5" />
          <circle cx="62" cy="58" r="4" fill={isPouty ? '#FFB74D' : '#A5D6A7'} opacity="0.4" />
        </>
      )}

      {/* ===== Blush cheeks (happy only) ===== */}
      {isHappy && (
        <>
          <ellipse cx="35" cy="67" rx="9" ry="6" fill="#FF8A80" opacity="0.35" />
          <ellipse cx="85" cy="67" rx="9" ry="6" fill="#FF8A80" opacity="0.35" />
        </>
      )}

      {/* ===== Eyes ===== */}
      {isHappy ? (
        /* Happy: arc eyes (happy squint) */
        <>
          <path d="M31 50 Q41 42 51 50" stroke="#1B4332" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M69 50 Q79 42 89 50" stroke="#1B4332" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* sparkle */}
          <circle cx="36" cy="47" r="1.5" fill="#4CAF50" />
          <circle cx="84" cy="47" r="1.5" fill="#4CAF50" />
        </>
      ) : (
        /* Neutral / Pouty: round eyes with shine */
        <>
          <circle cx="41" cy="50" r={isPouty ? 8 : 7} fill="#1B4332" />
          <circle cx="79" cy="50" r={isPouty ? 8 : 7} fill="#1B4332" />
          {/* shine dots */}
          <circle cx="37" cy="46" r="2.8" fill="white" />
          <circle cx="75" cy="46" r="2.8" fill="white" />
          <circle cx="40" cy="48.5" r="1.2" fill="white" />
          <circle cx="78" cy="48.5" r="1.2" fill="white" />
          {/* pouty upper eyelash */}
          {isPouty && (
            <>
              <path d="M34 44 Q41 38 48 44" stroke="#1B4332" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M72 44 Q79 38 86 44" stroke="#1B4332" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          )}
        </>
      )}

      {/* ===== Mouth ===== */}
      {isHappy ? (
        /* Wide happy smile */
        <>
          <path d="M34 74 Q60 96 86 74" stroke="#1B4332" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* teeth */}
          <path d="M42 76 Q60 90 78 76 Q78 83 60 84 Q42 83 42 76Z" fill="white" stroke="#E0E0E0" strokeWidth="1" />
        </>
      ) : isPouty ? (
        /* Gentle pout */
        <path d="M43 78 Q60 72 77 78" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" fill="none" />
      ) : (
        /* Neutral slight smile */
        <path d="M44 76 Q60 84 76 76" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" fill="none" />
      )}

      {/* ===== Pouty mini tear drop ===== */}
      {isPouty && (
        <>
          <ellipse cx="41" cy="63" rx="2.5" ry="3.5" fill="#64B5F6" opacity="0.7" />
          <ellipse cx="79" cy="63" rx="2.5" ry="3.5" fill="#64B5F6" opacity="0.7" />
        </>
      )}

      {/* ===== Happy arms raised ===== */}
      {isHappy && (
        <>
          {/* left arm */}
          <path d="M10 75 Q20 55 28 65" stroke="#4CAF50" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* right arm */}
          <path d="M110 75 Q100 55 92 65" stroke="#4CAF50" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* hand dots */}
          <circle cx="10" cy="75" r="4" fill="#4CAF50" />
          <circle cx="110" cy="75" r="4" fill="#4CAF50" />
        </>
      )}
    </svg>
  );
}
