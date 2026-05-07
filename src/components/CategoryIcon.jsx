// SVG-иллюстрации категорий из reference HTML.
// Используются на карточках категорий (Home + Texts).

const ILLUS = {
  economy: (
    <svg viewBox="0 0 200 120">
      <rect x="40" y="32" width="68" height="58" rx="4" fill="#fff8e8" stroke="#2a2418" strokeWidth="2" />
      <rect x="48" y="40" width="52" height="10" rx="1" fill="#e0a84a" stroke="#2a2418" strokeWidth="1.2" />
      <circle cx="58" cy="68" r="5" fill="#c5462e" />
      <circle cx="74" cy="68" r="5" fill="#fff8e8" stroke="#2a2418" strokeWidth="1.2" />
      <circle cx="90" cy="68" r="5" fill="#fff8e8" stroke="#2a2418" strokeWidth="1.2" />
      <text x="74" y="86" textAnchor="middle" fontFamily="Fraunces,serif" fontWeight="700" fill="#2a2418" fontSize="11">kr</text>
      <polyline points="120,80 138,55 152,68 170,30" fill="none" stroke="#c5462e" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="120" cy="80" r="3" fill="#2a2418" />
      <circle cx="138" cy="55" r="3" fill="#2a2418" />
      <circle cx="152" cy="68" r="3" fill="#2a2418" />
      <circle cx="170" cy="30" r="4" fill="#e0a84a" stroke="#2a2418" strokeWidth="1.2" />
    </svg>
  ),
  society: (
    <svg viewBox="0 0 200 120">
      <circle cx="100" cy="60" r="22" fill="#5a8a5a" opacity=".5" />
      <g transform="translate(45,30)">
        <circle cx="0" cy="10" r="7" fill="#c5462e" stroke="#2a2418" strokeWidth="1.5" />
        <rect x="-7" y="17" width="14" height="24" rx="3" fill="#c5462e" stroke="#2a2418" strokeWidth="1.5" />
      </g>
      <g transform="translate(78,22)">
        <circle cx="0" cy="10" r="7" fill="#e0a84a" stroke="#2a2418" strokeWidth="1.5" />
        <rect x="-7" y="17" width="14" height="24" rx="3" fill="#e0a84a" stroke="#2a2418" strokeWidth="1.5" />
      </g>
      <g transform="translate(111,22)">
        <circle cx="0" cy="10" r="7" fill="#5a8a5a" stroke="#2a2418" strokeWidth="1.5" />
        <rect x="-7" y="17" width="14" height="24" rx="3" fill="#5a8a5a" stroke="#2a2418" strokeWidth="1.5" />
      </g>
      <g transform="translate(144,30)">
        <circle cx="0" cy="10" r="7" fill="#7a4ab8" stroke="#2a2418" strokeWidth="1.5" />
        <rect x="-7" y="17" width="14" height="24" rx="3" fill="#7a4ab8" stroke="#2a2418" strokeWidth="1.5" />
      </g>
      <path d="M52 46 Q65 42 78 44 M85 44 Q98 42 111 44 M118 44 Q131 42 144 46" stroke="#fff8e8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  ),
  science: (
    <svg viewBox="0 0 200 120">
      <circle cx="100" cy="60" r="14" fill="#fff8e8" stroke="#2a2418" strokeWidth="2" />
      <ellipse cx="100" cy="60" rx="34" ry="10" fill="none" stroke="#c5462e" strokeWidth="2" transform="rotate(30 100 60)" />
      <ellipse cx="100" cy="60" rx="34" ry="10" fill="none" stroke="#1f4d8f" strokeWidth="2" transform="rotate(-30 100 60)" />
      <circle cx="100" cy="60" r="4" fill="#2a2418" />
      <circle cx="40" cy="32" r="10" fill="#e0a84a" stroke="#2a2418" strokeWidth="1.5" />
      <g stroke="#e0a84a" strokeWidth="2" strokeLinecap="round">
        <line x1="40" y1="14" x2="40" y2="18" />
        <line x1="40" y1="46" x2="40" y2="50" />
        <line x1="22" y1="32" x2="26" y2="32" />
        <line x1="54" y1="32" x2="58" y2="32" />
      </g>
      <path d="M30 95 Q50 88 70 95" stroke="#5a8a5a" strokeWidth="2" fill="none" />
    </svg>
  ),
  work: (
    <svg viewBox="0 0 200 120">
      <rect x="38" y="30" width="70" height="50" rx="3" fill="#fff8e8" stroke="#2a2418" strokeWidth="2" />
      <rect x="46" y="36" width="32" height="3" fill="#2a2418" />
      <rect x="46" y="44" width="54" height="2" fill="#5a4f3a" />
      <rect x="46" y="50" width="48" height="2" fill="#5a4f3a" />
      <rect x="46" y="56" width="54" height="2" fill="#5a4f3a" />
      <rect x="46" y="62" width="38" height="2" fill="#5a4f3a" />
      <rect x="20" y="80" width="106" height="6" rx="2" fill="#2a2418" />
      <rect x="60" y="86" width="26" height="14" fill="#2a2418" />
      <rect x="120" y="50" width="50" height="36" rx="4" fill="#1f4d8f" stroke="#2a2418" strokeWidth="2" />
      <text x="145" y="74" textAnchor="middle" fontFamily="Caveat,cursive" fontWeight="600" fill="#fff8e8" fontSize="20">CV</text>
    </svg>
  ),
  education: (
    <svg viewBox="0 0 200 120">
      <path d="M40 50 L100 30 L160 50 L100 70 Z" fill="#1f4d8f" stroke="#2a2418" strokeWidth="2" />
      <path d="M100 70 L100 90" stroke="#2a2418" strokeWidth="2" />
      <path d="M100 90 L90 86 L110 86 Z" fill="#e0a84a" stroke="#2a2418" strokeWidth="1.5" />
      <rect x="70" y="76" width="60" height="14" fill="#fff8e8" stroke="#2a2418" strokeWidth="2" />
      <line x1="78" y1="80" x2="122" y2="80" stroke="#5a4f3a" strokeWidth="1" />
      <line x1="78" y1="84" x2="122" y2="84" stroke="#5a4f3a" strokeWidth="1" />
      <line x1="78" y1="88" x2="100" y2="88" stroke="#5a4f3a" strokeWidth="1" />
    </svg>
  ),
  culture: (
    <svg viewBox="0 0 200 120">
      <rect x="40" y="40" width="14" height="60" fill="#c5462e" stroke="#2a2418" strokeWidth="1.5" />
      <rect x="56" y="34" width="14" height="66" fill="#1f4d8f" stroke="#2a2418" strokeWidth="1.5" />
      <rect x="72" y="44" width="14" height="56" fill="#e0a84a" stroke="#2a2418" strokeWidth="1.5" />
      <rect x="88" y="38" width="14" height="62" fill="#5a8a5a" stroke="#2a2418" strokeWidth="1.5" />
      <rect x="104" y="46" width="14" height="54" fill="#7a4ab8" stroke="#2a2418" strokeWidth="1.5" />
      <circle cx="150" cy="42" r="14" fill="#e0a84a" stroke="#2a2418" strokeWidth="1.8" />
      <path d="M150 30 L150 24 M150 60 L150 56 M138 42 L134 42 M166 42 L162 42" stroke="#e0a84a" strokeWidth="2" strokeLinecap="round" />
      <path d="M144 38 Q150 34 156 38" stroke="#2a2418" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  health: (
    <svg viewBox="0 0 200 120">
      <rect x="60" y="34" width="80" height="62" rx="6" fill="#fff8e8" stroke="#2a2418" strokeWidth="2" />
      <rect x="92" y="50" width="16" height="30" fill="#c5462e" />
      <rect x="84" y="58" width="32" height="14" fill="#c5462e" />
      <circle cx="40" cy="72" r="14" fill="#a8c4d8" stroke="#2a2418" strokeWidth="2" />
      <path d="M40 64 L40 80 M32 72 L48 72" stroke="#1f4d8f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150 30 L160 38 L156 50 L168 50 L160 62" fill="none" stroke="#c5462e" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  driving: (
    <svg viewBox="0 0 200 120">
      <rect x="36" y="44" width="100" height="42" rx="6" fill="#c5462e" stroke="#2a2418" strokeWidth="2" />
      <rect x="46" y="52" width="20" height="16" rx="1" fill="#fff8e8" />
      <rect x="72" y="52" width="20" height="16" rx="1" fill="#fff8e8" />
      <rect x="98" y="52" width="20" height="16" rx="1" fill="#fff8e8" />
      <rect x="46" y="76" width="80" height="6" fill="#2a2418" />
      <circle cx="56" cy="92" r="8" fill="#2a2418" />
      <circle cx="116" cy="92" r="8" fill="#2a2418" />
      <circle cx="56" cy="92" r="3" fill="#fff8e8" />
      <circle cx="116" cy="92" r="3" fill="#fff8e8" />
      <path d="M150 38 L168 38 L168 78 L150 78 Z" fill="#1f4d8f" stroke="#2a2418" strokeWidth="1.5" />
      <text x="159" y="62" textAnchor="middle" fontFamily="Fraunces,serif" fontWeight="700" fill="#fff8e8" fontSize="14">P</text>
    </svg>
  ),
}

export default function CategoryIcon({ category, className }) {
  const svg = ILLUS[category]
  if (!svg) return null
  return <span className={className}>{svg}</span>
}
