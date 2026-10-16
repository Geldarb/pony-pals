/* Pony Pals v3: visiting pony friends, counting & colours games, vet check-up. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const ICON = ART.ICON, SFX = SND.SFX, say = SND.say;
  const G = () => window.PP, S = () => window.PP.S;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const STAR = ART.starPath;

  // ---------- extra art ----------
  const OL = '#4a2e1d';
  const ribbon = c => `<svg viewBox="0 0 64 64"><path d="M32 30L10 14v30zM32 30l22-16v30z" fill="${c}" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M28 34l-8 24 7-4 3 6 4-24zM36 34l8 24-7-4-3 6-4-24z" fill="${c}" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="32" cy="30" r="7" fill="${c}" stroke="${OL}" stroke-width="3"/><circle cx="30" cy="28" r="2" fill="#fff" opacity=".6"/></svg>`;
  const appleC = c => `<svg viewBox="0 0 64 64"><path d="M32 18c-6-5-20-4-22 10-2 13 7 28 16 28 3 0 4-2 6-2s3 2 6 2c9 0 18-15 16-28-2-14-16-15-22-10z" fill="${c}" stroke="${OL}" stroke-width="3"/><path d="M32 18c0-5 1-8 4-11" stroke="#6b3e1e" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M35 12c4-6 12-6 15-3-4 5-10 6-15 3z" fill="#4ade80" stroke="#166534" stroke-width="2"/><ellipse cx="21" cy="30" rx="4" ry="7" fill="#fff" opacity=".45"/></svg>`;
  const flowerC = c => `<svg viewBox="0 0 64 64"><path d="M32 34v26" stroke="#16a34a" stroke-width="4"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="32" cy="13" rx="8" ry="11" fill="${c}" stroke="${OL}" stroke-width="2" transform="rotate(${a} 32 24)"/>`).join('')}<circle cx="32" cy="24" r="6" fill="#fff" stroke="${OL}" stroke-width="2"/></svg>`;
  const basketC = c => `<svg viewBox="0 0 100 80"><path d="M22 30a28 24 0 0 1 56 0" fill="none" stroke="${OL}" stroke-width="6"/><path d="M8 30h84l-10 46H18z" fill="${c}" stroke="${OL}" stroke-width="4" stroke-linejoin="round"/><path d="M14 44h72M16 58h68" stroke="#0003" stroke-width="3"/><path d="M30 30l4 46M50 30v46M70 30l-4 46" stroke="#0002" stroke-width="3"/></svg>`;
  Object.assign(ART.ICON, {
    door: `<svg viewBox="0 0 64 64"><rect x="12" y="6" width="40" height="54" rx="4" fill="#b45309" stroke="#78350f" stroke-width="3"/><path d="M12 22h40M12 40h40M18 6l28 16M18 22l28 18" stroke="#78350f" stroke-width="3"/><circle cx="45" cy="33" r="3.5" fill="#facc15" stroke="#78350f" stroke-width="1.5"/><path d="M${4} 14q-4 6 0 12M60 14q4 6 0 12" stroke="#f472b6" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    numbers: `<svg viewBox="0 0 64 64"><rect x="4" y="18" width="20" height="26" rx="5" fill="#fde047" stroke="#a16207" stroke-width="3"/><rect x="22" y="8" width="20" height="26" rx="5" fill="#f9a8d4" stroke="#9d174d" stroke-width="3"/><rect x="40" y="26" width="20" height="26" rx="5" fill="#93c5fd" stroke="#1e3a8a" stroke-width="3"/><g font-family="Arial Rounded MT Bold,Arial,sans-serif" font-weight="900" font-size="18" text-anchor="middle" fill="${OL}"><text x="14" y="38">1</text><text x="32" y="28">2</text><text x="50" y="46">3</text></g></svg>`,
    palette: `<svg viewBox="0 0 64 64"><path d="M32 6C16 6 4 18 4 32s10 26 24 26c6 0 6-6 3-9s-1-8 5-8h8c10 0 16-6 16-14C60 16 48 6 32 6z" fill="#fff7ed" stroke="${OL}" stroke-width="3"/><circle cx="18" cy="24" r="5" fill="#ef4444"/><circle cx="30" cy="16" r="5" fill="#facc15"/><circle cx="44" cy="18" r="5" fill="#22c55e"/><circle cx="50" cy="31" r="5" fill="#3b82f6"/><circle cx="16" cy="39" r="5" fill="#a855f7"/></svg>`,
    stetho: `<svg viewBox="0 0 64 64"><path d="M16 6v14a12 12 0 0 0 24 0V6" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round"/><path d="M28 32v10a12 12 0 0 0 24 0v-6" fill="none" stroke="#3b82f6" stroke-width="5" stroke-linecap="round"/><circle cx="52" cy="30" r="7" fill="#cbd5e1" stroke="#334155" stroke-width="3"/><circle cx="52" cy="30" r="3" fill="#64748b"/><circle cx="16" cy="6" r="3" fill="#334155"/><circle cx="40" cy="6" r="3" fill="#334155"/></svg>`,
    torch: `<svg viewBox="0 0 64 64"><path d="M40 14l14-6v34l-14-6z" fill="#fef9c3" opacity=".9"/><rect x="8" y="18" width="26" height="14" rx="4" fill="#3b82f6" stroke="#1e3a8a" stroke-width="3"/><path d="M34 16h8v18h-8z" fill="#93c5fd" stroke="#1e3a8a" stroke-width="3"/><circle cx="18" cy="25" r="3" fill="#fde047"/></svg>`,
    tooth: `<svg viewBox="0 0 64 64"><path d="M18 8c-8 0-12 8-10 18 2 8 4 12 5 22 1 8 4 10 7 10 4 0 4-12 8-16 2-2 6-2 8 0 4 4 4 16 8 16 3 0 6-2 7-10 1-10 3-14 5-22 2-10-2-18-10-18-6 0-9 4-14 4S24 8 18 8z" fill="#fff" stroke="#64748b" stroke-width="3"/><path d="M48 12q4 3 4 9" stroke="#bae6fd" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    thermo: `<svg viewBox="0 0 64 64"><rect x="26" y="4" width="12" height="42" rx="6" fill="#fff" stroke="#475569" stroke-width="3"/><rect x="29.5" y="20" width="5" height="28" fill="#ef4444"/><circle cx="32" cy="50" r="10" fill="#ef4444" stroke="#475569" stroke-width="3"/><path d="M40 12h5M40 20h5M40 28h5M40 36h5" stroke="#475569" stroke-width="2"/></svg>`,
    scales: `<svg viewBox="0 0 64 64"><rect x="4" y="40" width="56" height="18" rx="6" fill="#e2e8f0" stroke="#475569" stroke-width="3"/><circle cx="32" cy="26" r="16" fill="#fff" stroke="#475569" stroke-width="3"/><path d="M32 26l8-8" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/><path d="M20 22h3M41 22h3M32 13v3" stroke="#475569" stroke-width="2"/></svg>`,
    plaster: `<svg viewBox="0 0 64 64"><rect x="4" y="22" width="56" height="20" rx="10" fill="#fdba74" stroke="#9a3412" stroke-width="3" transform="rotate(-30 32 32)"/><rect x="22" y="24" width="20" height="16" rx="3" fill="#fed7aa" stroke="#9a3412" stroke-width="2" transform="rotate(-30 32 32)"/><g fill="#9a3412" transform="rotate(-30 32 32)"><circle cx="12" cy="30" r="1.5"/><circle cx="12" cy="35" r="1.5"/><circle cx="52" cy="30" r="1.5"/><circle cx="52" cy="35" r="1.5"/></g></svg>`,
    sticker: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" fill="#fde047" stroke="#ca8a04" stroke-width="3"/><circle cx="32" cy="32" r="21" fill="#fef9c3"/><path d="${ART.HEART}" transform="translate(13 13) scale(.6)" fill="#fb7185" stroke="#9f1239" stroke-width="4"/></svg>`,
    friends: `<svg viewBox="0 0 64 64"><path d="${ART.HEART}" transform="translate(-2 6) scale(.62)" fill="#f9a8d4" stroke="#9d174d" stroke-width="4"/><path d="${ART.HEART}" transform="translate(24 6) scale(.62)" fill="#a5b4fc" stroke="#3730a3" stroke-width="4"/><path d="${STAR(32, 50, 9, 4)}" fill="#fde047" stroke="#a16207" stroke-width="2"/></svg>`,
    teapot: `<svg viewBox="0 0 64 64"><path d="M14 30c0-10 8-16 18-16s18 6 18 16v8c0 10-8 16-18 16S14 48 14 38z" fill="#f9a8d4" stroke="#9d174d" stroke-width="3"/><path d="M50 30c8 0 10 10 2 14" fill="none" stroke="#9d174d" stroke-width="4"/><path d="M14 32L4 24l2 12 8 6" fill="#f9a8d4" stroke="#9d174d" stroke-width="3" stroke-linejoin="round"/><ellipse cx="32" cy="14" rx="10" ry="4" fill="#fbcfe8" stroke="#9d174d" stroke-width="3"/><circle cx="32" cy="9" r="3.5" fill="#fde047" stroke="#9d174d" stroke-width="2"/><circle cx="26" cy="36" r="3" fill="#fff"/><circle cx="38" cy="40" r="3" fill="#fff"/></svg>`,
    cup: `<svg viewBox="0 0 64 64"><path d="M12 22h34v14c0 10-8 16-17 16S12 46 12 36z" fill="#fff" stroke="#9d174d" stroke-width="3"/><path class="tea" d="M15 26h28v9c0 8-6 13-14 13s-14-5-14-13z" fill="#b45309" opacity="0"/><path d="M46 26c8 0 8 12 0 12" fill="none" stroke="#9d174d" stroke-width="3.5"/><ellipse cx="29" cy="56" rx="22" ry="4" fill="#fbcfe8" stroke="#9d174d" stroke-width="2.5"/></svg>`,
    hide: `<svg viewBox="0 0 64 64"><ellipse cx="20" cy="32" rx="13" ry="16" fill="#fff" stroke="${OL}" stroke-width="3"/><ellipse cx="44" cy="32" rx="13" ry="16" fill="#fff" stroke="${OL}" stroke-width="3"/><circle cx="23" cy="34" r="7" fill="#1e293b"/><circle cx="47" cy="34" r="7" fill="#1e293b"/><circle cx="25" cy="31" r="2.5" fill="#fff"/><circle cx="49" cy="31" r="2.5" fill="#fff"/></svg>`,
    barrel: `<svg viewBox="0 0 64 64"><path d="M14 6h36c4 18 4 34 0 52H14c-4-18-4-34 0-52z" fill="#b45309" stroke="#78350f" stroke-width="3"/><path d="M11 18h42M10 46h44" stroke="#475569" stroke-width="5"/><path d="M24 6v52M40 6v52" stroke="#78350f" stroke-width="2"/></svg>`,
    cart: `<svg viewBox="0 0 64 64"><path d="M4 18h56l-6 24H10z" fill="#ef4444" stroke="#7f1d1d" stroke-width="3" stroke-linejoin="round"/><path d="M8 12q24 10 48 0" fill="#eab308" stroke="#a16207" stroke-width="3"/><circle cx="18" cy="50" r="9" fill="#fde68a" stroke="#78350f" stroke-width="3"/><circle cx="46" cy="50" r="9" fill="#fde68a" stroke="#78350f" stroke-width="3"/></svg>`,
    bale: `<svg viewBox="0 0 64 64"><rect x="4" y="16" width="56" height="40" rx="8" fill="#eab308" stroke="#92400e" stroke-width="3"/><path d="M22 16v40M42 16v40" stroke="#b45309" stroke-width="4"/><path d="M8 28h10M28 26h10M46 38h10M10 46h8" stroke="#fde68a" stroke-width="3" stroke-linecap="round"/></svg>`,
    plant: `<svg viewBox="0 0 64 64"><path d="M14 40h36l-5 20H19z" fill="#ea580c" stroke="#7c2d12" stroke-width="3" stroke-linejoin="round"/><g fill="#22c55e" stroke="#166534" stroke-width="2.5"><ellipse cx="22" cy="24" rx="10" ry="16" transform="rotate(-25 22 24)"/><ellipse cx="42" cy="24" rx="10" ry="16" transform="rotate(25 42 24)"/><ellipse cx="32" cy="18" rx="10" ry="17"/></g></svg>`,
    flag: `<svg viewBox="0 0 64 64"><path d="M14 6v54" stroke="#475569" stroke-width="5" stroke-linecap="round"/><path d="M16 8h40l-8 12 8 12H16z" fill="#fff" stroke="#1e293b" stroke-width="2.5"/><path d="M16 8h10v12H16zM36 8h10v12H36zM26 20h10v12H26zM46 20h5l5 12h-10z" fill="#1e293b"/></svg>`,
  });

  // ---------- visiting ponies ----------
  ART.VCOATS = {
    sky: { coat: '#bae6fd', coatd: '#8fcbea', muz: '#e0f2fe', mane: '#1e40af', hoof: '#475569' },
    choc: { coat: '#8b5a3c', coatd: '#6e432a', muz: '#c99b7a', mane: '#fef3c7', hoof: '#3b2416' },
    mint: { coat: '#a7f3d0', coatd: '#7fd8b0', muz: '#dcfce7', mane: '#f472b6', hoof: '#3f7d64' },
    lemon: { coat: '#fde68a', coatd: '#f2cf5a', muz: '#fef9c3', mane: '#f97316', hoof: '#92400e' },
    peach: { coat: '#fdba8c', coatd: '#f29a66', muz: '#ffe4d1', mane: '#7c2d12', hoof: '#7c2d12' },
    pebble: { coat: '#cbd5e1', coatd: '#a3afc2', muz: '#f1f5f9', mane: '#ffffff', hoof: '#475569' },
    twinkle: { coat: '#c4b5fd', coatd: '#a594f0', muz: '#ede9fe', mane: '#facc15', hoof: '#5b21b6' },
    clover: { coat: '#a16207', coatd: '#854d0e', muz: '#e4b77a', mane: '#16a34a', hoof: '#422006' },
    marsh: { coat: '#fff7fb', coatd: '#f1dbe6', muz: '#ffe4ef', mane: '#f9a8d4', hoof: '#9d6b84' },
    ginger: { coat: '#f59e0b', coatd: '#d1840a', muz: '#fde3b4', mane: '#b91c1c', hoof: '#7c2d12' },
  };
  const VISITORS = [
    { id: 'bluebell', name: 'Bluebell', coat: 'sky', prop: 'flowers', pitch: 1.35, rate: 0.95, hi: "Hello! I'm Bluebell. I love flowers!" },
    { id: 'pepper', name: 'Pepper', coat: 'choc', prop: 'glasses', pitch: 0.85, rate: 0.9, hi: "Hiya! I'm Pepper. Do you like my glasses?" },
    { id: 'minty', name: 'Minty', coat: 'mint', bow: true, pitch: 1.5, rate: 1, hi: "Hello hello! I'm Minty. Let's have fun!" },
    { id: 'buttercup', name: 'Buttercup', coat: 'lemon', prop: 'party', pitch: 1.25, rate: 1, hi: "Yippee! I'm Buttercup. It's party time!" },
    { id: 'peaches', name: 'Peaches', coat: 'peach', bow: true, pitch: 1.15, rate: 0.9, hi: "Hello there, I'm Peaches. Nice to meet you!" },
    { id: 'pebble', name: 'Pebble', coat: 'pebble', pitch: 0.95, rate: 0.85, hi: "Hello. I'm Pebble. I'm a little bit shy." },
    { id: 'twinkle', name: 'Twinkle', coat: 'twinkle', prop: 'crown', pitch: 1.4, rate: 0.95, hi: "Ta-da! I'm Twinkle. Shall we play?" },
    { id: 'clover', name: 'Clover', coat: 'clover', pitch: 0.9, rate: 0.95, hi: "Hello! I'm Clover. I'm feeling lucky today!" },
    { id: 'marshmallow', name: 'Marshmallow', coat: 'marsh', prop: 'flowers', pitch: 1.3, rate: 0.85, hi: "Hello, I'm Marshmallow. I'm soft and fluffy!" },
    { id: 'ginger', name: 'Ginger', coat: 'ginger', saddle: true, pitch: 1.05, rate: 1.05, hi: "Hi! I'm Ginger. I love to gallop!" },
  ];
  const vLook = v => ({ coat: v.coat, bow: !!v.bow, saddle: !!v.saddle, prop: v.prop || null });
  function todayVisitor() {
    const o = new URLSearchParams(location.search).get('visitor');
    if (o != null && VISITORS[+o]) return VISITORS[+o];
    const d = new Date(), n = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
    return VISITORS[n % VISITORS.length];
  }
  const vSay = (v, t) => say(t, { pitch: v.pitch, rate: v.rate });

  // ---------- helpers ----------
  function overlay(id, cls) {
    let el = document.getElementById(id);
    if (!el) { el = document.createElement('div'); el.id = id; document.body.appendChild(el); }
    el.className = 'overlay show ' + (cls || '');
    return el;
  }
  function close(el) { el.classList.remove('show'); el.onclick = null; el.onpointerdown = null; el.innerHTML = ''; }
  const homeBtn = () => `<button class="topbtn" data-x="close" aria-label="back">${ICON.home}</button>`;
  function ponyBox(el, lk) { el.innerHTML = ART.ponySVG(); ART.applyLook(el, lk); return el; }
  function restart(el, cls, ms) { if (!el) return; el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); if (ms) setTimeout(() => el.classList.remove(cls), ms); }
  function reward(n) { S().shoes += n; G().renderHUD(); G().save(); }
  const shoeRow = n => `<div class="shoeRow">${Array.from({ length: n }, () => ICON.shoe).join('')}</div>`;
  function fx(host, x, y, ico, cls) {
    const hr = host.getBoundingClientRect(), e = document.createElement('div');
    e.className = 'fx ' + (cls || 'spark'); e.style.left = (x - hr.left) + 'px'; e.style.top = (y - hr.top) + 'px';
    e.innerHTML = ICON[ico] || ico; host.appendChild(e); setTimeout(() => e.remove(), 1800);
  }
  function boxPoint(box, vx, vy, flipped) {
    const r = box.getBoundingClientRect(), fx = (vx - 40) / 370 * r.width;
    return { x: flipped ? r.right - fx : r.left + fx, y: r.top + vy / 316 * r.height };
  }
  function hearts(host, box, n, flipped) { for (let i = 0; i < n; i++) { const p = boxPoint(box, 280 + Math.random() * 80, 30 + Math.random() * 40, flipped); fx(host, p.x, p.y, 'heart', 'heart'); } }
  function flyTo(ico, from, to, ms) {
    return new Promise(res => {
      const el = document.createElement('div'); el.className = 'dragging';
      el.style.cssText += `left:${from.x}px;top:${from.y}px;transition:left ${ms}ms ease-in-out,top ${ms}ms ease-in-out,transform ${ms}ms;`;
      el.innerHTML = ICON[ico] || ico; document.body.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.left = to.x + 'px'; el.style.top = to.y + 'px'; el.style.transform = 'scale(.5)'; }));
      setTimeout(() => { el.remove(); res(); }, ms + 30);
    });
  }
  const center = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };

  // ---------- 1. Visiting friends ----------
  let knockShown = false;
  function knockCheck() {
    const P = G(); if (!P) return;
    const st = S(), today = P.todayKey();
    const busy = document.querySelector('.overlay.show') || P.mode !== 'main' || !st.setup || st.night;
    const k = document.getElementById('knock');
    if (busy || st.visitors.day === today) { if (k && (st.visitors.day === today)) k.remove(); knockShown = !!document.getElementById('knock'); return; }
    if (!k) {
      const b = document.createElement('button'); b.id = 'knock'; b.setAttribute('aria-label', 'visitor at the door');
      b.innerHTML = ICON.door; document.getElementById('stage').appendChild(b);
      b.addEventListener('pointerdown', e => e.stopPropagation()); b.addEventListener('click', e => { e.stopPropagation(); SFX.tap(); visit(); });
    }
    if (!knockShown) { knockShown = true; SFX.knock(); setTimeout(() => say('Knock knock! Someone is at the door! Tap the door.'), 1100); }
  }
  function visit() {
    const v = todayVisitor(), st = S(), today = G().todayKey();
    st.visitors.day = today; G().save();
    const k = document.getElementById('knock'); if (k) k.remove();
    const ov = overlay('visitOv');
    ov.innerHTML = `${homeBtn()}<button class="topbtn right" data-x="friends" aria-label="friends">${ICON.friends}</button>
      <div class="vScene" id="vScene"><div class="pbox vMine" id="vMine"></div><div class="pbox vGuest faceLeft" id="vGuest"></div></div>
      <div class="vName" id="vName">${v.name}</div>
      <div class="vChoices" id="vChoices"><button class="tile big" data-a="tea"><span class="ico">${ICON.teapot}</span><span class="word dark">tea</span></button>
        <button class="tile big" data-a="hide"><span class="ico">${ICON.hide}</span><span class="word dark">hide</span></button>
        <button class="tile big" data-a="race"><span class="ico">${ICON.flag}</span><span class="word dark">race</span></button></div>`;
    ponyBox($('#vMine'), G().look()); ponyBox($('#vGuest'), vLook(v));
    restart($('#vGuest'), 'walkIn', 1600);
    SFX.knock();
    const met = st.visitors.met[v.id];
    setTimeout(() => vSay(v, met ? `Hello again, ${G().nm()}! It's me, ${v.name}! What shall we play today? Tea party, hide and seek, or a race?` : `${v.hi} What shall we play? Tea party, hide and seek, or a race?`), 900);
    ov.onclick = e => {
      if (e.target.closest('[data-x="close"]')) { SFX.tap(); close(ov); return; }
      if (e.target.closest('[data-x="friends"]')) { SFX.tap(); close(ov); friends(); return; }
      const c = e.target.closest('[data-a]'); if (!c) return;
      SFX.tap(); G().speakWord(c.dataset.a);
      if (c.dataset.a === 'tea') teaParty(ov, v); else if (c.dataset.a === 'hide') hideSeek(ov, v); else race(ov, v);
    };
    const nm = $('#vGuest'); nm.addEventListener('pointerdown', () => { SFX.neigh(); hearts(ov, nm, 2, true); vSay(v, pick([`Hee hee! Hello ${G().nm()}!`, `I'm ${v.name}!`, 'That tickles!'])); });
  }
  async function teaParty(ov, v) {
    $('#vChoices').innerHTML = `<button class="tile big glow" data-t="pot"><span class="ico">${ICON.teapot}</span><span class="word dark">tea</span></button>`;
    $('#vScene').insertAdjacentHTML('beforeend', `<div class="teaTable"><span class="cupL">${ICON.cup}</span><span class="plate"></span><span class="cupR">${ICON.cup}</span></div>`);
    say('Tea party! Tap the teapot to pour the tea.');
    let step = 'pour', treats = 0;
    ov.onclick = async e => {
      if (e.target.closest('[data-x="close"]')) { SFX.tap(); close(ov); return; }
      if (step === 'pour' && e.target.closest('[data-t="pot"]')) {
        step = 'busy';
        for (const cupSel of ['.cupL', '.cupR']) {
          const cup = ov.querySelector(cupSel), c = center(cup);
          const pot = document.createElement('div'); pot.className = 'dragging potPour'; pot.innerHTML = ICON.teapot;
          pot.style.left = c.x + 40 + 'px'; pot.style.top = c.y - 70 + 'px'; document.body.appendChild(pot);
          SFX.pour(); await wait(1100); pot.remove();
          cup.querySelector('.tea').setAttribute('opacity', '1'); restart(cup, 'bump', 400);
        }
        say(`Tea for ${G().nm()} and tea for ${v.name}! Now serve some treats.`);
        $('#vChoices').innerHTML = ['cookie', 'apple', 'carrot'].map(t => `<button class="tile big glow" data-treat="${t}"><span class="ico">${ICON[t]}</span><span class="word dark">${t}</span></button>`).join('');
        step = 'treat'; return;
      }
      const t = e.target.closest('[data-treat]');
      if (step === 'treat' && t && !t.classList.contains('done')) {
        t.classList.add('done'); t.classList.remove('glow');
        const g = $('#vGuest'), to = boxPoint(g, 360, 120, true);
        G().speakWord(t.dataset.treat);
        await flyTo(t.dataset.treat, center(t), to, 700);
        SFX.crunch(); restart(g.querySelector('.pony'), 'chew', 1500); hearts(ov, g, 3, true);
        vSay(v, pick(['Yum yum! Thank you!', 'Delicious!', 'Mmm, my favourite!']));
        if (++treats === 3) { step = 'done'; await wait(1800); befriend(ov, v, 'What a lovely tea party!'); }
      }
    };
  }
  async function hideSeek(ov, v) {
    const spots = ['bale', 'barrel', 'cart', 'plant'];
    let round = 0, hiding = -1, busy = true;
    $('#vChoices').innerHTML = '';
    $('#vScene').innerHTML = `<div class="hideRoom" id="hideRoom">${spots.map((s, i) => `<button class="hideSpot" data-i="${i}"><span class="peek"></span>${ICON[s]}</button>`).join('')}</div>`;
    const peekTail = `<svg viewBox="0 0 40 60"><path d="M30 4C10 4 2 24 4 40c2 12 10 18 16 16-6-14-2-30 14-40z" fill="${ART.VCOATS[v.coat].mane}" stroke="${OL}" stroke-width="3"/></svg>`;
    async function hide() {
      busy = true;
      ov.querySelectorAll('.peek').forEach(p => { p.innerHTML = ''; });
      ov.querySelectorAll('.hideSpot .pbox').forEach(p => p.remove());
      vSay(v, round === 0 ? `Let's play hide and seek! Close your eyes and count with me. One, two, three!` : 'My turn to hide again! One, two, three!');
      await wait(round === 0 ? 4200 : 2800);
      hiding = Math.floor(Math.random() * 4);
      ov.querySelector(`.hideSpot[data-i="${hiding}"] .peek`).innerHTML = peekTail;
      say(`Ready or not! Where is ${v.name}? Tap where ${v.name} is hiding.`);
      busy = false;
    }
    ov.onclick = async e => {
      if (e.target.closest('[data-x="close"]')) { SFX.tap(); close(ov); return; }
      const s = e.target.closest('.hideSpot'); if (!s || busy) return;
      if (+s.dataset.i === hiding) {
        busy = true; SFX.giggle();
        const b = document.createElement('div'); b.className = 'pbox popOut faceLeft'; s.appendChild(ponyBox(b, vLook(v)));
        s.querySelector('.peek').innerHTML = '';
        vSay(v, pick(['You found me!', 'Boo! You found me!', 'Hee hee, you found me!']));
        await wait(2400);
        if (++round < 3) hide(); else befriend(ov, v, 'Hide and seek is so much fun!');
      } else {
        restart(s, 'shake', 450); SFX.boing(); say(pick(['Not here!', 'Hmm, not here. Try another!', 'Nope! Keep looking!']));
      }
    };
    hide();
  }
  async function race(ov, v) {
    $('#vChoices').innerHTML = `<button class="tile big glow" data-r="go"><span class="ico">${ICON.ball}</span><span class="word dark">tap</span></button>`;
    $('#vScene').innerHTML = `<div class="track"><div class="lane"><div class="pbox runner" id="rMine"></div></div><div class="lane"><div class="pbox runner" id="rGuest"></div></div><div class="finishLine">${ICON.flag}</div></div>`;
    ponyBox($('#rMine'), G().look()); ponyBox($('#rGuest'), vLook(v));
    $('#rMine').classList.add('running'); $('#rGuest').classList.add('running');
    let me = 0, them = 0, done = false;
    const place = (sel, p) => { const el = $(sel); if (!el) return; const tw = el.parentNode.clientWidth - el.offsetWidth; el.style.left = Math.max(0, tw * p / 100) + 'px'; };
    say(`A friendly race! Tap the button fast to gallop. Ready, steady, go!`);
    const tick = setInterval(() => {
      if (done) return clearInterval(tick);
      them = Math.min(100, them + 1.6 + Math.random() * 0.8);
      if (them > me + 15) them = me + 15; // the friend never runs off without you
      place('#rGuest', them);
      if (them >= 100 && me >= 100) finish();
    }, 120);
    function finish() {
      if (done) return; done = true; clearInterval(tick);
      SFX.cheer(); vSay(v, `We both crossed the finish line! What a fun race, ${G().nm()}!`);
      setTimeout(() => befriend(ov, v, 'Racing together is the best!'), 2600);
    }
    ov.onclick = e => {
      if (e.target.closest('[data-x="close"]')) { done = true; SFX.tap(); close(ov); return; }
      if (e.target.closest('[data-r="go"]') && !done) {
        me = Math.min(100, me + 9); SFX.clop(); place('#rMine', me);
        if (me >= 100) { them = Math.max(them, 96); setTimeout(() => { them = 100; place('#rGuest', 100); finish(); }, 500); }
      }
    };
  }
  function befriend(ov, v, line) {
    const st = S(), today = G().todayKey(), first = !st.visitors.met[v.id], paid = st.visitors.done === today;
    const m = st.visitors.met[v.id] || { times: 0, first: today };
    m.times++; st.visitors.met[v.id] = m; st.visitors.done = today; G().cared();
    if (!paid) reward(3); else G().save();
    ov.querySelector('#vChoices') && (ov.querySelector('#vChoices').innerHTML = '');
    ov.querySelector('#vScene').classList.add('bf'); ov.querySelector('#vScene').innerHTML = `<div class="pbox vMine" id="bMine"></div><div class="bigHeart">${ICON.heart}</div><div class="pbox vGuest faceLeft" id="bGuest"></div>`;
    ponyBox($('#bMine'), G().look()); ponyBox($('#bGuest'), vLook(v));
    $('#vChoices').innerHTML = `${paid ? '' : shoeRow(3)}<button class="go pulse" data-x="friends" aria-label="friends">${ICON.tick}</button>`;
    ov.onclick = e => {
      if (e.target.closest('[data-x="close"]')) { SFX.tap(); close(ov); return; }
      if (e.target.closest('[data-x="friends"]')) { SFX.tap(); close(ov); friends(); }
    };
    SFX.cheer();
    say(`${line} ${first ? `${v.name} is your friend now! ${v.name}'s picture is on your friends page.` : `${v.name} loves visiting you!`}${paid ? '' : ' Here are three horseshoes!'}`);
    setTimeout(() => { if (document.getElementById('bGuest')) vSay(v, 'Bye bye! See you again soon!'); }, 6500);
  }
  function friends() {
    const ov = overlay('friendsOv'), met = S().visitors.met;
    const n = Object.keys(met).length;
    ov.innerHTML = `${homeBtn()}<div class="sub">${ICON.friends}</div><div class="grid friendGrid">${VISITORS.map(v => met[v.id]
      ? `<button class="card" data-v="${v.id}"><span class="pic" id="fr-${v.id}"></span><span class="word">${v.name}</span><span class="hearts">${Array.from({ length: Math.min(5, met[v.id].times) }, () => ICON.heart).join('')}</span></button>`
      : `<button class="card unmet" data-u="1"><span class="pic" id="fr-${v.id}"></span><span class="word">?</span></button>`).join('')}</div>`;
    VISITORS.forEach(v => ponyBox(document.getElementById('fr-' + v.id), vLook(v)));
    say(n ? `You have ${n} pony ${n === 1 ? 'friend' : 'friends'}! A new friend visits every day.` : 'No friends yet. A pony friend comes to visit every day. Listen for the knock!');
    ov.onclick = e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      const c = e.target.closest('[data-v]');
      if (c) { const v = VISITORS.find(x => x.id === c.dataset.v); SFX.neigh(); restart(c, 'happy', 800); vSay(v, `Hello! I'm ${v.name}!`); return; }
      if (e.target.closest('[data-u]')) { SFX.tap(); say('A new friend might visit tomorrow!'); }
    };
  }

  // ---------- 2a. Counting ----------
  function dots(n) {
    let s = '<svg viewBox="0 0 110 48">';
    for (let i = 0; i < n; i++) s += `<circle cx="${12 + (i % 5) * 21.5}" cy="${i < 5 ? 13 : 35}" r="8.5" fill="#f472b6" stroke="#9d174d" stroke-width="2"/>`;
    return s + '</svg>';
  }
  const numCard = (n, extra) => `<button class="card numCard ${extra || ''}" data-n="${n}"><span class="digit">${n}</span><span class="dots">${dots(n)}</span><span class="word">${NUM[n]}</span></button>`;
  function counting() {
    const ov = overlay('countOv'), g = S().games;
    const lvl = Math.min(3, Math.floor((g.count || 0) / 2)), max = [3, 5, 7, 10][lvl];
    const qs = Array.from({ length: 5 }, (_, i) => ({ type: lvl > 0 && i % 2 === 1 ? 'pick' : 'fill', n: 1 + Math.floor(Math.random() * max) }));
    let q = 0, count = 0, busy = false;
    ov.innerHTML = `${homeBtn()}<div class="wStars">${qs.map(() => `<span class="empty">${ICON.star}</span>`).join('')}</div><div class="countArea" id="countArea"></div>`;
    const area = $('#countArea');
    function ask() {
      const Q = qs[q]; count = 0; busy = false;
      if (Q.type === 'fill') {
        area.innerHTML = `<div class="bigNum" id="bigNum">${numCard(Q.n, 'target')}</div>
          <div class="cRow"><div class="pile">${Array.from({ length: 10 }, (_, i) => `<button class="pc" data-i="${i}">${ICON.carrot}</button>`).join('')}</div>
          <div class="cBucket" id="cBucket"><svg viewBox="0 0 80 70"><path d="M8 18h64l-8 48H16z" fill="#60a5fa" stroke="#1e3a8a" stroke-width="4" stroke-linejoin="round"/><ellipse cx="40" cy="18" rx="32" ry="7" fill="#1e3a8a"/><path d="M10 18C10 -4 70 -4 70 18" fill="none" stroke="#475569" stroke-width="3"/></svg><span class="cCount" id="cCount">0</span></div></div>`;
        say(`Put ${Q.n} ${Q.n === 1 ? 'carrot' : 'carrots'} in the bucket!`);
      } else {
        const opts = shuffle([Q.n].concat(shuffle(Array.from({ length: max }, (_, i) => i + 1).filter(x => x !== Q.n)).slice(0, 2)));
        area.innerHTML = `<div class="appleRow" id="appleRow">${Array.from({ length: Q.n }, () => `<span>${ICON.apple}</span>`).join('')}</div><div class="numChoices">${opts.map(n => numCard(n, 'opt')).join('')}</div>`;
        say('How many apples? Tap the number.');
      }
    }
    async function correct(n) {
      busy = true; SFX.ding(); ov.querySelectorAll('.wStars span')[q].classList.remove('empty');
      say(`${pick(['Yes!', 'Well done!', 'Brilliant counting!', 'Hooray!'])} ${NUM[n]}!`);
      await wait(1900);
      if (++q < qs.length) ask(); else done();
    }
    async function countAlong() {
      busy = true; const els = ov.querySelectorAll('#appleRow span');
      for (let i = 0; i < els.length; i++) { restart(els[i], 'bump', 400); say(NUM[i + 1], { rate: 1 }); await wait(650); }
      say('Which number is that?'); busy = false;
    }
    function done() {
      g.count = (g.count || 0) + 1; reward(2); SFX.cheer();
      area.innerHTML = `<div class="finishCard">${shoeRow(2)}<button class="go pulse" data-x="close">${ICON.tick}</button></div>`;
      say(`Super counting! Here are two horseshoes!${Math.min(3, Math.floor(g.count / 2)) > lvl ? ' Next time we will count even higher!' : ''}`);
    }
    ov.onclick = async e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      if (busy) return;
      const Q = qs[q];
      const pc = e.target.closest('.pc');
      if (pc && Q.type === 'fill' && !pc.classList.contains('used')) {
        pc.classList.add('used'); count++;
        const n = count;
        flyTo('carrot', center(pc), center($('#cBucket')), 450).then(() => { $('#cCount').textContent = n; restart($('#cBucket'), 'bump', 400); });
        SFX.pop(); say(NUM[n], { rate: 1.05 });
        if (n === Q.n) { busy = true; setTimeout(() => correct(n), 800); }
        return;
      }
      if (e.target.closest('.target')) { SFX.tap(); say(`${NUM[Q.n]}. Put ${Q.n} in the bucket!`); return; }
      const c = e.target.closest('.opt');
      if (c && Q.type === 'pick') {
        if (+c.dataset.n === Q.n) { c.classList.add('right'); correct(Q.n); }
        else { restart(c, 'shake', 450); SFX.boing(); say(`That's ${NUM[c.dataset.n]}. Let's count together!`); await wait(1700); countAlong(); }
      }
    };
    ask();
  }

  // ---------- 2b. Colours ----------
  const COLS = [['red', '#ef4444'], ['blue', '#3b82f6'], ['yellow', '#facc15'], ['green', '#22c55e'], ['pink', '#f472b6'], ['purple', '#a855f7'], ['orange', '#f97316']];
  const THINGS = [['ribbon', ribbon], ['apple', appleC], ['flower', flowerC]];
  function colours() {
    const ov = overlay('colourOv'), g = S().games;
    const lvl = Math.min(2, Math.floor((g.colour || 0) / 2)), nb = [2, 3, 4][lvl];
    const baskets = shuffle(COLS).slice(0, nb);
    const items = Array.from({ length: 6 }, (_, i) => ({ col: baskets[i % nb], thing: pick(THINGS) }));
    const order = shuffle(items);
    let q = 0, busy = false;
    ov.innerHTML = `${homeBtn()}<div class="wStars">${order.map(() => `<span class="empty">${ICON.star}</span>`).join('')}</div>
      <button class="colItem" id="colItem"></button><div class="colWord" id="colWord"></div>
      <div class="baskets">${baskets.map(([w, c]) => `<button class="basketBtn" data-c="${w}"><span class="bsvg">${basketC(c)}</span><span class="word">${w}</span></button>`).join('')}</div>`;
    function ask() {
      const it = order[q]; busy = false;
      $('#colItem').innerHTML = it.thing[1](it.col[1]); restart($('#colItem'), 'popin2', 500);
      $('#colWord').textContent = it.col[0];
      say(`A ${it.col[0]} ${it.thing[0]}! Which basket?`);
    }
    ov.onclick = async e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      if (busy) return;
      const it = order[q];
      if (e.target.closest('#colItem')) { SFX.tap(); say(`${it.col[0]}. A ${it.col[0]} ${it.thing[0]}.`); return; }
      const b = e.target.closest('.basketBtn'); if (!b) return;
      if (b.dataset.c === it.col[0]) {
        busy = true; SFX.ding();
        const html = $('#colItem').innerHTML; $('#colItem').innerHTML = '';
        await flyTo(html, center($('#colItem')), center(b), 550);
        restart(b, 'bump', 400); ov.querySelectorAll('.wStars span')[q].classList.remove('empty');
        say(`${pick(['Yes!', 'Well done!', 'Brilliant!'])} ${it.col[0]}!`);
        await wait(1500);
        if (++q < order.length) ask(); else {
          g.colour = (g.colour || 0) + 1; reward(2); SFX.cheer();
          $('#colWord').textContent = '';
          $('#colItem').outerHTML = `<div class="finishCard">${shoeRow(2)}<button class="go pulse" data-x="close">${ICON.tick}</button></div>`;
          say(`All sorted! You know your colours! Here are two horseshoes!`);
        }
      } else {
        restart(b, 'shake', 450); SFX.boing(); say(`That's the ${b.dataset.c} basket. Find ${it.col[0]}!`);
      }
    };
    ask();
  }

  // ---------- 3. Vet check-up ----------
  const STEPS = [
    { tool: 'stetho', word: 'heart', at: [255, 185], intro: "First, let's listen to the heart with the stethoscope.", act: 'heart', done: 'Ba-dum, ba-dum! A strong, happy heart!' },
    { tool: 'torch', word: 'ears', at: [322, 34], intro: 'Now shine the torch in the ears.', act: 'torch', done: 'Lovely clean ears!' },
    { tool: 'tooth', word: 'teeth', at: [362, 124], intro: 'Say aah! Time to check the teeth.', act: 'teeth', done: 'Sparkly white teeth!' },
    { tool: 'stetho', word: 'tummy', at: [205, 225], intro: 'Listen to the tummy.', act: 'gurgle', done: 'Gurgle gurgle! A happy tummy.' },
    { tool: 'pebble', word: 'hoof', at: [267, 290], intro: 'Check the hooves.', act: 'hoof', done: 'Strong, healthy hooves!' },
    { tool: 'thermo', word: 'warm', at: [300, 110], intro: 'Take the temperature with the thermometer.', act: 'thermo', done: 'Beep beep! Just right. Not too hot, not too cold.' },
    { tool: 'scales', word: 'weigh', at: [205, 305], intro: 'Hop on the scales!', act: 'scales', done: 'Perfect! Growing big and strong.' },
    { tool: 'plaster', word: 'plaster', at: [267, 245], intro: 'Oh, a tiny pretend bump on the knee. Let\'s put a plaster on it.', act: 'plaster', done: 'All better!' },
  ];
  function vet() {
    const ov = overlay('vetOv'), st = S(), today = G().todayKey();
    let i = 0, armed = false, busy = false;
    ov.innerHTML = `${homeBtn()}<div class="vetSign">${ICON.heart}</div>
      <div class="vetStage"><div class="pbox vetPony" id="vetPony"></div><div class="vetScale" id="vetScale"><svg viewBox="0 0 200 40"><rect x="4" y="8" width="192" height="28" rx="12" fill="#e2e8f0" stroke="#475569" stroke-width="4"/><circle cx="100" cy="22" r="11" fill="#fff" stroke="#475569" stroke-width="3"/><path class="needle" d="M100 22l7-6" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/></svg></div></div>
      <div class="vetTools" id="vetTools">${STEPS.map((s, k) => `<button class="tile small" data-k="${k}"><span class="ico">${ICON[s.tool]}</span><span class="word dark">${s.word}</span></button>`).join('')}</div>`;
    const vp = $('#vetPony'); ponyBox(vp, G().look());
    const stage = ov.querySelector('.vetStage');
    function mark() { ov.querySelectorAll('#vetTools .tile').forEach((t, k) => { t.classList.toggle('glow', k === i); t.classList.toggle('done', k < i); }); }
    mark();
    say(`Welcome to the vet! ${G().nm()} is feeling great, so this is just a check-up. ${STEPS[0].intro} Tap the stethoscope.`);
    function showTarget() {
      const s = STEPS[i], p = boxPoint(vp, s.at[0], s.at[1]), sr = stage.getBoundingClientRect();
      const t = document.createElement('button'); t.className = 'vetTarget'; t.innerHTML = ICON[s.tool];
      t.style.left = (p.x - sr.left) + 'px'; t.style.top = (p.y - sr.top) + 'px'; stage.appendChild(t);
      if (s.act === 'scales') { $('#vetScale').classList.add('on'); }
    }
    async function doAct(s, t) {
      busy = true; t.remove();
      const p = boxPoint(vp, s.at[0], s.at[1]);
      if (s.act === 'heart') { SFX.heart(); for (let k = 0; k < 4; k++) setTimeout(() => fx(ov, p.x, p.y - 30, 'heart', 'heart'), k * 800); }
      if (s.act === 'torch') { const g = document.createElement('div'); g.className = 'torchGlow'; const sr = stage.getBoundingClientRect(); g.style.left = (p.x - sr.left) + 'px'; g.style.top = (p.y - sr.top) + 'px'; stage.appendChild(g); setTimeout(() => g.remove(), 2600); SFX.click(); }
      if (s.act === 'teeth') { const tt = document.createElement('div'); tt.className = 'teeth'; const sr = stage.getBoundingClientRect(); tt.style.left = (p.x - sr.left) + 'px'; tt.style.top = (p.y - sr.top) + 'px'; stage.appendChild(tt); setTimeout(() => tt.remove(), 2600); SFX.sparkle(); }
      if (s.act === 'gurgle') SFX.gurgle();
      if (s.act === 'hoof') { SFX.clop(); for (let k = 0; k < 4; k++) fx(ov, p.x + (Math.random() - 0.5) * 60, p.y - Math.random() * 30, 'sparkle'); }
      if (s.act === 'thermo') { const th = document.createElement('div'); th.className = 'thermoBig'; th.innerHTML = `<div class="tube"><div class="fill"></div></div><div class="ok">${ICON.tick}</div>`; stage.appendChild(th); setTimeout(() => th.classList.add('go'), 50); setTimeout(SFX.beep, 1300); setTimeout(() => th.remove(), 3200); }
      if (s.act === 'scales') { restart(vp, 't-hop', 1000); setTimeout(() => $('#vetScale').classList.add('weigh'), 700); SFX.jump(); }
      if (s.act === 'plaster') { const pl = document.createElement('div'); pl.className = 'plasterOn'; pl.innerHTML = ICON.plaster; const sr = stage.getBoundingClientRect(); pl.style.left = (p.x - sr.left) + 'px'; pl.style.top = (p.y - sr.top) + 'px'; stage.appendChild(pl); SFX.pop(); }
      say(s.done);
      await wait(s.act === 'heart' ? 3400 : 2600);
      if (s.act === 'scales') $('#vetScale').classList.remove('on', 'weigh');
      i++; armed = false; busy = false; mark();
      if (i < STEPS.length) say(`${STEPS[i].intro} Tap the ${STEPS[i].word === 'warm' ? 'thermometer' : STEPS[i].word} picture.`);
      else finish();
    }
    function finish() {
      const first = st.vet.day !== today;
      st.vet.day = today; st.vet.count = (st.vet.count || 0) + 1; G().cared();
      if (first) reward(2); else G().save();
      $('#vetTools').innerHTML = `<div class="vetEnd"><button class="tile big glow" data-end="sticker"><span class="ico">${ICON.sticker}</span><span class="word dark">sticker</span></button><button class="tile big glow" data-end="treat"><span class="ico">${ICON.apple}</span><span class="word dark">treat</span></button></div>`;
      SFX.cheer(); restart(vp, 'happy', 1000);
      say(`All done! ${G().nm()} is healthy and happy. What a brave pony! Pick a sticker or a treat.`);
    }
    ov.onclick = async e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      if (busy) return;
      const end = e.target.closest('[data-end]');
      if (end) {
        busy = true; G().speakWord(end.dataset.end);
        if (end.dataset.end === 'sticker') { await flyTo('sticker', center(end), boxPoint(vp, 230, 160), 700); const b = document.createElement('div'); b.className = 'vetBadge'; b.innerHTML = ICON.sticker; const sr = stage.getBoundingClientRect(), p = boxPoint(vp, 230, 160); b.style.left = (p.x - sr.left) + 'px'; b.style.top = (p.y - sr.top) + 'px'; stage.appendChild(b); }
        else { await flyTo('apple', center(end), boxPoint(vp, 360, 120), 700); SFX.crunch(); restart(vp.querySelector('.pony'), 'chew', 1500); }
        hearts(ov, vp, 4);
        $('#vetTools').innerHTML = `<div class="finishCard">${st.vet.day === today && st.vet.count >= 1 ? `<div class="badgeRow">${ICON.sticker}<b>${st.vet.count}</b></div>` : ''}<button class="go pulse" data-x="close">${ICON.tick}</button></div>`;
        say(end.dataset.end === 'sticker' ? `A check-up sticker! ${G().nm()} has had ${st.vet.count} check ${st.vet.count === 1 ? 'up' : 'ups'}.` : 'Crunch! A yummy treat for being so good!');
        return;
      }
      const t = e.target.closest('.vetTarget');
      if (t && armed) { doAct(STEPS[i], t); return; }
      const tool = e.target.closest('#vetTools .tile');
      if (tool && i < STEPS.length) {
        const k = +tool.dataset.k;
        if (k === i) { if (!armed) { armed = true; SFX.tap(); G().speakWord(STEPS[i].word, 'Now tap the circle on ' + G().nm() + '.'); showTarget(); } }
        else if (k > i) { restart(tool, 'shake', 450); SFX.boing(); say(`Not yet! First, the ${STEPS[i].word === 'warm' ? 'thermometer' : STEPS[i].word}.`); }
      }
    };
  }

  window.MORE3 = { init() { setInterval(knockCheck, 2500); setTimeout(knockCheck, 1500); }, visit, friends, counting, colours, vet, VISITORS };
})();
