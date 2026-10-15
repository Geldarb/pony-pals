/* Pony Pals: My Little Stable. Game logic. Everything is saved on this device only. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const ICON = ART.ICON, SFX = SND.SFX, say = SND.say;
  const stage = $('#stage');
  document.body.insertAdjacentHTML('afterbegin', ART.DEFS);
  function fillIcons(root) { (root || document).querySelectorAll('[data-ico]').forEach(el => { if (!el.innerHTML.trim()) el.innerHTML = ICON[el.dataset.ico] || ''; }); }
  fillIcons();

  // ---------- Save data ----------
  const KEY = 'ponyPals.v1';
  const DEF = () => ({
    setup: false, coat: 'brown', name: '', needs: { hunger: 55, clean: 40, fun: 65 }, last: Date.now(), shoes: 3,
    owned: [], equip: { mane: null, bow: false, saddle: false, bunting: false, flowers: false, lights: false },
    days: 0, cared: false, friends: { foal: false, bunny: false }, settings: { sound: true, voice: true, timer: 0 },
    timerEnd: 0, night: false, blanket: false,
    // added in v2
    v: 2, bag: { apple: 5, berry: 0, flower: 0 }, rosettes: [], showDay: '', foalCare: { days: 0, lastDay: '', fedDay: '', cuddleDay: '' },
    tricks: {}, words: { rounds: 0 }, wear: null, prop: null, backdrop: 'stars',
  });
  let S = DEF();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && typeof raw === 'object') {
      const d = DEF();
      S = Object.assign(d, raw);
      ['needs', 'equip', 'friends', 'settings', 'bag', 'foalCare', 'tricks', 'words'].forEach(k => {
        S[k] = Object.assign(DEF()[k], raw[k] && typeof raw[k] === 'object' ? raw[k] : {});
      });
      if (!Array.isArray(S.rosettes)) S.rosettes = [];
      for (const k in S.needs) if (typeof S.needs[k] !== 'number' || isNaN(S.needs[k])) S.needs[k] = 60;
      if (typeof S.shoes !== 'number' || isNaN(S.shoes)) S.shoes = 3;
      if (!Array.isArray(S.owned)) S.owned = [];
      S.v = 2; // v1 saves simply gain the new fields above
    }
  } catch (e) { S = DEF(); }
  let noSave = false;
  function save() { if (noSave) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  SND.sound = S.settings.sound; SND.voice = S.settings.voice;
  const nm = () => S.name || 'your pony';
  const todayKey = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

  // ---------- Seasons & weather (from the real date) ----------
  const Q = new URLSearchParams(location.search);
  function seasonNow() {
    const o = Q.get('season'); if (['spring', 'summer', 'autumn', 'winter'].includes(o)) return o;
    const m = new Date().getMonth();
    return m <= 1 || m === 11 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : 'autumn';
  }
  function weatherNow() {
    const o = Q.get('weather'); if (['sun', 'rain', 'snow'].includes(o)) return o;
    const d = new Date(), seed = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
    let x = Math.sin(seed * 12.9898) * 43758.5453; x -= Math.floor(x);
    const se = seasonNow();
    if (se === 'winter') return x < 0.45 ? 'snow' : x < 0.65 ? 'rain' : 'sun';
    if (se === 'summer') return x < 0.2 ? 'rain' : 'sun';
    return x < 0.38 ? 'rain' : 'sun';
  }

  // ---------- Needs ----------
  const HOUR = 3600e3;
  const RATE = { hunger: 100 / (6 * HOUR), clean: 100 / (10 * HOUR), fun: 100 / (5 * HOUR) };
  const FLOOR = 8;
  function decay() {
    const t = Date.now();
    let dt = Math.max(0, t - (S.last || t));
    if (S.night) dt *= 0.3;
    for (const k in RATE) S.needs[k] = Math.max(FLOOR, Math.min(100, S.needs[k] - RATE[k] * dt));
    S.last = t;
  }
  function needColor(v) { return v > 60 ? '#22c55e' : v > 33 ? '#f59e0b' : '#fb7185'; }
  function renderHUD() {
    $$('.need').forEach(b => {
      const v = S.needs[b.dataset.need];
      b.style.setProperty('--v', Math.round(v));
      b.style.setProperty('--c', needColor(v));
      b.classList.toggle('low', v < 35);
    });
    $('#shoeCount').textContent = S.shoes;
  }

  // ---------- Pony ----------
  const ponyWrap = $('#ponyWrap');
  ponyWrap.innerHTML = ART.ponySVG();
  const pony = ponyWrap.querySelector('.pony');
  let mode = 'main', asleep = false;
  const look = () => ({ coat: S.coat, mane: S.equip.mane, bow: S.equip.bow, saddle: S.equip.saddle, blanket: S.blanket, prop: S.prop });
  function mudCount() { const c = S.needs.clean; return c >= 75 ? 0 : Math.min(10, Math.round((75 - c) / 7) + 1); }
  function updateCues() {
    if (mode === 'groom') return;
    pony.classList.toggle('hungry', S.needs.hunger < 35 && !asleep);
    pony.classList.toggle('bored', S.needs.fun < 35 && !asleep);
    pony.classList.toggle('asleep', asleep);
    const n = mudCount();
    pony.querySelectorAll('.spot').forEach((s, i) => { s.style.opacity = i < n ? 0.85 : 0; });
  }
  function renderPony() { ART.applyLook(ponyWrap, look()); updateCues(); }
  function renderStable() {
    stage.classList.toggle('d-bunting', !!S.equip.bunting);
    stage.classList.toggle('d-flowers', !!S.equip.flowers);
    stage.classList.toggle('d-lights', !!S.equip.lights);
    ['spring', 'summer', 'autumn', 'winter'].forEach(x => stage.classList.toggle('s-' + x, seasonNow() === x));
    ['sun', 'rain', 'snow'].forEach(x => stage.classList.toggle('w-' + x, weatherNow() === x));
    const R = ['#3b82f6', '#ef4444', '#facc15', '#22c55e', '#a855f7', '#f472b6'];
    $('#rosettes').innerHTML = S.rosettes.slice(-8).map(r => `<span>${ART.rosette(R[r.c % R.length])}</span>`).join('');
    const nf = Math.min(10, S.bag.flower || 0);
    $('#floorFlowers').innerHTML = Array.from({ length: nf }, (_, i) => `<span style="left:${4 + ((i * 37) % 92)}%;--d:${(i % 3) * 0.4}s">${ICON.flower}</span>`).join('');
    renderFriends();
  }
  function friendLook() { return { coat: S.coat === 'golden' ? 'white' : 'golden', mane: null }; }
  function renderFriends() {
    const f = $('#foal');
    if (S.friends.foal && !f.innerHTML) { f.innerHTML = ART.ponySVG(); ART.applyLook(f, friendLook()); }
    f.classList.toggle('show', !!S.friends.foal);
    const b = $('#bunny');
    if (S.friends.bunny && !b.innerHTML) b.innerHTML = ICON.bunny;
    b.classList.toggle('show', !!S.friends.bunny);
  }
  const VB = { x: 40, y: 0, w: 370, h: 316 };
  function ponyPoint(vx, vy) {
    const r = ponyWrap.getBoundingClientRect();
    return { x: r.left + (vx - VB.x) / VB.w * r.width, y: r.top + (vy - VB.y) / VB.h * r.height };
  }
  function layout() {
    const sr = stage.getBoundingClientRect(), W = sr.width, H = sr.height;
    const ratio = VB.h / VB.w;
    const portrait = H > W * 1.1;
    const w = Math.max(120, Math.min(W * (portrait ? 0.95 : 0.76), (H * 0.72) / ratio, 640)), h = w * ratio;
    const bottom = H * (portrait ? 0.09 : 0.05), left = (W - w) / 2, top = H - h - bottom;
    Object.assign(ponyWrap.style, { width: w + 'px', height: h + 'px', left: left + 'px', top: top + 'px' });
    const bw = Math.max(54, w * 0.19), b = $('#bucket');
    Object.assign(b.style, { width: bw + 'px', left: Math.min(W - bw - 4, left + w * 0.9) + 'px', top: (H - bottom * 0.6 - bw * 0.875) + 'px' });
    const fw = w * (0.36 + 0.045 * Math.min(7, S.foalCare.days || 0)), f = $('#foal');
    Object.assign(f.style, { width: fw + 'px', height: fw * ratio + 'px', left: Math.max(4, left - fw * 0.35) + 'px', top: (H - bottom * 0.3 - fw * ratio) + 'px', zIndex: 5 });
    const bnw = Math.max(48, w * 0.17), bn = $('#bunny');
    Object.assign(bn.style, { width: bnw + 'px', height: bnw + 'px', left: (left + w * 0.5) + 'px', top: (H - bnw - 4) + 'px', zIndex: 5 });
  }

  // ---------- Effects ----------
  const fxLayer = $('#fx');
  function fxAt(kind, x, y, ico, delay) {
    const sr = stage.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'fx ' + kind;
    el.style.left = (x - sr.left) + 'px'; el.style.top = (y - sr.top) + 'px';
    if (delay) el.style.animationDelay = delay + 's';
    el.innerHTML = ICON[ico] || '';
    fxLayer.appendChild(el);
    setTimeout(() => el.remove(), 2600 + (delay || 0) * 1000);
    return el;
  }
  function hearts(n) {
    const p = ponyPoint(330, 40);
    for (let i = 0; i < n; i++) fxAt('heart', p.x + (Math.random() - 0.5) * 90, p.y + Math.random() * 30, 'heart', i * 0.15);
  }
  function sparkles(n) {
    const r = ponyWrap.getBoundingClientRect();
    for (let i = 0; i < n; i++) fxAt('spark', r.left + r.width * (0.15 + Math.random() * 0.75), r.top + r.height * (0.1 + Math.random() * 0.7), 'sparkle', Math.random() * 0.6);
  }
  function flyer(ico, from, to, ms, done) {
    const el = document.createElement('div');
    el.className = 'dragging';
    el.style.cssText = `left:${from.x}px;top:${from.y}px;width:60px;height:60px;margin:-30px 0 0 -30px;transition:transform ${ms}ms cubic-bezier(.4,-0.3,.6,1),opacity ${ms}ms`;
    el.innerHTML = ICON[ico];
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = `translate(${to.x - from.x}px,${to.y - from.y}px) scale(.6)`; }));
    setTimeout(() => { el.remove(); done && done(); }, ms);
  }
  function earn(n, from) {
    const chip = $('#shoes').getBoundingClientRect();
    const to = { x: chip.left + 28, y: chip.top + chip.height / 2 };
    from = from || ponyPoint(220, 120);
    for (let i = 0; i < n; i++) {
      setTimeout(() => flyer('shoe', { x: from.x + i * 14, y: from.y }, to, 750, () => {
        S.shoes += 1; renderHUD(); save(); SFX.ding();
        const c = $('#shoes'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
      }), i * 220);
    }
  }
  let toastT = 0;
  function speakWord(w, follow) {
    const t = $('#toastWord');
    t.textContent = w; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1500);
    say(follow ? w + '. ' + follow : w);
  }
  function cared() { S.cared = true; }
  function restart(el, cls, ms) { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); if (ms) setTimeout(() => el.classList.remove(cls), ms); }

  // ---------- Bottom bar ----------
  const bar = $('#bar');
  function tile(ico, word, act, extra, data) {
    return `<button class="tile ${extra || ''}" data-act="${act}" data-word="${word}" ${data || ''}><span class="ico">${ICON[ico]}</span><span class="word">${word}</span></button>`;
  }
  function renderBar() {
    let h = '';
    if (mode === 'main') h = tile('apple', 'food', 'feed') + tile('brush', 'brush', 'groom') + tile('ball', 'play', 'play') + tile('bed', 'bed', 'bed') + tile('map', 'more', 'more', 'glowmore');
    else if (mode === 'feed') {
      const foods = ['apple', 'carrot', 'hay'].concat(S.bag.berry > 0 ? ['berry'] : []);
      h = tile('home', 'back', 'back', 'small') + foods.map(f => {
        const n = f === 'apple' || f === 'berry' ? S.bag[f] : -1;
        return tile(f, f, 'food', 'food' + (n === 0 ? ' empty' : ''), `data-food="${f}"`).replace('</button>', n >= 0 ? `<span class="badge">${n}</span></button>` : '</button>');
      }).join('');
    }
    else if (mode === 'groom') h = tile('home', 'back', 'back', 'small') + tile('brush', 'brush', 'brushword', 'on') + tile('pebble', 'hoof', 'hoofword', groom && groom.step === 'hooves' ? 'on' : 'done');
    else if (mode === 'bed') {
      if (asleep) h = tile('sun', 'morning', 'morning', 'big glow');
      else h = tile('home', 'back', 'back', 'small') + tile('blanket', 'blanket', 'blanket', S.blanket ? 'done' : 'glow') + tile('lantern', 'lantern', 'lantern', S.blanket ? 'glow' : '');
    }
    bar.innerHTML = h;
  }
  function setMode(m) {
    mode = m;
    $('#brushCursor').classList.remove('on');
    $$('.hoofTarget').forEach(e => e.remove());
    if (m !== 'bed') { stage.classList.remove('night', 'dark'); }
    renderBar(); updateCues();
  }
  bar.addEventListener('click', e => {
    const b = e.target.closest('.tile'); if (!b || b.classList.contains('food')) return;
    SFX.tap();
    act(b.dataset.act, b.dataset.word, b);
  });
  bar.addEventListener('pointerdown', e => {
    const b = e.target.closest('.tile.food'); if (b) foodDown(e, b);
  });

  function act(a, word, el) {
    switch (a) {
      case 'feed': setMode('feed'); speakWord('food', `Drag some food to ${nm()}!`); break;
      case 'groom': startGroom(); break;
      case 'play': speakWord('play', 'Pick a ride!'); MORE.ridePicker(); break;
      case 'more': speakWord('more'); MORE.open(); break;
      case 'bed': startBed(); break;
      case 'shop': speakWord('shop'); openShop(); break;
      case 'back':
        if (mode === 'bed') { S.blanket = false; renderPony(); }
        setMode('main'); speakWord('back'); break;
      case 'brushword': speakWord('brush', 'Rub the mud away!'); break;
      case 'hoofword': speakWord('hoof', groom && groom.step === 'hooves' ? 'Tap each hoof!' : 'Brush first, then the hooves.'); break;
      case 'blanket': putBlanket(); break;
      case 'lantern': lanternOff(); break;
      case 'morning': morning(); break;
    }
  }

  // ---------- Feeding ----------
  function overPony(x, y) {
    const pad = 24;
    for (const el of [ponyWrap, $('#bucket')]) {
      const r = el.getBoundingClientRect();
      if (x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad) return true;
    }
    return false;
  }
  function foodDown(e, btn) {
    e.preventDefault();
    const food = btn.dataset.food, x0 = e.clientX, y0 = e.clientY;
    let drag = null;
    try { btn.setPointerCapture(e.pointerId); } catch (_) {}
    btn.classList.add('pressed');
    const move = ev => {
      if (btn.classList.contains('empty')) return;
      if (!drag && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 12) {
        drag = document.createElement('div'); drag.className = 'dragging'; drag.innerHTML = ICON[food];
        document.body.appendChild(drag); SFX.pop();
      }
      if (drag) { drag.style.left = ev.clientX + 'px'; drag.style.top = ev.clientY + 'px'; }
    };
    const up = ev => {
      btn.removeEventListener('pointermove', move); btn.removeEventListener('pointerup', up); btn.removeEventListener('pointercancel', up);
      btn.classList.remove('pressed');
      if (!drag) {
        SFX.tap();
        if (btn.classList.contains('empty')) { speakWord(food, `No ${food}s left. Let's pick some in the meadow!`); restart(btn, 'shake', 450); return; }
        speakWord(food); dragHint(food, btn); return;
      }
      if (ev.type === 'pointerup' && overPony(ev.clientX, ev.clientY)) { drag.remove(); feed(food); }
      else {
        const r = btn.getBoundingClientRect();
        drag.style.transition = 'left .3s, top .3s, opacity .3s';
        drag.style.left = r.left + r.width / 2 + 'px'; drag.style.top = r.top + r.height / 2 + 'px'; drag.style.opacity = 0;
        const d = drag; setTimeout(() => d.remove(), 330);
      }
    };
    btn.addEventListener('pointermove', move); btn.addEventListener('pointerup', up); btn.addEventListener('pointercancel', up);
  }
  function dragHint(food, btn) {
    const r = btn.getBoundingClientRect(), to = ponyPoint(360, 120);
    const el = document.createElement('div');
    el.className = 'dragging'; el.style.opacity = '.7'; el.innerHTML = ICON[food];
    el.style.left = r.left + r.width / 2 + 'px'; el.style.top = r.top + r.height / 2 + 'px';
    el.style.transition = 'left 1.1s ease-in-out, top 1.1s ease-in-out, opacity .3s';
    document.body.appendChild(el);
    setTimeout(() => { el.style.left = to.x + 'px'; el.style.top = to.y + 'px'; }, 450);
    setTimeout(() => { el.style.opacity = 0; }, 1600);
    setTimeout(() => el.remove(), 1950);
  }
  const FOOD_LINES = { apple: 'Crunch crunch! Yummy apple!', carrot: 'Munch munch! I love carrots!', hay: 'Mmm, tasty hay!', berry: 'Sweet berries! My favourite!' };
  function feed(food) {
    const m = ponyPoint(362, 122);
    const el = fxAt('fly', m.x, m.y, food); el.style.transform = 'scale(1)';
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = 'scale(.1)'; el.style.opacity = 0; }));
    restart(pony, 'chew', 1900); SFX.crunch();
    if (S.needs.hunger >= 97) { say(`${nm()} is full! Thank you!`); hearts(3); return; }
    if (food === 'apple' || food === 'berry') { S.bag[food] = Math.max(0, S.bag[food] - 1); setTimeout(renderBar, 50); }
    if (food === 'berry') hearts(4);
    S.needs.hunger = Math.min(100, S.needs.hunger + (food === 'hay' ? 28 : food === 'berry' ? 18 : 22));
    cared(); earn(1, m); hearts(2);
    say(S.needs.hunger >= 97 ? `${FOOD_LINES[food]} ${nm()} is full and happy!` : FOOD_LINES[food]);
    renderHUD(); updateCues(); save();
  }

  // ---------- Grooming ----------
  let groom = null, scrubbing = false, lastPt = null, lastScrub = 0;
  function startGroom() {
    setMode('groom');
    let n = mudCount();
    const dusty = n < 3; if (dusty) n = 3;
    const spots = Array.from(pony.querySelectorAll('.spot'));
    const max = dusty ? 0.45 : 0.85;
    groom = { step: 'brush', spots: spots.slice(0, n).map(el => ({ el, dirt: 1, max })) };
    spots.forEach((s, i) => { s.style.opacity = i < n ? max : 0; });
    renderBar();
    const bc = $('#brushCursor'), sr = stage.getBoundingClientRect(), p = ponyPoint(330, 200);
    bc.style.left = (p.x - sr.left) + 'px'; bc.style.top = (p.y - sr.top) + 'px'; bc.classList.add('on');
    speakWord('brush', dusty ? `Let's brush ${nm()} until everything sparkles!` : `${nm()} is muddy! Rub the mud away.`);
  }
  function moveBrush(e) {
    const sr = stage.getBoundingClientRect(), bc = $('#brushCursor');
    bc.style.left = (e.clientX - sr.left) + 'px'; bc.style.top = (e.clientY - sr.top) + 'px';
    const d = lastPt ? Math.hypot(e.clientX - lastPt.x, e.clientY - lastPt.y) : 0;
    lastPt = { x: e.clientX, y: e.clientY };
    if (d < 1) return;
    const now = performance.now();
    if (now - lastScrub > 110) { SFX.scrub(); lastScrub = now; }
    let any = false;
    groom.spots.forEach(sp => {
      if (sp.dirt <= 0) return;
      any = true;
      const r = sp.el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (Math.hypot(e.clientX - cx, e.clientY - cy) < Math.max(r.width, r.height) / 2 + 42) {
        sp.dirt = Math.max(0, sp.dirt - d / 240);
        sp.el.style.opacity = sp.dirt * sp.max;
        if (sp.dirt === 0) { fxAt('spark', cx, cy, 'sparkle'); SFX.pop(); }
      }
    });
    if (any && groom.spots.every(s => s.dirt <= 0)) brushDone();
  }
  const HOOVES = [[133, 293], [163, 288], [267, 293], [297, 288]];
  function brushDone() {
    groom.step = 'hooves'; scrubbing = false;
    $('#brushCursor').classList.remove('on');
    sparkles(6); SFX.sparkle(); renderBar();
    say(`All the mud is gone! Now tap each hoof to clean it.`);
    const sr = stage.getBoundingClientRect();
    groom.hooves = 0;
    HOOVES.forEach(([x, y], i) => {
      const p = ponyPoint(x, y), t = document.createElement('button');
      t.className = 'hoofTarget'; t.innerHTML = ICON.pebble; t.setAttribute('aria-label', 'hoof');
      t.style.left = (p.x - sr.left) + 'px'; t.style.top = (p.y - sr.top + (i % 2 ? -26 : 14)) + 'px';
      t.addEventListener('pointerdown', ev => {
        ev.stopPropagation(); ev.preventDefault();
        fxAt('pebble', p.x, p.y, 'pebble'); SFX.pop(); t.remove();
        groom.hooves++;
        if (groom.hooves === 1) speakWord('hoof');
        if (groom.hooves >= 4) groomDone();
      });
      stage.appendChild(t);
    });
  }
  function groomDone() {
    groom.step = 'done';
    sparkles(16); SFX.sparkle(); setTimeout(SFX.sparkle, 500);
    S.needs.clean = 100; cared(); earn(2); renderHUD(); save();
    restart(ponyWrap, 'happy', 1100);
    say(`${nm()} is sparkly clean! Beautiful!`);
    setTimeout(() => { if (mode === 'groom') setMode('main'); }, 2600);
  }

  // ---------- Stage touches: petting and brushing ----------
  let petDist = 0, lastPet = 0;
  function onPony(e) { const r = ponyWrap.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; }
  stage.addEventListener('pointerdown', e => {
    if (mode === 'groom' && groom && groom.step === 'brush') { scrubbing = true; lastPt = null; moveBrush(e); return; }
    if (e.target.closest('#lantern') && mode === 'bed' && !asleep) { lanternOff(); return; }
    if (e.target.closest('#foal')) { SFX.neigh(); say('Hello, little foal!'); restart($('#foal'), 'happy', 1000); return; }
    if (e.target.closest('#bunny')) { SFX.boing(); say('Hop hop! Hello, bunny!'); return; }
    if (e.target.closest('#rosettes') && mode === 'main') { const n = S.rosettes.length; SFX.ding(); speakWord('rosette', `${nm()} has won ${n} ${n === 1 ? 'rosette' : 'rosettes'}!`); return; }
    if (e.target.closest('.win') && mode === 'main') { MORE.sayWeather(); return; }
    if ((mode === 'main' || mode === 'feed') && onPony(e)) { petPony(); lastPt = { x: e.clientX, y: e.clientY }; petDist = 0; }
    if (mode === 'bed' && asleep && onPony(e)) say('Shh! Sleeping.', { rate: 0.8 });
  });
  stage.addEventListener('pointermove', e => {
    if (mode === 'groom' && groom && groom.step === 'brush') { if (scrubbing || e.buttons) moveBrush(e); return; }
    if (mode === 'main' && e.buttons && lastPt && onPony(e)) {
      petDist += Math.hypot(e.clientX - lastPt.x, e.clientY - lastPt.y); lastPt = { x: e.clientX, y: e.clientY };
      if (petDist > 140) { petDist = 0; hearts(1); }
    }
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => stage.addEventListener(t, () => { scrubbing = false; lastPt = null; }));
  function petPony() {
    const now = Date.now(); if (now - lastPet < 1300) { hearts(1); return; }
    lastPet = now;
    SFX.neigh(); hearts(3); restart(pony, 'nod', 1500);
    const learned = Object.keys(S.tricks).filter(k => S.tricks[k]);
    if (learned.length && Math.random() < 0.35) { const t = learned[Math.floor(Math.random() * learned.length)]; setTimeout(() => MORE.perform(t, ponyWrap), 600); }
    const n = S.needs, low = Object.keys(n).sort((a, b) => n[a] - n[b])[0];
    if (n[low] >= 60) say(`${nm()} loves you!`);
    else if (low === 'hunger') { SFX.rumble(); say(`Rumble rumble! ${nm()} is hungry.`); }
    else if (low === 'clean') say(`${nm()} is a bit muddy. Let's brush!`);
    else say(`${nm()} is bored. Let's play!`);
  }
  $('#needs').addEventListener('click', e => {
    const b = e.target.closest('.need'); if (!b) return;
    const k = b.dataset.need, v = S.needs[k];
    SFX.tap();
    const L = {
      hunger: ['food', v < 35 ? `${nm()} is hungry!` : v < 75 ? `${nm()} could eat a snack.` : `${nm()}'s tummy is full!`],
      clean: ['clean', v < 35 ? `${nm()} is muddy!` : v < 75 ? `${nm()} is a little dusty.` : `${nm()} is nice and clean!`],
      fun: ['fun', v < 35 ? `${nm()} is bored. Let's play!` : v < 75 ? `${nm()} would like to play.` : `${nm()} is having lots of fun!`],
    }[k];
    speakWord(L[0], L[1]);
  });
  $('#shoes').addEventListener('click', () => { SFX.tap(); speakWord('horseshoes', `You have ${S.shoes} horseshoes!`); });

  // ---------- Bedtime ----------
  let zzT = 0;
  function startBed() {
    setMode('bed'); stage.classList.add('night');
    speakWord('bed', 'Bedtime! Put on the blanket, then turn off the lantern.');
  }
  function putBlanket() {
    if (S.blanket) { speakWord('blanket'); return; }
    S.blanket = true; renderPony(); SFX.whoosh(); renderBar();
    speakWord('blanket', 'Snug and cosy! Now turn off the lantern.');
  }
  function lanternOff() {
    if (!S.blanket) { speakWord('lantern', 'First, the blanket!'); return; }
    SFX.click(); stage.classList.add('dark');
    asleep = true; S.night = true; updateCues(); renderBar(); save();
    SFX.lullaby();
    setTimeout(() => say(`Goodnight, ${nm()}. Sweet dreams!`, { rate: 0.8 }), 400);
    startZz();
  }
  function startZz() {
    clearInterval(zzT);
    zzT = setInterval(() => { if (!asleep) return clearInterval(zzT); const p = ponyPoint(340, 40); fxAt('zz', p.x + 20, p.y, 'zzz'); }, 1400);
  }
  function morning() {
    asleep = false; S.night = false; S.blanket = false; clearInterval(zzT);
    stage.classList.remove('dark', 'night');
    S.needs.fun = Math.min(100, S.needs.fun + 15);
    const counted = S.cared;
    if (S.cared) { S.days += 1; S.cared = false; }
    setMode('main'); renderPony(); renderHUD(); save();
    SFX.cheer(); restart(ponyWrap, 'happy', 1100);
    speakWord('morning', `Good morning, ${nm()}!`);
    if (counted) setTimeout(() => earn(2), 600);
    setTimeout(checkFriends, 2200);
  }
  function checkFriends() {
    if (S.days >= 3 && !S.friends.foal) { S.friends.foal = true; save(); renderFriends(); layout(); celebrate('foal'); }
    else if (S.days >= 5 && !S.friends.bunny) { S.friends.bunny = true; save(); renderFriends(); layout(); celebrate('bunny'); }
  }
  function celebrate(kind) {
    const ov = $('#celebrate');
    const pic = kind === 'foal' ? `<div class="big" id="celFoal">${ART.ponySVG()}</div>` : `<div class="big sq">${ICON.bunny}</div>`;
    ov.innerHTML = `<h1>${kind === 'foal' ? 'foal' : 'bunny'}</h1>${pic}<button class="go pulse" aria-label="ok">${ICON.tick}</button>`;
    if (kind === 'foal') ART.applyLook($('#celFoal'), friendLook());
    ov.classList.add('show'); SFX.cheer(); setTimeout(SFX.sparkle, 400);
    say(kind === 'foal' ? `Hooray! A baby foal has come to live with ${nm()}!` : `Hooray! A fluffy bunny has hopped into the stable!`);
    ov.querySelector('.go').onclick = () => { SFX.tap(); ov.classList.remove('show'); };
  }

  // ---------- Shop ----------
  const SHOP = [
    { id: 'mane-pink', word: 'pink', kind: 'mane', val: 'pink', price: 3, ico: ART.maneIcon('#ff8fc7') },
    { id: 'mane-blue', word: 'blue', kind: 'mane', val: 'blue', price: 3, ico: ART.maneIcon('#6fb7ff') },
    { id: 'mane-gold', word: 'gold', kind: 'mane', val: 'gold', price: 4, ico: ART.maneIcon('#ffd34d') },
    { id: 'mane-rainbow', word: 'rainbow', kind: 'mane', val: 'rainbow', price: 6, ico: ART.maneIcon('url(#g-rainbow)') },
    { id: 'bow', word: 'bow', kind: 'bow', price: 4, ico: ICON.bow },
    { id: 'saddle', word: 'saddle', kind: 'saddle', price: 6, ico: ICON.saddle },
    { id: 'bunting', word: 'flags', kind: 'bunting', price: 5, ico: ICON.bunting },
    { id: 'flowers', word: 'flowers', kind: 'flowers', price: 4, ico: ICON.flowers },
    { id: 'lights', word: 'lights', kind: 'lights', price: 6, ico: ICON.lights },
  ];
  const isOn = it => it.kind === 'mane' ? S.equip.mane === it.val : !!S.equip[it.kind];
  function openShop() {
    const ov = $('#shop');
    ov.innerHTML = `<button class="topbtn" data-x="close" aria-label="back">${ICON.home}</button>
      <div class="sub"><span>${ICON.shop}</span><div class="chip" style="margin:0"><span>${ICON.shoe}</span><span class="cnt">${S.shoes}</span></div></div>
      <div id="shopPony" style="width:min(46vw,34vh,260px);aspect-ratio:370/316">${ART.ponySVG()}</div>
      <div class="grid">${SHOP.map(it => `<button class="card" data-id="${it.id}"><span class="pic sq">${it.ico}</span><span class="word">${it.word}</span><span class="price"></span></button>`).join('')}</div>`;
    ov.classList.add('show');
    renderShop();
    ov.onclick = e => {
      if (e.target.closest('[data-x="close"]')) { SFX.tap(); ov.classList.remove('show'); renderPony(); renderStable(); return; }
      const c = e.target.closest('.card'); if (!c) return;
      shopTap(SHOP.find(i => i.id === c.dataset.id), c);
    };
  }
  function renderShop() {
    const ov = $('#shop');
    ART.applyLook($('#shopPony'), look());
    ov.querySelector('.cnt').textContent = S.shoes;
    SHOP.forEach(it => {
      const c = ov.querySelector(`[data-id="${it.id}"]`), owned = S.owned.includes(it.id);
      c.classList.toggle('owned', owned); c.classList.toggle('sel', owned && isOn(it)); c.classList.toggle('locked', !owned && S.shoes < it.price);
      c.querySelector('.price').innerHTML = owned ? `<span style="width:30px;height:30px">${isOn(it) ? ICON.tick : ''}</span>` : `${ICON.shoe}<span>${it.price}</span>`;
    });
  }
  function equip(it, on) {
    if (it.kind === 'mane') S.equip.mane = on ? it.val : null; else S.equip[it.kind] = on;
  }
  function shopTap(it, card) {
    const owned = S.owned.includes(it.id);
    if (owned) {
      const on = !isOn(it); equip(it, on); SFX.tap();
      speakWord(it.word, on ? (it.kind === 'mane' || it.kind === 'bow' || it.kind === 'saddle' ? `${nm()} looks lovely!` : 'Pretty!') : '');
    } else if (S.shoes >= it.price) {
      S.shoes -= it.price; S.owned.push(it.id); equip(it, true);
      SFX.cheer(); setTimeout(SFX.sparkle, 300); renderHUD();
      speakWord(it.word, it.kind === 'mane' || it.kind === 'bow' || it.kind === 'saddle' ? `${nm()} looks lovely!` : `How pretty! It's in the stable now.`);
    } else {
      restart(card, 'shake', 450); SFX.boing();
      speakWord(it.word, `You need ${it.price} horseshoes. Look after ${nm()} to earn more!`);
    }
    save(); renderShop(); renderPony(); renderStable();
  }

  // ---------- First-time setup ----------
  const NAMES = [['Star', 'star'], ['Daisy', 'daisy'], ['Moon', 'moon'], ['Apple', 'apple'], ['Rainbow', 'rainbow'], ['Cookie', 'cookie'], ['Sunny', 'sun'], ['Snowy', 'snow']];
  function setupColour() {
    const ov = $('#setup');
    ov.innerHTML = `<h1>Pony Pals</h1><div class="sub">${ICON.heart}${ICON.star}${ICON.heart}</div>
      <div class="grid">${Object.keys(ART.COATS).map(k => `<button class="card" data-coat="${k}"><span class="pic">${ART.ponySVG()}</span><span class="word">${ART.COATS[k].word}</span></button>`).join('')}</div>
      <button class="go" disabled aria-label="next">${ICON.tick}</button>`;
    ov.querySelectorAll('[data-coat]').forEach(c => ART.applyLook(c, { coat: c.dataset.coat }));
    ov.classList.add('show');
    let chosen = null;
    ov.onclick = e => {
      const c = e.target.closest('[data-coat]');
      if (c) {
        chosen = c.dataset.coat; ov.querySelectorAll('.card').forEach(x => x.classList.toggle('sel', x === c));
        SFX.neigh(); speakWord(ART.COATS[chosen].word, `${ART.COATS[chosen].word} pony! Tap the green tick when you're ready.`);
        const g = ov.querySelector('.go'); g.disabled = false; g.classList.add('pulse'); return;
      }
      if (e.target.closest('.go') && chosen) { SFX.tap(); S.coat = chosen; setupName(); }
    };
  }
  function setupName() {
    const ov = $('#setup');
    ov.innerHTML = `<div id="namePony" style="width:min(40vw,26vh,220px);aspect-ratio:370/316">${ART.ponySVG()}</div>
      <div class="grid">${NAMES.map(([n, ico]) => `<button class="card" data-name="${n}"><span class="pic sq">${ICON[ico]}</span><span class="word">${n}</span></button>`).join('')}</div>
      <button class="parentType">Grown-ups: type a name</button>
      <div class="typeRow"><input id="nameInput" maxlength="14" placeholder="Pony name" autocomplete="off"><button id="nameOk">OK</button></div>
      <button class="go" disabled aria-label="start">${ICON.tick}</button>`;
    ART.applyLook($('#namePony'), { coat: S.coat });
    say(`What's your pony's name? Tap a picture.`);
    let chosen = null;
    const pick = (n, card) => {
      chosen = n; ov.querySelectorAll('.card').forEach(x => x.classList.toggle('sel', x === card));
      const g = ov.querySelector('.go'); g.disabled = false; g.classList.add('pulse');
    };
    ov.onclick = e => {
      const c = e.target.closest('[data-name]');
      if (c) { pick(c.dataset.name, c); SFX.tap(); speakWord(c.dataset.name, `Hello, ${c.dataset.name}!`); return; }
      if (e.target.closest('.parentType')) { ov.querySelector('.typeRow').classList.add('show'); $('#nameInput').focus(); return; }
      if (e.target.closest('#nameOk')) {
        const v = $('#nameInput').value.trim().slice(0, 14);
        if (v) { pick(v, null); $('#nameInput').blur(); speakWord(v, `Hello, ${v}!`); }
        return;
      }
      if (e.target.closest('.go') && chosen) {
        SFX.cheer(); S.name = chosen; S.setup = true; S.last = Date.now(); save();
        ov.classList.remove('show'); renderAll();
        say(`Welcome home, ${S.name}! Look after your pony. Tap ${S.name} to say hello.`);
        restart(ponyWrap, 'happy', 1100);
      }
    };
  }

  // ---------- Ride mini-games: logs, beach, forest ----------
  const cv = $('#playCanvas'), cx = cv.getContext('2d'), rider = $('#rider');
  let P = null;
  function sizePlay() {
    const W = innerWidth, H = innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const ph = Math.max(90, Math.min(H * 0.3, W * 0.42, 260)), pw = ph * VB.w / VB.h;
    Object.assign(P, { W, H, ground: H * 0.8, ph, pw, px: W * 0.08, speed: Math.max(W * 0.3, pw * 1.7), g: ph * 7.5, jv: ph * 3.7 });
    Object.assign(rider.style, { width: pw + 'px', height: ph + 'px', left: 0, top: 0 });
  }
  const RIDE_INTRO = { logs: 'Tap to jump over the logs!', beach: 'Tap to jump into the waves! Splash!', forest: 'Tap to jump and catch the stars!' };
  function startPlay(theme) {
    theme = RIDE_INTRO[theme] ? theme : 'logs';
    const ov = $('#play');
    const lk = look(); lk.raincoat = S.wear === 'raincoat'; lk.blanket = S.wear === 'rug';
    rider.innerHTML = ART.ponySVG(); ART.applyLook(rider, lk); rider.classList.add('running');
    P = { theme, logs: [], next: 1.6, done: 0, total: theme === 'forest' ? 10 : 8, jumped: 0, y: 0, vy: 0, on: true, last: performance.now(), dist: 0, parts: [],
      clouds: [0, 1, 2, 3].map(i => ({ x: i * 0.3 + Math.random() * 0.1, y: 0.08 + Math.random() * 0.2, s: 0.7 + Math.random() * 0.6 })),
      wx: Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), s: 0.5 + Math.random() })) };
    sizePlay();
    ov.className = 'overlay show ride-' + theme;
    $('#playCount').innerHTML = Array.from({ length: P.total }, () => `<span class="empty">${ICON.star}</span>`).join('');
    $('#tapHint').classList.remove('hide'); $('#finish').classList.remove('show');
    say(RIDE_INTRO[theme]);
    requestAnimationFrame(loop);
  }
  function jump() {
    if (!P || !P.on) return;
    if (P.y <= 2) { P.vy = P.jv; SFX.jump(); $('#tapHint').classList.add('hide'); }
  }
  $('#play').addEventListener('pointerdown', e => {
    if (e.target.closest('.topbtn') || e.target.closest('.finish')) return;
    e.preventDefault(); jump();
  });
  $('#playHome').addEventListener('click', () => { SFX.tap(); endPlay(false); });
  function burst(x, y, kind, n) {
    for (let i = 0; i < n; i++) P.parts.push({ x, y, vx: (Math.random() - 0.5) * 320, vy: -180 - Math.random() * 280, life: 1, kind });
  }
  function gotStar(x, y) {
    P.jumped++; SFX.ding();
    const s = $('#playCount').children[P.jumped - 1]; if (s) s.classList.remove('empty');
    burst(x, y, 'star', 10);
  }
  function loop(t) {
    if (!P || !P.on) return;
    const dt = Math.min(0.05, (t - P.last) / 1000); P.last = t;
    P.dist += P.speed * dt;
    if (P.y > 0 || P.vy > 0) {
      P.vy -= P.g * dt; P.y += P.vy * dt;
      if (P.y <= 0) { P.y = 0; P.vy = 0; SFX.clop(); if (P.theme === 'beach') { burst(P.px + P.pw * 0.5, P.ground - 10, 'drop', 6); } }
    }
    rider.classList.toggle('jumping', P.y > 4);
    rider.style.transform = `translate(${P.px}px,${P.ground - P.ph * 0.985 - P.y}px)`;
    P.next -= dt;
    if (P.next <= 0 && P.logs.length + P.done < P.total) {
      if (P.theme === 'forest') {
        const high = Math.random() < 0.6;
        P.logs.push({ x: P.W + 20, w: P.ph * 0.28, h: P.ph * 0.28, alt: high ? P.ph * (0.95 + Math.random() * 0.35) : P.ph * 0.45 });
        P.next = 1.3 + Math.random() * 0.8;
      } else {
        P.logs.push({ x: P.W + 20, w: P.ph * (P.theme === 'beach' ? 0.42 : 0.3), h: P.ph * (P.theme === 'beach' ? 0.24 : 0.2), hit: false });
        P.next = 2.1 + Math.random() * 0.9;
      }
    }
    const fx0 = P.px + 0.2 * P.pw, fx1 = P.px + 0.74 * P.pw;
    P.logs.forEach(L => {
      L.x -= P.speed * dt;
      if (P.theme === 'forest') {
        const sy = P.ground - L.alt, top = P.ground - P.ph - P.y, bot = P.ground - P.y;
        if (!L.counted && L.x < P.px + 0.92 * P.pw && L.x + L.w > P.px + 0.15 * P.pw && sy > top - L.h * 0.3 && sy < bot) { L.counted = true; L.got = true; P.done++; gotStar(L.x, sy); }
        if (!L.counted && L.x + L.w < P.px) { L.counted = true; P.done++; L.away = true; }
      } else {
        if (!L.hit && L.x < fx1 && L.x + L.w > fx0 && P.y < L.h * 0.9) {
          L.hit = true; P.vy = Math.max(P.vy, P.ph * 2.4);
          if (P.theme === 'beach') { SFX.whoosh(); burst(L.x + L.w / 2, P.ground - L.h, 'drop', 8); } else SFX.boing();
        }
        if (!L.counted && L.x + L.w < fx0) {
          L.counted = true; P.done++;
          if (!L.hit) { gotStar(L.x + L.w / 2, P.ground - L.h - 20); if (P.theme === 'beach') { SFX.whoosh(); burst(L.x + L.w / 2, P.ground - L.h, 'drop', 14); } }
        }
      }
      if (P.done >= P.total && !P.ending) { P.ending = true; setTimeout(finishPlay, 900); }
    });
    P.logs = P.logs.filter(L => L.x + L.w > -50 && !L.got);
    P.parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt; p.life -= dt; });
    P.parts = P.parts.filter(p => p.life > 0);
    draw();
    requestAnimationFrame(loop);
  }
  function hills(off, base, amp, col, H, W) {
    cx.fillStyle = col; cx.beginPath(); cx.moveTo(0, H);
    for (let x = 0; x <= W + 20; x += 20) cx.lineTo(x, base - amp * (0.6 + 0.4 * Math.sin((x + off) / 160)) - amp * 0.3 * Math.sin((x + off) / 57));
    cx.lineTo(W, H); cx.fill();
  }
  function drawStar(x, y, r, a) {
    cx.save(); cx.globalAlpha = Math.max(0, Math.min(1, a)); cx.fillStyle = '#fde047'; cx.strokeStyle = '#ca8a04'; cx.lineWidth = 2;
    cx.beginPath(); for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * 0.45 : r, an = -Math.PI / 2 + i * Math.PI / 5; cx.lineTo(x + rr * Math.cos(an), y + rr * Math.sin(an)); }
    cx.closePath(); cx.fill(); cx.stroke(); cx.restore();
  }
  function cloudsSun(W, H, ground) {
    const wet = weatherNow() !== 'sun';
    const sky = cx.createLinearGradient(0, 0, 0, ground);
    sky.addColorStop(0, wet ? '#94a3b8' : '#7dd3fc'); sky.addColorStop(1, wet ? '#e2e8f0' : '#e0f7ff');
    cx.fillStyle = sky; cx.fillRect(0, 0, W, H);
    if (!wet) { cx.fillStyle = '#fde047'; cx.beginPath(); cx.arc(W * 0.85, H * 0.15, Math.min(W, H) * 0.07, 0, 7); cx.fill(); }
    cx.fillStyle = wet ? '#f1f5f9' : '#fff';
    P.clouds.forEach(c => {
      const x = ((c.x * W * 1.4 - P.dist * 0.08) % (W * 1.4) + W * 1.4) % (W * 1.4) - W * 0.2, y = c.y * H, s = c.s * Math.min(W, H) * 0.05;
      cx.beginPath(); cx.arc(x, y, s, 0, 7); cx.arc(x + s, y - s * 0.4, s * 1.2, 0, 7); cx.arc(x + s * 2.1, y, s * 0.9, 0, 7); cx.fill();
    });
  }
  function weatherFx(W, H) {
    const w = weatherNow(); if (w === 'sun') return;
    cx.save();
    P.wx.forEach(d => {
      if (w === 'rain') {
        const x = ((d.x * W - P.dist * 0.3 + performance.now() * 0.05 * d.s) % W + W) % W, y = (d.y * H + performance.now() * 0.6 * d.s) % H;
        cx.strokeStyle = '#3b82f6aa'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x - 4, y + 14); cx.stroke();
      } else {
        const x = ((d.x * W - P.dist * 0.2 + Math.sin(performance.now() / 800 + d.y * 9) * 20) % W + W) % W, y = (d.y * H + performance.now() * 0.06 * d.s) % H;
        cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(x, y, 2.5 * d.s + 1, 0, 7); cx.fill();
      }
    });
    cx.restore();
  }
  function draw() {
    const { W, H, ground } = P, th = P.theme, se = seasonNow(), snowy = weatherNow() === 'snow' || se === 'winter';
    cloudsSun(W, H, ground);
    if (th === 'beach') {
      cx.fillStyle = '#38bdf8'; cx.fillRect(0, ground - H * 0.2, W, H * 0.2);
      cx.strokeStyle = '#ffffffcc'; cx.lineWidth = 3;
      for (let r = 0; r < 3; r++) { cx.beginPath(); for (let x = 0; x <= W + 20; x += 20) cx.lineTo(x, ground - H * (0.16 - r * 0.05) + 4 * Math.sin((x + P.dist * (0.2 + r * 0.15)) / 30)); cx.stroke(); }
      cx.fillStyle = '#fcd34d'; cx.fillRect(0, ground - 4, W, H - ground + 4);
      cx.fillStyle = '#fbbf24';
      for (let i = 0; i < 16; i++) { const x = ((i * 113 - P.dist) % (W + 60) + W + 60) % (W + 60) - 30; cx.beginPath(); cx.arc(x, ground + H * 0.06 + (i % 4) * H * 0.03, 3, 0, 7); cx.fill(); }
      for (let i = 0; i < 4; i++) { const x = ((i * 290 + 80 - P.dist) % (W + 100) + W + 100) % (W + 100) - 50, y = ground + H * 0.1 + (i % 2) * H * 0.04; cx.fillStyle = i % 2 ? '#f472b6' : '#fb923c'; cx.beginPath(); cx.moveTo(x, y - 9); for (let k = 1; k < 10; k++) { const r = k % 2 ? 4 : 10, a = -Math.PI / 2 + k * Math.PI / 5; cx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); } cx.fill(); }
    } else if (th === 'forest') {
      const tree = (x, base, h, col) => { cx.fillStyle = '#7c4a1e'; cx.fillRect(x - h * 0.05, base - h * 0.3, h * 0.1, h * 0.3); cx.fillStyle = col; for (let k = 0; k < 3; k++) { const ty = base - h * 0.25 - k * h * 0.22; cx.beginPath(); cx.moveTo(x - h * (0.3 - k * 0.07), ty); cx.lineTo(x + h * (0.3 - k * 0.07), ty); cx.lineTo(x, ty - h * 0.35); cx.fill(); } };
      for (let i = 0; i < 9; i++) { const x = ((i * 170 - P.dist * 0.3) % (W + 200) + W + 200) % (W + 200) - 100; tree(x, ground - H * 0.02, H * 0.45, snowy ? '#a7c4b5' : '#4d9a5b'); }
      for (let i = 0; i < 6; i++) { const x = ((i * 260 + 90 - P.dist * 0.7) % (W + 300) + W + 300) % (W + 300) - 150; tree(x, ground + 4, H * 0.6, snowy ? '#cfe3d6' : se === 'autumn' ? (i % 2 ? '#d97706' : '#2f7d3f') : '#2f7d3f'); }
      cx.fillStyle = snowy ? '#f1f5f9' : '#5b8c3a'; cx.fillRect(0, ground, W, H - ground);
      cx.fillStyle = '#b08350'; cx.fillRect(0, ground - 4, W, H * 0.05);
      for (let i = 0; i < 10; i++) { const x = ((i * 151 - P.dist) % (W + 100) + W + 100) % (W + 100) - 50, y = ground + H * 0.09 + (i % 3) * H * 0.03; cx.fillStyle = '#ef4444'; cx.beginPath(); cx.arc(x, y, 7, Math.PI, 0); cx.fill(); cx.fillStyle = '#fff'; cx.fillRect(x - 2, y, 4, 7); }
    } else {
      hills(P.dist * 0.15, ground - H * 0.08, H * 0.12, snowy ? '#e2e8f0' : se === 'autumn' ? '#c7d98a' : '#a7e3a0', H, W);
      hills(P.dist * 0.4 + 300, ground, H * 0.07, snowy ? '#f1f5f9' : se === 'autumn' ? '#a3c46a' : '#86d48a', H, W);
      cx.fillStyle = snowy ? '#f8fafc' : '#6cc06f'; cx.fillRect(0, ground, W, H - ground);
      cx.fillStyle = '#e2b46b'; cx.fillRect(0, ground - 4, W, H * 0.05);
      for (let i = 0; i < 14; i++) {
        const x = ((i * 137 - P.dist) % (W + 100) + W + 100) % (W + 100) - 50, y = ground + H * 0.08 + (i % 3) * H * 0.04;
        if (se === 'autumn' && i % 3 === 0) { cx.fillStyle = '#f97316'; cx.beginPath(); cx.ellipse(x, y, 11, 8, 0, 0, 7); cx.fill(); cx.fillStyle = '#166534'; cx.fillRect(x - 1, y - 12, 3, 5); continue; }
        cx.fillStyle = ['#f472b6', '#fde047', '#fff', '#c084fc'][i % 4]; cx.beginPath(); cx.arc(x, y, 6, 0, 7); cx.fill();
        cx.fillStyle = '#f59e0b'; cx.beginPath(); cx.arc(x, y, 2.5, 0, 7); cx.fill();
      }
    }
    P.logs.forEach(L => {
      if (th === 'forest') { drawStar(L.x + L.w / 2, P.ground - L.alt, L.w / 2 + 3 * Math.sin(performance.now() / 150), L.away ? 0.4 : 1); return; }
      const y = ground - L.h;
      if (th === 'beach') {
        cx.fillStyle = '#0ea5e9'; cx.strokeStyle = '#0c4a6e'; cx.lineWidth = 3;
        cx.beginPath(); cx.moveTo(L.x, ground); cx.quadraticCurveTo(L.x + L.w * 0.3, y - L.h * 0.3, L.x + L.w * 0.75, y + L.h * 0.1);
        cx.quadraticCurveTo(L.x + L.w * 0.55, y + L.h * 0.35, L.x + L.w * 0.7, y + L.h * 0.5); cx.quadraticCurveTo(L.x + L.w, ground - 6, L.x + L.w * 1.1, ground); cx.closePath(); cx.fill(); cx.stroke();
        cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(L.x + L.w * 0.72, y + L.h * 0.12, L.h * 0.14, 0, 7); cx.arc(L.x + L.w * 0.6, y + L.h * 0.05, L.h * 0.1, 0, 7); cx.fill();
        return;
      }
      cx.fillStyle = '#9a6233'; cx.strokeStyle = '#4a2e1d'; cx.lineWidth = 4;
      cx.beginPath(); cx.roundRect ? cx.roundRect(L.x, y, L.w, L.h, L.h / 2) : cx.rect(L.x, y, L.w, L.h); cx.fill(); cx.stroke();
      cx.fillStyle = '#e0b07a'; cx.beginPath(); cx.ellipse(L.x + L.h * 0.35, y + L.h / 2, L.h * 0.32, L.h * 0.45, 0, 0, 7); cx.fill(); cx.stroke();
      cx.strokeStyle = '#9a6233'; cx.lineWidth = 2; cx.beginPath(); cx.ellipse(L.x + L.h * 0.35, y + L.h / 2, L.h * 0.14, L.h * 0.2, 0, 0, 7); cx.stroke();
      cx.fillStyle = '#4ade80'; cx.beginPath(); cx.ellipse(L.x + L.w * 0.7, y + 2, 8, 4, -0.4, 0, 7); cx.fill();
    });
    P.parts.forEach(p => {
      if (p.kind === 'drop') { cx.globalAlpha = Math.max(0, p.life); cx.fillStyle = '#7dd3fc'; cx.beginPath(); cx.arc(p.x, p.y, 6, 0, 7); cx.fill(); cx.globalAlpha = 1; }
      else drawStar(p.x, p.y, 10, p.life);
    });
    weatherFx(W, H);
  }
  function finishPlay() {
    if (!P || !P.on) return;
    P.on = false; rider.classList.remove('running');
    const f = $('#finish'), n = P.jumped;
    f.innerHTML = `<div class="stars">${n ? Array.from({ length: n }, (_, i) => `<span style="animation-delay:${i * 0.12}s">${ICON.star}</span>`).join('') : ICON.heart}</div><button class="go pulse" aria-label="home">${ICON.tick}</button>`;
    f.classList.add('show'); SFX.cheer();
    const what = { logs: `You jumped ${n} logs!`, beach: `You made ${n} big splashes!`, forest: `You caught ${n} stars!` }[P.theme];
    say(n ? `Wheee! ${what} ${nm()} had so much fun!` : `Wheee! What a lovely ride! ${nm()} had so much fun!`);
    f.querySelector('.go').onclick = () => { SFX.tap(); endPlay(true); };
  }
  function endPlay(finished) {
    if (!P) return;
    const done = P.done; P.on = false;
    $('#play').classList.remove('show'); rider.classList.remove('running', 'jumping');
    if (finished) { S.needs.fun = 100; cared(); setTimeout(() => earn(3), 300); restart(ponyWrap, 'happy', 1100); }
    else if (done > 0) { S.needs.fun = Math.min(100, S.needs.fun + done * 8); cared(); }
    P = null; renderHUD(); updateCues(); save();
  }

  // ---------- Grown-ups ----------
  function holdGate(el, ms, onDone) {
    let t0 = 0, raf = 0;
    const cancel = () => { cancelAnimationFrame(raf); raf = 0; el.style.setProperty('--p', 0); };
    const tick = () => {
      const p = Math.min(1, (performance.now() - t0) / ms);
      el.style.setProperty('--p', p * 100);
      if (p >= 1) { cancel(); onDone(); } else raf = requestAnimationFrame(tick);
    };
    el.addEventListener('pointerdown', e => { e.preventDefault(); cancel(); t0 = performance.now(); raf = requestAnimationFrame(tick); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => el.addEventListener(t, cancel));
    el.addEventListener('contextmenu', e => e.preventDefault());
  }
  holdGate($('#parentBtn'), 3000, () => { SFX.ding(); openParent(); });
  $('#parentBtn').addEventListener('click', () => {});
  function openParent() {
    const ov = $('#parent'), st = S.settings;
    const left = S.timerEnd ? Math.max(0, Math.ceil((S.timerEnd - Date.now()) / 60000)) : 0;
    ov.innerHTML = `<div class="pp">
      <h2>Grown-ups</h2>
      <section><h3>Play timer</h3><div class="row">${[0, 10, 15, 20, 30].map(m => `<button class="opt ${st.timer === m ? 'on' : ''}" data-timer="${m}">${m ? m + ' min' : 'Off'}</button>`).join('')}</div>
        <p>${S.timerEnd ? `About ${left} min left. ` : ''}When time is up the game says "Your pony's sleepy, time for bed!" and pauses until a grown-up holds the button for 3 seconds.</p></section>
      <section><h3>Sound</h3><div class="row"><button class="opt ${st.sound ? 'on' : ''}" data-set="sound">Sound effects ${st.sound ? 'on' : 'off'}</button><button class="opt ${st.voice ? 'on' : ''}" data-set="voice">Voice ${st.voice ? 'on' : 'off'}</button></div></section>
      <section><h3>Pony's name</h3><div class="row"><input id="ppName" maxlength="14" value="${(S.name || '').replace(/"/g, '&quot;')}"><button class="btn" id="ppSave">Save</button></div></section>
      <section><h3>Progress</h3><p>Days of care: ${S.days}. Horseshoes: ${S.shoes}. Friends: ${S.friends.foal ? 'foal' : 'foal arrives after 3 days of care'}${S.friends.bunny ? ', bunny' : S.friends.foal ? ', bunny arrives after 5 days' : ''}.</p>
        <p>A day counts when your child does some care and then puts the pony to bed. Needs go down slowly in real time, but nothing bad ever happens.</p></section>
      <section><h3>Put it on the home screen</h3><p>iPad (Safari): tap Share, then "Add to Home Screen". Android (Chrome): tap the ⋮ menu, then "Add to Home screen" or "Install app". It then opens full screen and works offline.</p></section>
      <section><h3>Start again</h3><div class="row"><button class="btn danger" id="ppReset">Reset the game</button></div><p>Deletes this pony, horseshoes and progress on this device.</p></section>
      <button class="btn" id="ppClose" style="font-size:22px;padding:14px">Back to the stable</button>
    </div>`;
    ov.classList.add('show');
    ov.onclick = e => {
      const t = e.target.closest('[data-timer]');
      if (t) { const m = +t.dataset.timer; st.timer = m; S.timerEnd = m ? Date.now() + m * 60000 : 0; save(); openParent(); return; }
      const s = e.target.closest('[data-set]');
      if (s) { st[s.dataset.set] = !st[s.dataset.set]; SND.sound = st.sound; SND.voice = st.voice; save(); openParent(); return; }
      if (e.target.closest('#ppSave')) { const v = $('#ppName').value.trim().slice(0, 14); if (v) { S.name = v; save(); say(`Hello, ${v}!`); } return; }
      if (e.target.closest('#ppReset')) { if (confirm('Reset Pony Pals? This deletes all progress on this device.')) { noSave = true; localStorage.removeItem(KEY); location.reload(); } return; }
      if (e.target.closest('#ppClose')) { ov.classList.remove('show'); }
    };
  }
  let sleepyShown = false;
  function checkTimer() {
    if (!S.timerEnd || sleepyShown || Date.now() < S.timerEnd) return;
    sleepyShown = true;
    if (P && P.on) { P.on = false; $('#play').classList.remove('show'); P = null; }
    const ov = $('#sleepy');
    ov.innerHTML = `<div class="moonBig">${ICON.moon}</div><div class="pz" id="sleepyPony">${ART.ponySVG()}</div>
      <button class="holdBtn" id="sleepyHold"><span>Grown-ups: hold for 3 seconds to keep playing</span></button>`;
    ART.applyLook($('#sleepyPony'), Object.assign(look(), { blanket: true }));
    $('#sleepyPony .pony').classList.add('asleep');
    ov.classList.add('show');
    SND.SFX.lullaby();
    const line = "Your pony's sleepy, time for bed!";
    say(line, { rate: 0.85 });
    ov.onclick = e => { if (!e.target.closest('#sleepyHold')) say(line, { rate: 0.85 }); };
    holdGate($('#sleepyHold'), 3000, () => {
      S.timerEnd = 0; S.settings.timer = 0; save(); sleepyShown = false; ov.classList.remove('show'); openParent();
    });
  }

  // ---------- Global behaviour ----------
  document.addEventListener('pointerdown', () => SND.unlock(), true);
  document.addEventListener('touchstart', () => SND.unlock(), { capture: true, passive: true });
  ['gesturestart', 'gesturechange', 'gestureend', 'dblclick'].forEach(t => document.addEventListener(t, e => e.preventDefault(), { passive: false }));
  document.addEventListener('contextmenu', e => { if (!e.target.closest('input')) e.preventDefault(); });
  document.addEventListener('touchmove', e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
  addEventListener('resize', () => { layout(); if (P) sizePlay(); });
  addEventListener('orientationchange', () => setTimeout(() => { layout(); if (P) sizePlay(); }, 250));
  document.addEventListener('visibilitychange', () => { if (document.hidden) save(); else { decay(); renderHUD(); updateCues(); } });

  function renderAll() { decay(); renderHUD(); renderPony(); renderStable(); layout(); setMode(mode); }
  let ticks = 0;
  setInterval(() => {
    decay(); renderHUD(); if (mode === 'main' || mode === 'feed') updateCues();
    if (++ticks % 10 === 0) save();
    checkTimer();
  }, 1000);

  // Shared with more.js (extra activities)
  window.PP = { S, save, earn, say, speakWord, look, renderAll, renderHUD, renderPony, renderStable, renderBar, layout, ponyPoint, cared, hearts,
    sparkles, restart, nm, fxAt, startPlay, openShop, holdGate, todayKey, seasonNow, weatherNow, friendLook, get mode() { return mode; } };
  MORE.init();

  // Start
  if (S.night) { asleep = true; mode = 'bed'; stage.classList.add('night', 'dark'); startZz(); }
  renderAll();
  requestAnimationFrame(layout);
  if (!S.setup) setupColour();
  checkTimer();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  window.__pony = { S, layout };
})();
