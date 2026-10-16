/* Pony Pals: all artwork is hand-built SVG so it looks the same on every device. */
(function () {
  'use strict';
  const OL = '#4a2e1d';

  function starPath(cx, cy, r1, r2, n) {
    n = n || 5;
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const r = i % 2 ? r2 : r1;
      const a = -Math.PI / 2 + (i * Math.PI) / n;
      d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1);
    }
    return d + 'Z';
  }
  const HEART = 'M32 56C10 40 5 26 13 17c8-8 16-5 19 2 3-7 11-10 19-2 8 9 3 23-19 39z';

  function hay() {
    let s = '<svg viewBox="0 0 64 64">';
    const strands = 9;
    for (let i = 0; i < strands; i++) {
      const t = i / (strands - 1);
      const top = 12 + t * 40, mid = 24 + t * 16, bot = 10 + t * 44;
      const col = i % 2 ? '#fde68a' : '#eab308';
      s += `<path d="M${top} 8 Q${mid} 34 ${bot} 58" stroke="#a16207" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      s += `<path d="M${top} 8 Q${mid} 34 ${bot} 58" stroke="${col}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    }
    s += '<rect x="20" y="29" width="24" height="9" rx="4" fill="#dc2626" stroke="#7f1d1d" stroke-width="2.5"/></svg>';
    return s;
  }

  function rosette(c, c2) {
    c2 = c2 || '#fff';
    let petals = '';
    for (let i = 0; i < 12; i++) petals += `<ellipse cx="32" cy="12" rx="6" ry="10" fill="${c}" stroke="#1e293b" stroke-width="1.5" transform="rotate(${i * 30} 32 26)"/>`;
    return `<svg viewBox="0 0 64 64"><path d="M24 34L16 62l9-5 4 7 3-28zM40 34l8 28-9-5-4 7-3-28z" fill="${c}" stroke="#1e293b" stroke-width="2"/>${petals}<circle cx="32" cy="26" r="11" fill="${c2}" stroke="#1e293b" stroke-width="2"/><path d="${starPath(32, 26, 7, 3)}" fill="#facc15" stroke="#a16207" stroke-width="1"/></svg>`;
  }
  const ICON = {
    apple: `<svg viewBox="0 0 64 64"><path d="M32 18c-6-5-20-4-22 10-2 13 7 28 16 28 3 0 4-2 6-2s3 2 6 2c9 0 18-15 16-28-2-14-16-15-22-10z" fill="#ef4444" stroke="#7a1f1f" stroke-width="3"/><path d="M32 18c0-5 1-8 4-11" stroke="#6b3e1e" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M35 12c4-6 12-6 15-3-4 5-10 6-15 3z" fill="#4ade80" stroke="#166534" stroke-width="2"/><ellipse cx="21" cy="30" rx="4" ry="7" fill="#fff" opacity=".45"/></svg>`,
    carrot: `<svg viewBox="0 0 64 64"><path d="M38 6c-1 6 0 10 2 14M44 8c3 4 3 9 0 13M52 14c-3 2-6 5-8 9" stroke="#166534" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M38 6c-1 6 0 10 2 14M44 8c3 4 3 9 0 13M52 14c-3 2-6 5-8 9" stroke="#4ade80" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 20c8-5 19 2 16 11L18 58c-4 3-9-1-6-6z" fill="#fb923c" stroke="#9a3412" stroke-width="3" stroke-linejoin="round"/><path d="M24 33l6 3M19 43l5 2M32 26l5 3M27 40l4 2" stroke="#9a3412" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    hay: hay(),
    brush: `<svg viewBox="0 0 64 64"><path d="M30 38L10 58" stroke="#78350f" stroke-width="12" stroke-linecap="round"/><path d="M30 38L10 58" stroke="#d97706" stroke-width="7" stroke-linecap="round"/><ellipse cx="40" cy="26" rx="20" ry="15" transform="rotate(-45 40 26)" fill="#ec4899" stroke="#831843" stroke-width="3"/><ellipse cx="40" cy="26" rx="14" ry="9" transform="rotate(-45 40 26)" fill="#fde68a"/><g fill="#92400e"><circle cx="36" cy="24" r="1.8"/><circle cx="41" cy="19" r="1.8"/><circle cx="46" cy="16" r="1.8"/><circle cx="34" cy="30" r="1.8"/><circle cx="40" cy="27" r="1.8"/><circle cx="45" cy="22" r="1.8"/><circle cx="39" cy="33" r="1.8"/><circle cx="44" cy="29" r="1.8"/></g></svg>`,
    ball: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#60a5fa" stroke="#1e3a8a" stroke-width="3"/><path d="M10 26c14 6 30 6 44 0M10 40c14-6 30-6 44 0" stroke="#f472b6" stroke-width="7" fill="none"/><path d="${starPath(32, 33, 7, 3)}" fill="#fde047" stroke="#a16207" stroke-width="1.5"/><ellipse cx="22" cy="18" rx="6" ry="3.5" fill="#fff" opacity=".55" transform="rotate(-30 22 18)"/></svg>`,
    bed: `<svg viewBox="0 0 64 64"><path d="M38 8a24 24 0 1 0 20 34A19 19 0 1 1 38 8z" fill="#fde047" stroke="#a16207" stroke-width="3" stroke-linejoin="round"/><circle cx="26" cy="30" r="2.5" fill="#a16207"/><path d="M22 40q5 4 10 0" stroke="#a16207" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="${starPath(52, 14, 7, 3)}" fill="#fff7c2" stroke="#a16207" stroke-width="1.5"/></svg>`,
    shop: `<svg viewBox="0 0 64 64"><rect x="10" y="26" width="44" height="30" rx="5" fill="#f472b6" stroke="#831843" stroke-width="3"/><rect x="7" y="18" width="50" height="11" rx="4" fill="#f9a8d4" stroke="#831843" stroke-width="3"/><rect x="28" y="18" width="8" height="38" fill="#fde047" stroke="#a16207" stroke-width="2"/><path d="M32 18c-6-12-18-10-14-2 2 3 8 3 14 2zM32 18c6-12 18-10 14-2-2 3-8 3-14 2z" fill="#fde047" stroke="#a16207" stroke-width="2.5"/></svg>`,
    shoe: `<svg viewBox="0 0 64 64"><path d="M18 10C6 28 10 56 32 56s26-28 14-46" fill="none" stroke="#7c4a03" stroke-width="15" stroke-linecap="round"/><path d="M18 10C6 28 10 56 32 56s26-28 14-46" fill="none" stroke="#facc15" stroke-width="9" stroke-linecap="round"/><g fill="#7c4a03"><circle cx="14" cy="26" r="2"/><circle cx="14" cy="38" r="2"/><circle cx="21" cy="49" r="2"/><circle cx="50" cy="26" r="2"/><circle cx="50" cy="38" r="2"/><circle cx="43" cy="49" r="2"/></g></svg>`,
    blanket: `<svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="40" rx="8" fill="url(#quilt)" stroke="#5b21b6" stroke-width="3"/><rect x="8" y="44" width="48" height="8" rx="4" fill="#fde047" stroke="#5b21b6" stroke-width="2"/></svg>`,
    lantern: `<svg viewBox="0 0 64 64"><path d="M24 12a8 8 0 0 1 16 0" fill="none" stroke="#374151" stroke-width="4"/><rect x="20" y="12" width="24" height="7" rx="3" fill="#6b7280" stroke="#1f2937" stroke-width="2.5"/><rect x="18" y="19" width="28" height="30" rx="6" fill="#fde68a" stroke="#1f2937" stroke-width="3"/><path d="M32 24c5 6 6 10 0 18-6-8-5-12 0-18z" fill="#f97316"/><path d="M32 30c2 3 2 6 0 9-2-3-2-6 0-9z" fill="#fde047"/><rect x="16" y="49" width="32" height="7" rx="3" fill="#6b7280" stroke="#1f2937" stroke-width="2.5"/></svg>`,
    home: `<svg viewBox="0 0 64 64"><path d="M8 32 32 10l24 22" fill="none" stroke="#7c2d12" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 30v24h34V30" fill="#fdba74" stroke="#7c2d12" stroke-width="4" stroke-linejoin="round"/><rect x="27" y="38" width="11" height="16" rx="2" fill="#b45309" stroke="#7c2d12" stroke-width="3"/></svg>`,
    tick: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" fill="#22c55e" stroke="#14532d" stroke-width="3"/><path d="M19 33l9 9 18-19" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    sun: `<svg viewBox="0 0 64 64"><g stroke="#f59e0b" stroke-width="5" stroke-linecap="round"><path d="M32 3v8M32 53v8M3 32h8M53 32h8M11 11l6 6M47 47l6 6M53 11l-6 6M11 53l6-6"/></g><circle cx="32" cy="32" r="16" fill="#fde047" stroke="#d97706" stroke-width="3"/><circle cx="26" cy="30" r="2" fill="#92400e"/><circle cx="38" cy="30" r="2" fill="#92400e"/><path d="M26 37q6 5 12 0" stroke="#92400e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    star: `<svg viewBox="0 0 64 64"><path d="${starPath(32, 34, 27, 12)}" fill="#fde047" stroke="#ca8a04" stroke-width="3" stroke-linejoin="round"/></svg>`,
    heart: `<svg viewBox="0 0 64 64"><path d="${HEART}" fill="#fb7185" stroke="#9f1239" stroke-width="3"/></svg>`,
    drop: `<svg viewBox="0 0 64 64"><path d="M30 8C22 22 14 30 14 40a16 16 0 0 0 32 0c0-10-8-18-16-32z" fill="#7dd3fc" stroke="#0c4a6e" stroke-width="3"/><ellipse cx="23" cy="40" rx="3" ry="6" fill="#fff" opacity=".7"/><circle cx="50" cy="16" r="6" fill="#e0f2fe" stroke="#0c4a6e" stroke-width="2"/><circle cx="54" cy="30" r="4" fill="#e0f2fe" stroke="#0c4a6e" stroke-width="2"/></svg>`,
    lock: `<svg viewBox="0 0 64 64"><path d="M22 28v-8a10 10 0 0 1 20 0v8" fill="none" stroke="#475569" stroke-width="6"/><rect x="14" y="28" width="36" height="28" rx="6" fill="#94a3b8" stroke="#334155" stroke-width="3"/><circle cx="32" cy="40" r="4" fill="#334155"/><rect x="30" y="42" width="4" height="8" fill="#334155"/></svg>`,
    pebble: `<svg viewBox="0 0 64 64"><path d="M14 40c-4-12 8-24 22-22 14 2 20 14 14 24-6 9-30 10-36-2z" fill="#a8a29e" stroke="#44403c" stroke-width="3"/><ellipse cx="28" cy="28" rx="6" ry="3" fill="#fff" opacity=".5"/></svg>`,
    tap: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#fff" stroke-width="4" opacity=".6"/><circle cx="32" cy="32" r="16" fill="#fff" opacity=".85" stroke="#7c3aed" stroke-width="3"/><circle cx="32" cy="32" r="6" fill="#7c3aed"/></svg>`,
    sparkle: `<svg viewBox="0 0 64 64"><path d="M32 2c3 18 12 27 30 30-18 3-27 12-30 30-3-18-12-27-30-30C20 29 29 20 32 2z" fill="#fff9c4" stroke="#facc15" stroke-width="2.5"/></svg>`,
    zzz: `<svg viewBox="0 0 64 64"><path d="M10 14h18L10 34h18M36 30h14L36 46h14" fill="none" stroke="#e0e7ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    music: `<svg viewBox="0 0 64 64"><path d="M24 46V14l26-6v32" fill="none" stroke="#c4b5fd" stroke-width="5" stroke-linejoin="round"/><ellipse cx="18" cy="46" rx="8" ry="6" fill="#c4b5fd"/><ellipse cx="44" cy="40" rx="8" ry="6" fill="#c4b5fd"/></svg>`,
    sound: `<svg viewBox="0 0 64 64"><path d="M10 24h10l14-12v40L20 40H10z" fill="#60a5fa" stroke="#1e3a8a" stroke-width="3" stroke-linejoin="round"/><path d="M42 22c5 6 5 14 0 20M48 16c9 9 9 23 0 32" fill="none" stroke="#1e3a8a" stroke-width="4" stroke-linecap="round"/></svg>`,

    map: `<svg viewBox="0 0 64 64"><path d="M6 14l16-6 20 6 16-6v42l-16 6-20-6-16 6z" fill="#fef3c7" stroke="#92400e" stroke-width="3" stroke-linejoin="round"/><path d="M22 8v42M42 14v42" stroke="#d6b77a" stroke-width="2"/><path d="M12 42c6-4 10 2 16-4s6-12 14-12" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="4 4" stroke-linecap="round"/><path d="${starPath(48, 22, 8, 3.5)}" fill="#facc15" stroke="#a16207" stroke-width="1.5"/><circle cx="12" cy="42" r="4" fill="#22c55e"/></svg>`,
    words: `<svg viewBox="0 0 64 64"><rect x="4" y="22" width="22" height="22" rx="4" fill="#f87171" stroke="#7f1d1d" stroke-width="3"/><rect x="21" y="8" width="22" height="22" rx="4" fill="#60a5fa" stroke="#1e3a8a" stroke-width="3"/><rect x="38" y="30" width="22" height="22" rx="4" fill="#4ade80" stroke="#14532d" stroke-width="3"/><g font-family="Arial Rounded MT Bold,Arial,sans-serif" font-weight="900" font-size="17" fill="#fff" text-anchor="middle"><text x="15" y="39">a</text><text x="32" y="25">b</text><text x="49" y="47">c</text></g></svg>`,
    log: `<svg viewBox="0 0 64 64"><rect x="6" y="26" width="52" height="22" rx="11" fill="#9a6233" stroke="#4a2e1d" stroke-width="3"/><ellipse cx="17" cy="37" rx="8" ry="11" fill="#e0b07a" stroke="#4a2e1d" stroke-width="3"/><ellipse cx="17" cy="37" rx="3.5" ry="5" fill="none" stroke="#9a6233" stroke-width="2"/><path d="M44 26c2-6 8-8 12-6-3 3-6 6-12 6z" fill="#4ade80" stroke="#166534" stroke-width="2"/></svg>`,
    beach: `<svg viewBox="0 0 64 64"><circle cx="46" cy="16" r="9" fill="#fde047" stroke="#d97706" stroke-width="2.5"/><path d="M2 36q8-8 15 0t15 0 15 0 15 0v28H2z" fill="#38bdf8" stroke="#0c4a6e" stroke-width="2.5"/><path d="M2 46q8-6 15 0t15 0 15 0 15 0" fill="none" stroke="#fff" stroke-width="3"/><path d="M2 54h60v8H2z" fill="#fcd34d"/></svg>`,
    forest: `<svg viewBox="0 0 64 64"><path d="M20 6L6 34h8L4 50h32L26 34h8z" fill="#16a34a" stroke="#14532d" stroke-width="2.5" stroke-linejoin="round"/><rect x="17" y="50" width="6" height="10" fill="#7c4a1e"/><path d="M44 14L32 38h7L30 52h28l-9-14h7z" fill="#22c55e" stroke="#14532d" stroke-width="2.5" stroke-linejoin="round"/><rect x="41" y="52" width="6" height="8" fill="#7c4a1e"/><path d="${starPath(50, 8, 6, 2.5)}" fill="#fde047" stroke="#a16207" stroke-width="1.2"/></svg>`,
    tree: `<svg viewBox="0 0 64 64"><rect x="28" y="36" width="9" height="24" rx="3" fill="#92400e" stroke="#4a2e1d" stroke-width="2.5"/><circle cx="32" cy="26" r="22" fill="#4ade80" stroke="#166534" stroke-width="3"/><g fill="#ef4444" stroke="#7f1d1d" stroke-width="1.5"><circle cx="22" cy="22" r="4.5"/><circle cx="40" cy="18" r="4.5"/><circle cx="34" cy="34" r="4.5"/><circle cx="20" cy="36" r="4"/></g><path d="M50 52c3-4 7-3 8 0-3 2-5 2-8 0z" fill="#f472b6"/></svg>`,
    rosette: rosette('#3b82f6'),
    camera: `<svg viewBox="0 0 64 64"><rect x="6" y="18" width="52" height="36" rx="8" fill="#f472b6" stroke="#831843" stroke-width="3"/><path d="M22 18l4-8h12l4 8" fill="#f9a8d4" stroke="#831843" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="36" r="12" fill="#e0e7ff" stroke="#831843" stroke-width="3"/><circle cx="32" cy="36" r="6" fill="#1e3a8a"/><circle cx="29" cy="33" r="2" fill="#fff"/><circle cx="50" cy="26" r="3" fill="#fde047"/></svg>`,
    album: `<svg viewBox="0 0 64 64"><rect x="10" y="8" width="44" height="50" rx="5" fill="#c084fc" stroke="#581c87" stroke-width="3"/><rect x="16" y="14" width="32" height="26" rx="2" fill="#bae6fd" stroke="#581c87" stroke-width="2.5"/><path d="M16 36l8-8 6 6 6-8 12 12v2H16z" fill="#4ade80"/><circle cx="40" cy="20" r="3.5" fill="#fde047"/><path d="${HEART}" transform="translate(22 42) scale(.3)" fill="#f472b6"/></svg>`,
    wand: `<svg viewBox="0 0 64 64"><path d="M12 54L38 28" stroke="#4c1d95" stroke-width="9" stroke-linecap="round"/><path d="M12 54L38 28" stroke="#a78bfa" stroke-width="5" stroke-linecap="round"/><path d="${starPath(44, 20, 16, 7)}" fill="#fde047" stroke="#a16207" stroke-width="2.5" stroke-linejoin="round"/><circle cx="18" cy="16" r="3" fill="#f472b6"/><circle cx="54" cy="44" r="2.5" fill="#60a5fa"/></svg>`,
    bottle: `<svg viewBox="0 0 64 64"><path d="M28 4h8l2 10h-12z" fill="#fb923c" stroke="#7c2d12" stroke-width="2.5" stroke-linejoin="round"/><rect x="22" y="13" width="20" height="6" rx="2" fill="#60a5fa" stroke="#1e3a8a" stroke-width="2.5"/><rect x="20" y="19" width="24" height="40" rx="8" fill="#fff" stroke="#1e3a8a" stroke-width="3"/><rect x="23" y="30" width="18" height="26" rx="5" fill="#fef3c7"/><path d="M26 26h6M26 34h6M26 42h6" stroke="#1e3a8a" stroke-width="2"/></svg>`,
    raincoat: `<svg viewBox="0 0 64 64"><path d="M22 6h20l14 14-6 8-4-4v34H18V24l-4 4-6-8z" fill="#facc15" stroke="#854d0e" stroke-width="3" stroke-linejoin="round"/><path d="M22 6q10 10 20 0" fill="#fde68a" stroke="#854d0e" stroke-width="3"/><g fill="#1e3a8a"><circle cx="32" cy="28" r="2.5"/><circle cx="32" cy="38" r="2.5"/><circle cx="32" cy="48" r="2.5"/></g></svg>`,
    rain: `<svg viewBox="0 0 64 64"><path d="M16 36a10 10 0 0 1 2-20 14 14 0 0 1 27-2 10 10 0 0 1 3 22z" fill="#e2e8f0" stroke="#475569" stroke-width="3"/><path d="M20 44l-4 10M32 44l-4 10M44 44l-4 10" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/></svg>`,
    pumpkin: `<svg viewBox="0 0 64 64"><path d="M32 16c2-6 6-8 10-8" stroke="#166534" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="20" cy="38" rx="12" ry="18" fill="#f97316" stroke="#7c2d12" stroke-width="3"/><ellipse cx="44" cy="38" rx="12" ry="18" fill="#f97316" stroke="#7c2d12" stroke-width="3"/><ellipse cx="32" cy="38" rx="11" ry="19" fill="#fb923c" stroke="#7c2d12" stroke-width="3"/></svg>`,
    berry: `<svg viewBox="0 0 64 64"><path d="M30 14c0-6 4-9 10-10" stroke="#166534" stroke-width="3" fill="none"/><path d="M30 14c-8-6-16-2-16 2 6 2 12 1 16-2z" fill="#4ade80" stroke="#166534" stroke-width="2"/><g fill="#7e22ce" stroke="#3b0764" stroke-width="2"><circle cx="24" cy="26" r="7"/><circle cx="38" cy="26" r="7"/><circle cx="31" cy="36" r="7"/><circle cx="20" cy="40" r="7"/><circle cx="42" cy="40" r="7"/><circle cx="31" cy="50" r="7"/></g><g fill="#fff" opacity=".6"><circle cx="22" cy="24" r="2"/><circle cx="36" cy="24" r="2"/><circle cx="29" cy="34" r="2"/></g></svg>`,
    leaf: `<svg viewBox="0 0 64 64"><path d="M10 54C10 26 30 10 56 8c0 28-18 46-46 46z" fill="#f97316" stroke="#7c2d12" stroke-width="3"/><path d="M10 54L44 20" stroke="#7c2d12" stroke-width="3"/></svg>`,
    crown: `<svg viewBox="0 0 64 64"><path d="M8 50L6 16l14 14 12-20 12 20 14-14-2 34z" fill="#facc15" stroke="#92400e" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="40" r="5" fill="#60a5fa"/><circle cx="18" cy="42" r="3.5" fill="#f472b6"/><circle cx="46" cy="42" r="3.5" fill="#4ade80"/></svg>`,
    party: `<svg viewBox="0 0 64 64"><path d="M14 58L32 8l18 50z" fill="#a78bfa" stroke="#4c1d95" stroke-width="3" stroke-linejoin="round"/><path d="M22 38l20-2M27 22l11-1" stroke="#fde047" stroke-width="5"/><circle cx="32" cy="7" r="6" fill="#f472b6" stroke="#4c1d95" stroke-width="2.5"/></svg>`,
    glasses: `<svg viewBox="0 0 64 64"><path d="M4 26h56" stroke="#1f2937" stroke-width="4"/><path d="M18 46C6 38 4 26 10 22c4-2 8 0 8 4 0-4 5-6 9-4 6 4 3 16-9 24zM46 46c-12-8-14-20-8-24 4-2 8 0 8 4 0-4 5-6 9-4 6 4 3 16-9 24z" fill="#ec4899" fill-opacity=".7" stroke="#831843" stroke-width="3"/></svg>`,
    flowercrown: `<svg viewBox="0 0 64 64"><path d="M6 40Q32 16 58 40" fill="none" stroke="#16a34a" stroke-width="5"/><g stroke="#9d174d" stroke-width="2"><circle cx="10" cy="36" r="7" fill="#f9a8d4"/><circle cx="21" cy="27" r="7" fill="#fde047"/><circle cx="32" cy="24" r="8" fill="#c4b5fd"/><circle cx="43" cy="27" r="7" fill="#fff"/><circle cx="54" cy="36" r="7" fill="#f9a8d4"/></g></svg>`,
    none: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="#fff" stroke="#94a3b8" stroke-width="5"/><path d="M17 47L47 17" stroke="#94a3b8" stroke-width="5"/></svg>`,
    cuddle: `<svg viewBox="0 0 64 64"><path d="${HEART}" fill="#fb7185" stroke="#9f1239" stroke-width="3"/><path d="${HEART}" transform="translate(30 2) scale(.42)" fill="#f9a8d4" stroke="#9f1239" stroke-width="5"/><path d="${HEART}" transform="translate(2 4) scale(.32)" fill="#fda4af" stroke="#9f1239" stroke-width="6"/></svg>`,
    flower: `<svg viewBox="0 0 64 64"><path d="M32 34v26" stroke="#16a34a" stroke-width="4"/><path d="M32 50c-8-6-14-4-16 0 6 3 11 3 16 0z" fill="#4ade80" stroke="#166534" stroke-width="2"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="32" cy="14" rx="7" ry="10" fill="#f472b6" stroke="#9d174d" stroke-width="2" transform="rotate(${a} 32 24)"/>`).join('')}<circle cx="32" cy="24" r="6" fill="#fde047" stroke="#a16207" stroke-width="2"/></svg>`,
    t_bow: `<svg viewBox="0 0 64 64"><path d="M14 18c22 0 34 12 34 30" fill="none" stroke="#7c3aed" stroke-width="7" stroke-linecap="round"/><path d="M36 44l12 10 10-14" fill="none" stroke="#7c3aed" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    t_nod: `<svg viewBox="0 0 64 64"><path d="M32 8v48" stroke="#2563eb" stroke-width="7" stroke-linecap="round"/><path d="M20 20L32 8l12 12M20 44l12 12 12-12" fill="none" stroke="#2563eb" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    t_spin: `<svg viewBox="0 0 64 64"><path d="M50 32a18 18 0 1 1-6-13" fill="none" stroke="#db2777" stroke-width="7" stroke-linecap="round"/><path d="M48 6l-2 14-14-2" fill="none" stroke="#db2777" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    t_wave: `<svg viewBox="0 0 64 64"><rect x="24" y="8" width="14" height="36" rx="7" fill="#d6a36a" stroke="#4a2e1d" stroke-width="3" transform="rotate(-25 31 40)"/><rect x="20" y="40" width="20" height="13" rx="5" fill="#5a3b26" stroke="#4a2e1d" stroke-width="3" transform="rotate(-25 31 40)"/><path d="M48 12q6 6 0 12M54 6q10 12 0 24" fill="none" stroke="#f59e0b" stroke-width="4" stroke-linecap="round"/></svg>`,
    t_hop: `<svg viewBox="0 0 64 64"><path d="M32 54V14" stroke="#16a34a" stroke-width="7" stroke-linecap="round"/><path d="M18 28L32 12l14 16" fill="none" stroke="#16a34a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 58h40" stroke="#a16207" stroke-width="5" stroke-linecap="round"/></svg>`,
    t_dance: `<svg viewBox="0 0 64 64"><path d="M22 48V14l30-6v34" fill="none" stroke="#c026d3" stroke-width="5" stroke-linejoin="round"/><ellipse cx="16" cy="48" rx="8" ry="6" fill="#c026d3"/><ellipse cx="46" cy="42" rx="8" ry="6" fill="#c026d3"/><path d="${starPath(10, 14, 6, 2.5)}" fill="#fde047"/></svg>`,
    fence: `<svg viewBox="0 0 64 64"><rect x="8" y="14" width="8" height="44" rx="2" fill="#fff" stroke="#334155" stroke-width="2.5"/><rect x="48" y="14" width="8" height="44" rx="2" fill="#fff" stroke="#334155" stroke-width="2.5"/><rect x="4" y="24" width="56" height="8" rx="3" fill="#ef4444" stroke="#7f1d1d" stroke-width="2.5"/><rect x="4" y="40" width="56" height="8" rx="3" fill="#fff" stroke="#334155" stroke-width="2.5"/></svg>`,
    // name pictures
    daisy: (() => { let p = ''; for (let i = 0; i < 10; i++) p += `<ellipse cx="32" cy="15" rx="6" ry="12" fill="#fff" stroke="#9ca3af" stroke-width="2" transform="rotate(${i * 36} 32 32)"/>`; return `<svg viewBox="0 0 64 64">${p}<circle cx="32" cy="32" r="9" fill="#facc15" stroke="#a16207" stroke-width="2.5"/></svg>`; })(),
    moon: `<svg viewBox="0 0 64 64"><path d="M40 6a26 26 0 1 0 20 38A21 21 0 1 1 40 6z" fill="#fef9c3" stroke="#a16207" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="26" r="3" fill="#fde68a"/><circle cx="30" cy="44" r="4" fill="#fde68a"/></svg>`,
    rainbow: `<svg viewBox="0 0 64 64"><g fill="none" stroke-width="6"><path d="M6 50a26 26 0 0 1 52 0" stroke="#ef4444"/><path d="M12 50a20 20 0 0 1 40 0" stroke="#f59e0b"/><path d="M18 50a14 14 0 0 1 28 0" stroke="#22c55e"/><path d="M24 50a8 8 0 0 1 16 0" stroke="#3b82f6"/></g><g fill="#fff" stroke="#93c5fd" stroke-width="2"><circle cx="8" cy="52" r="6"/><circle cx="15" cy="54" r="5"/><circle cx="56" cy="52" r="6"/><circle cx="49" cy="54" r="5"/></g></svg>`,
    cookie: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="25" fill="#d4a373" stroke="#7c4a1e" stroke-width="3"/><g fill="#5b3415"><circle cx="22" cy="24" r="4"/><circle cx="40" cy="20" r="3.5"/><circle cx="36" cy="36" r="4"/><circle cx="20" cy="40" r="3"/><circle cx="44" cy="44" r="3.5"/><circle cx="30" cy="48" r="2.5"/></g></svg>`,
    snow: `<svg viewBox="0 0 64 64"><g stroke="#60a5fa" stroke-width="5" stroke-linecap="round" fill="none"><path d="M32 6v52M9 19l46 26M9 45l46-26"/><path d="M26 10l6 6 6-6M26 54l6-6 6 6M10 27l8-2-2-8M54 37l-8 2 2 8M10 37l8 2-2 8M54 27l-8-2 2-8"/></g></svg>`,
    bunny: `<svg viewBox="0 0 120 120"><g stroke="${OL}" stroke-width="4" stroke-linejoin="round"><ellipse cx="44" cy="22" rx="9" ry="22" fill="#f5f5f4" transform="rotate(-12 44 22)"/><ellipse cx="66" cy="22" rx="9" ry="22" fill="#f5f5f4" transform="rotate(12 66 22)"/><ellipse cx="58" cy="88" rx="34" ry="26" fill="#f5f5f4"/><circle cx="93" cy="92" r="9" fill="#fff"/><circle cx="55" cy="56" r="24" fill="#f5f5f4"/><ellipse cx="40" cy="110" rx="12" ry="6" fill="#f5f5f4"/><ellipse cx="70" cy="110" rx="12" ry="6" fill="#f5f5f4"/></g><ellipse cx="44" cy="24" rx="4" ry="14" fill="#fbcfe8" transform="rotate(-12 44 24)"/><ellipse cx="66" cy="24" rx="4" ry="14" fill="#fbcfe8" transform="rotate(12 66 24)"/><circle cx="46" cy="53" r="4" fill="#1f2937"/><circle cx="64" cy="53" r="4" fill="#1f2937"/><circle cx="47" cy="51.5" r="1.4" fill="#fff"/><circle cx="65" cy="51.5" r="1.4" fill="#fff"/><path d="M52 62l3 3 3-3z" fill="#f472b6"/><path d="M49 67q6 5 12 0" stroke="${OL}" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="38" cy="63" r="4" fill="#fda4af" opacity=".6"/><circle cx="72" cy="63" r="4" fill="#fda4af" opacity=".6"/></svg>`,
    // shop items
    bow: `<svg viewBox="0 0 64 64"><path d="M32 32L8 16v32zM32 32l24-16v32z" fill="#ff4d8d" stroke="#831843" stroke-width="3" stroke-linejoin="round"/><circle cx="32" cy="32" r="8" fill="#ff86b3" stroke="#831843" stroke-width="3"/></svg>`,
    saddle: `<svg viewBox="0 0 64 64"><path d="M6 26q26-10 52 0l2 18q-28 8-56 0z" fill="#e11d48" stroke="#4a2e1d" stroke-width="3"/><path d="M14 22q18-14 36 0-6 12-18 12T14 22z" fill="#92400e" stroke="#4a2e1d" stroke-width="3"/><path d="M32 40v14" stroke="#4a2e1d" stroke-width="4"/><rect x="25" y="53" width="14" height="6" rx="2" fill="#9ca3af" stroke="#4a2e1d" stroke-width="2"/></svg>`,
    bunting: `<svg viewBox="0 0 64 64"><path d="M2 14q30 14 60 0" fill="none" stroke="#7c2d12" stroke-width="3"/><path d="M6 16l6 22 7-19z" fill="#f472b6" stroke="#831843" stroke-width="2"/><path d="M22 21l6 22 7-21z" fill="#60a5fa" stroke="#1e3a8a" stroke-width="2"/><path d="M38 21l7 21 6-22z" fill="#facc15" stroke="#a16207" stroke-width="2"/><path d="M53 17l5 20 4-21z" fill="#4ade80" stroke="#166534" stroke-width="2"/></svg>`,
    flowers: `<svg viewBox="0 0 64 64"><path d="M20 26v14M32 18v22M44 26v14" stroke="#16a34a" stroke-width="4"/><circle cx="20" cy="22" r="7" fill="#f472b6" stroke="#9d174d" stroke-width="2"/><circle cx="32" cy="15" r="8" fill="#facc15" stroke="#a16207" stroke-width="2"/><circle cx="44" cy="22" r="7" fill="#a78bfa" stroke="#5b21b6" stroke-width="2"/><circle cx="20" cy="22" r="2.5" fill="#fff"/><circle cx="32" cy="15" r="3" fill="#fff"/><circle cx="44" cy="22" r="2.5" fill="#fff"/><path d="M14 38h36l-5 20H19z" fill="#ea580c" stroke="#7c2d12" stroke-width="3" stroke-linejoin="round"/></svg>`,
    lights: `<svg viewBox="0 0 64 64"><path d="M2 14q30 18 60 0" fill="none" stroke="#334155" stroke-width="2.5"/><g stroke="#334155" stroke-width="2"><circle cx="10" cy="24" r="6" fill="#fde047"/><circle cx="24" cy="31" r="6" fill="#f472b6"/><circle cx="40" cy="31" r="6" fill="#60a5fa"/><circle cx="54" cy="24" r="6" fill="#4ade80"/></g></svg>`,
  };

  function maneIcon(fill) {
    return `<svg viewBox="0 0 64 64"><path d="M40 6c-14 2-22 12-20 24 1 8-6 14-12 16 8 8 22 10 30 2 6-6 4-14 8-20 4-6 10-8 12-14-6-6-12-9-18-8z" fill="${fill}" stroke="#4a2e1d" stroke-width="3" stroke-linejoin="round"/><path d="M36 14c-8 4-10 12-8 20M46 16c-6 4-8 10-8 16" stroke="#fff" stroke-width="2.5" fill="none" opacity=".5" stroke-linecap="round"/></svg>`;
  }

  // Shared gradients & patterns, injected once into the page.
  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <linearGradient id="g-rainbow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b6b"/><stop offset=".25" stop-color="#ffd93d"/><stop offset=".5" stop-color="#6bcb77"/><stop offset=".75" stop-color="#4d96ff"/><stop offset="1" stop-color="#c77dff"/></linearGradient>
    <pattern id="quilt" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#c4b5fd"/><rect width="12" height="12" fill="#f9a8d4"/><rect x="12" y="12" width="12" height="12" fill="#f9a8d4"/><circle cx="18" cy="6" r="2.5" fill="#fff"/><circle cx="6" cy="18" r="2.5" fill="#fff"/></pattern>
  </defs></svg>`;

  // ---------- The pony ----------
  // Built as an outline pass + a fill pass of the same silhouette so every part is joined.
  function silhouette(cls) {
    return `
      <g class="leg leg-nb"><rect class="${cls}" x="118" y="196" width="30" height="104" rx="14"/></g>
      <g class="leg leg-nf"><rect class="${cls}" x="252" y="196" width="30" height="104" rx="14"/></g>
      <ellipse class="${cls}" cx="205" cy="182" rx="106" ry="60"/>
      <path class="${cls}" d="M262 180C250 135 268 98 290 70L342 92C326 120 318 150 314 188Z"/>
      <g class="hd">
        <path class="${cls}" d="M289 64L292 18L318 50Z"/>
        <path class="${cls}" d="M314 54L332 14L346 56Z"/>
        <ellipse class="${cls}" cx="324" cy="82" rx="44" ry="35" transform="rotate(22 324 82)"/>
        <ellipse class="${cls}" cx="357" cy="112" rx="31" ry="25"/>
      </g>`;
  }
  const SPOTS = [[165, 165, 17], [217, 200, 18], [252, 156, 14], [134, 188, 13], [196, 144, 12], [133, 262, 11], [267, 258, 11], [240, 220, 13], [178, 214, 12], [300, 150, 10]];
  function mud() {
    return SPOTS.map(([x, y, r], i) =>
      `<g class="spot" data-i="${i}"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.8}"/><circle cx="${x + r * 0.9}" cy="${y - r * 0.5}" r="${r * 0.35}"/><circle cx="${x - r * 0.8}" cy="${y + r * 0.6}" r="${r * 0.3}"/></g>`).join('');
  }
  const TAIL = 'M106 150C74 146 56 178 58 222C60 258 78 284 98 282C88 252 92 212 114 178Z';

  function ponySVG() {
    return `<svg class="pony" viewBox="40 0 370 316" aria-hidden="true">
      <g class="tail"><path class="mane" d="${TAIL}"/><path class="mane-shine" d="M92 170C76 186 72 214 76 240" /></g>
      <g class="leg leg-fb"><rect class="po" x="150" y="192" width="26" height="104" rx="12"/><rect class="pd" x="150" y="192" width="26" height="100" rx="12"/><rect class="hoof" x="147" y="278" width="32" height="20" rx="7"/></g>
      <g class="leg leg-ff"><rect class="po" x="284" y="192" width="26" height="104" rx="12"/><rect class="pd" x="284" y="192" width="26" height="100" rx="12"/><rect class="hoof" x="281" y="278" width="32" height="20" rx="7"/></g>
      <g class="sil-o">${silhouette('po')}</g>
      <g class="sil-f">${silhouette('pf')}</g>
      <g class="leg leg-nb"><rect class="hoof" x="115" y="282" width="36" height="22" rx="8"/></g>
      <g class="leg leg-nf"><rect class="hoof" x="249" y="282" width="36" height="22" rx="8"/></g>
      <g class="mane-neck">
        <circle class="mane" cx="258" cy="172" r="11"/><circle class="mane" cx="259" cy="151" r="14"/>
        <circle class="mane" cx="264" cy="128" r="15"/><circle class="mane" cx="272" cy="104" r="16"/>
        <circle class="mane" cx="282" cy="80" r="16"/>
      </g>
      <g class="hd">
        <circle class="mane" cx="292" cy="60" r="15"/>
        <path class="ear-in" d="M295 56L296 30L310 50Z"/><path class="ear-in" d="M321 52L331 25L339 54Z"/>
        <ellipse class="muz" cx="358" cy="114" rx="28" ry="21"/>
        <ellipse class="nostril" cx="371" cy="106" rx="4" ry="6" transform="rotate(-15 371 106)"/>
        <path class="mouth" d="M349 124Q360 133 372 124"/>
        <circle class="cheek" cx="337" cy="101" r="8"/>
        <g class="eye-open"><ellipse cx="317" cy="80" rx="12" ry="14" fill="#fff"/><circle cx="319" cy="82" r="9" fill="#2b1d14"/><circle cx="322" cy="77" r="3.5" fill="#fff"/><circle cx="315" cy="86" r="1.6" fill="#fff"/></g>
        <path class="lid" d="M304 80A13 14 0 0 1 330 80Z"/>
        <path class="eye-shut" d="M305 82Q317 92 329 82"/>
        <path class="lash" d="M306 70l-7-4M309 67l-4-7"/>
        <path class="mane" d="M298 52C304 38 324 38 326 56C318 51 309 55 303 64Z"/>
        <g class="bow"><path d="M304 44L288 32L290 56ZM304 44L320 32L318 56Z"/><circle cx="304" cy="44" r="6"/></g>
        <g class="prop prop-glasses"><path d="M298 74L286 70" stroke="#1f2937" stroke-width="4"/><path d="M333 80L350 82" stroke="#1f2937" stroke-width="4"/><path d="M318 98C300 88 294 70 304 64c6-4 12 0 14 6 2-6 8-10 14-6 10 6 4 24-14 34z" fill="#ec4899" fill-opacity=".6" stroke="#831843" stroke-width="3.5"/></g>
        <g class="prop prop-crown"><path d="M296 44L294 14L306 28L314 8L322 28L334 14L332 44Z" fill="#facc15" stroke="#92400e" stroke-width="3.5" stroke-linejoin="round"/><circle cx="314" cy="8" r="4" fill="#f472b6" stroke="#92400e" stroke-width="2"/><circle cx="313" cy="36" r="4.5" fill="#60a5fa"/><circle cx="301" cy="37" r="3" fill="#f472b6"/><circle cx="325" cy="37" r="3" fill="#4ade80"/></g>
        <g class="prop prop-party"><path d="M298 44L316 -10L334 44Z" fill="#a78bfa" stroke="#4c1d95" stroke-width="3.5" stroke-linejoin="round"/><path d="M304 26L327 24M309 12L322 11" stroke="#fde047" stroke-width="5"/><circle cx="316" cy="-12" r="7" fill="#f472b6" stroke="#4c1d95" stroke-width="3"/></g>
        <g class="prop prop-flowers"><path d="M288 52Q314 30 342 50" fill="none" stroke="#16a34a" stroke-width="5"/><g stroke="#9d174d" stroke-width="2"><circle cx="290" cy="50" r="7" fill="#f9a8d4"/><circle cx="302" cy="40" r="7" fill="#fde047"/><circle cx="315" cy="36" r="7.5" fill="#c4b5fd"/><circle cx="328" cy="40" r="7" fill="#fff"/><circle cx="340" cy="49" r="7" fill="#f9a8d4"/></g><g fill="#f59e0b"><circle cx="290" cy="50" r="2.5"/><circle cx="302" cy="40" r="2.5"/><circle cx="315" cy="36" r="2.5"/><circle cx="328" cy="40" r="2.5"/><circle cx="340" cy="49" r="2.5"/></g></g>
      </g>
      <g class="rumble"><path d="M180 256q5 7 10 0t10 0M206 262q5 7 10 0t10 0M232 256q5 7 10 0"/></g>
      <g class="mud">${mud()}</g>
      <g class="saddle"><path class="saddle-pad" d="M158 132Q205 116 252 132L256 170Q205 182 154 170Z"/><path class="saddle-seat" d="M172 126Q205 106 238 126Q230 146 205 148Q180 146 172 126Z"/><path class="saddle-strap" d="M205 172V214"/><rect class="saddle-stirrup" x="196" y="212" width="18" height="9" rx="3"/></g>
      <g class="raincoat"><path class="rc" d="M110 150Q205 98 302 146L308 216Q205 250 106 216Z"/><path class="rc" d="M270 138L300 128L314 168L292 176Z"/><g fill="#1e3a8a"><circle cx="230" cy="150" r="5"/><circle cx="236" cy="178" r="5"/><circle cx="238" cy="206" r="5"/></g><path d="M130 160Q205 128 286 156" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/></g>
      <g class="blanket"><path d="M110 150Q205 98 302 146L308 214Q205 248 106 214Z"/><path class="blanket-trim" d="M106 214Q205 248 308 214"/></g>
    </svg>`;
  }

  const COATS = {
    brown:  { word: 'brown',  coat: '#b8743f', coatd: '#93582c', muz: '#e9c19b', mane: '#4a2c17', hoof: '#5a3b26' },
    white:  { word: 'white',  coat: '#f7f2ea', coatd: '#dcd2c4', muz: '#ffd9d2', mane: '#e7c46b', hoof: '#8b7d6b' },
    grey:   { word: 'grey',   coat: '#a9abbd', coatd: '#85879c', muz: '#dcdde8', mane: '#4b4b60', hoof: '#45455a' },
    golden: { word: 'golden', coat: '#e8b85a', coatd: '#c4923a', muz: '#f8dfb0', mane: '#fff6df', hoof: '#7a5426' },
    pink:   { word: 'pink',   coat: '#f7a8c8', coatd: '#de84ab', muz: '#ffd6e6', mane: '#a855f7', hoof: '#9d4e78' },
    purple: { word: 'purple', coat: '#bba5ec', coatd: '#9a80d6', muz: '#e6dcff', mane: '#f472b6', hoof: '#6b4fa8' },
  };
  const MANES = { pink: '#ff8fc7', blue: '#6fb7ff', gold: '#ffd34d', rainbow: 'url(#g-rainbow)' };

  function applyLook(el, look) {
    const c = COATS[look.coat] || (window.ART && ART.VCOATS && ART.VCOATS[look.coat]) || COATS.brown;
    el.style.setProperty('--coat', c.coat);
    el.style.setProperty('--coatd', c.coatd);
    el.style.setProperty('--muz', c.muz);
    el.style.setProperty('--hoof', c.hoof);
    el.style.setProperty('--mane', look.mane ? MANES[look.mane] : c.mane);
    el.classList.toggle('has-bow', !!look.bow);
    el.classList.toggle('has-saddle', !!look.saddle);
    el.classList.toggle('has-blanket', !!look.blanket);
    el.classList.toggle('has-raincoat', !!look.raincoat);
    ['glasses', 'crown', 'party', 'flowers'].forEach(p => el.classList.toggle('p-' + p, look.prop === p));
  }

  // Static copy of the pony styles, used when a photo is turned into a picture file.
  const PONY_CSS = `.po{fill:var(--ol);stroke:var(--ol);stroke-width:9;stroke-linejoin:round}.pf{fill:var(--coat)}.pd{fill:var(--coatd)}.muz{fill:var(--muz)}
.hoof{fill:var(--hoof);stroke:var(--ol);stroke-width:3}.mane{fill:var(--mane);stroke:var(--ol);stroke-width:4;stroke-linejoin:round}
.mane-shine{fill:none;stroke:#fff;stroke-opacity:.35;stroke-width:4;stroke-linecap:round}.ear-in{fill:#f9a8c0}.nostril{fill:#3b2a20;opacity:.75}
.mouth{fill:none;stroke:#3b2a20;stroke-width:3.5;stroke-linecap:round}.lash{fill:none;stroke:#3b2a20;stroke-width:3;stroke-linecap:round}
.cheek{fill:#ff7aa2;opacity:.45}.lid,.eye-shut,.bow,.saddle,.blanket,.raincoat,.rumble,.prop{display:none}.spot{opacity:0}
.has-bow .bow{display:inline;fill:#ff4d8d;stroke:var(--ol);stroke-width:3}.has-saddle .saddle{display:inline}
.saddle-pad{fill:#e11d48;stroke:var(--ol);stroke-width:4}.saddle-seat{fill:#92400e;stroke:var(--ol);stroke-width:4}.saddle-strap{stroke:#5b3a1a;stroke-width:5}.saddle-stirrup{fill:#cbd5e1;stroke:var(--ol);stroke-width:3}
.has-raincoat .raincoat{display:inline}.rc{fill:#facc15;stroke:var(--ol);stroke-width:4;stroke-linejoin:round}
.has-blanket .blanket{display:inline}.blanket path{fill:url(#quilt);stroke:var(--ol);stroke-width:4}.blanket .blanket-trim{fill:none;stroke:#facc15;stroke-width:9}
.p-glasses .prop-glasses,.p-crown .prop-crown,.p-party .prop-party,.p-flowers .prop-flowers{display:inline}`;
  const DEFS_INNER = DEFS.replace(/^[\s\S]*?<defs>/, '').replace(/<\/defs>[\s\S]*$/, '');

  window.ART = { ICON, rosette, PONY_CSS, DEFS_INNER, maneIcon, DEFS, ponySVG, applyLook, COATS, MANES, SPOTS, starPath, HEART };
})();
