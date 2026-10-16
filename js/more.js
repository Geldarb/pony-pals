/* Pony Pals: extra activities (picture menu, rides, words, tricks, show, foal, meadow, photo booth). */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const ICON = ART.ICON, SFX = SND.SFX, say = SND.say;
  const G = () => window.PP;
  const S = () => window.PP.S;
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const wait = ms => new Promise(r => setTimeout(r, ms));

  function overlay(id, cls) {
    let el = document.getElementById(id);
    if (!el) { el = document.createElement('div'); el.id = id; document.body.appendChild(el); }
    el.className = 'overlay show ' + (cls || '');
    return el;
  }
  function close(el) { el.classList.remove('show'); el.onclick = null; el.onpointerdown = null; el.onpointermove = null; el.innerHTML = ''; }
  const homeBtn = () => `<button class="topbtn" data-x="close" aria-label="back">${ICON.home}</button>`;
  function ponyBox(el, lk) { el.innerHTML = ART.ponySVG(); ART.applyLook(el, lk); return el.querySelector('.pony'); }
  function outdoorLook() { const lk = G().look(); lk.raincoat = S().wear === 'raincoat'; lk.blanket = S().wear === 'rug'; return lk; }
  function reward(n) { S().shoes += n; G().renderHUD(); G().save(); }
  function shoeRow(n) { return `<div class="shoeRow">${Array.from({ length: n }, () => ICON.shoe).join('')}</div>`; }
  function restart(el, cls, ms) { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); if (ms) setTimeout(() => el.classList.remove(cls), ms); }
  function sparkAt(host, x, y, ico, cls) {
    const e = document.createElement('div'); e.className = 'fx ' + (cls || 'spark'); e.style.left = x + 'px'; e.style.top = y + 'px';
    e.innerHTML = ICON[ico || 'sparkle']; host.appendChild(e); setTimeout(() => e.remove(), 1600);
  }
  function heartsOn(host, target, n) {
    const hr = host.getBoundingClientRect(), r = target.getBoundingClientRect();
    for (let i = 0; i < n; i++) sparkAt(host, r.left - hr.left + r.width * (0.3 + Math.random() * 0.5), r.top - hr.top + r.height * (0.1 + Math.random() * 0.3), 'heart', 'heart');
  }

  // ---------- Picture menu ----------
  const MENU = [
    ['words', 'words', () => words()], ['show', 'rosette', () => weatherCheck(show)], ['foal', 'bottle', () => foal()],
    ['meadow', 'tree', () => weatherCheck(meadow)], ['photo', 'camera', () => photo()], ['tricks', 'wand', () => tricks()],
    ['visitor', 'door', () => MORE3.visit()], ['count', 'numbers', () => MORE3.counting()], ['colours', 'palette', () => MORE3.colours()],
    ['vet', 'stetho', () => MORE3.vet()], ['friends', 'friends', () => MORE3.friends()],
    ['shop', 'shop', () => G().openShop()],
  ];
  function open() {
    const ov = overlay('moreOv');
    const hasFoal = S().friends.foal;
    ov.innerHTML = homeBtn() + `<div class="sub">${ICON.map}</div><div class="grid menuGrid">${MENU.map(([w, ico]) =>
      `<button class="card ${w === 'foal' && !hasFoal ? 'locked' : ''}" data-m="${w}"><span class="pic sq">${ICON[ico]}</span><span class="word">${w}</span></button>`).join('')}</div>`;
    ov.onclick = e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      const c = e.target.closest('[data-m]'); if (!c) return;
      SFX.tap();
      const m = MENU.find(x => x[0] === c.dataset.m);
      if (m[0] === 'foal' && !hasFoal) {
        const left = Math.max(1, 3 - S().days);
        G().speakWord('foal', `A baby foal will come to live here after ${left} more ${left === 1 ? 'day' : 'days'} of looking after ${G().nm()}. Remember to say goodnight at bedtime!`);
        restart(c, 'shake', 450); return;
      }
      G().speakWord(m[0]); close(ov); m[2]();
    };
  }

  // ---------- Weather ----------
  const WX_WORD = { sun: 'sunny', rain: 'rainy', snow: 'snowy' };
  function sayWeather() {
    const w = G().weatherNow(), se = G().seasonNow();
    const extra = w === 'rain' ? ' Ponies wear a raincoat outside.' : w === 'snow' ? ' Ponies wear a warm blanket outside.' : '';
    const seasonBit = { autumn: 'Look at the pumpkins!', winter: 'Brrr, it is winter!', spring: 'The flowers are growing!', summer: 'Hooray for summer!' }[se];
    G().speakWord(WX_WORD[w], `It's a ${WX_WORD[w]} ${se} day!${extra} ${seasonBit}`);
  }
  function weatherCheck(next) {
    const w = G().weatherNow(), need = w === 'rain' ? 'raincoat' : w === 'snow' ? 'rug' : null;
    if (!need) { S().wear = null; return next(); }
    if (S().wear === need) return next();
    const ov = overlay('wxOv', 'wx-' + w);
    const tileIco = need === 'raincoat' ? 'raincoat' : 'blanket', word = need === 'raincoat' ? 'raincoat' : 'blanket';
    ov.innerHTML = `${homeBtn()}<div class="sub big">${ICON[w === 'rain' ? 'rain' : 'snow']}</div><div class="pbox mid" id="wxPony"></div>
      <button class="tile big glow" id="wxWear"><span class="ico">${ICON[tileIco]}</span><span class="word dark">${word}</span></button>`;
    ponyBox($('#wxPony'), G().look());
    say(w === 'rain' ? `It's raining outside! Put on ${G().nm()}'s raincoat.` : `It's snowing outside! Put on ${G().nm()}'s warm blanket.`);
    ov.onclick = e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      if (e.target.closest('#wxWear')) {
        S().wear = need; G().save(); SFX.whoosh();
        ART.applyLook($('#wxPony'), outdoorLook()); restart($('#wxPony'), 'happy', 900);
        G().speakWord(word, need === 'raincoat' ? 'Nice and dry! Off we go!' : 'Warm and cosy! Off we go!');
        ov.onclick = null;
        setTimeout(() => { close(ov); next(); }, 1700);
      }
    };
  }

  // ---------- Ride picker ----------
  function ridePicker() {
    const ov = overlay('rideOv');
    ov.innerHTML = homeBtn() + `<div class="sub">${ICON.ball}</div><div class="grid rideGrid">${[['logs', 'log'], ['beach', 'beach'], ['forest', 'forest']].map(([w, i]) =>
      `<button class="card" data-r="${w}"><span class="pic sq">${ICON[i]}</span><span class="word">${w}</span></button>`).join('')}</div>`;
    ov.onclick = e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      const c = e.target.closest('[data-r]'); if (!c) return;
      SFX.tap(); G().speakWord(c.dataset.r); close(ov);
      weatherCheck(() => G().startPlay(c.dataset.r));
    };
  }

  // ---------- 1. Read-along word game ----------
  const WORDS = [['apple', 'apple'], ['carrot', 'carrot'], ['hay', 'hay'], ['brush', 'brush'], ['ball', 'ball'], ['sun', 'sun'], ['moon', 'moon'], ['star', 'star'],
    ['bow', 'bow'], ['heart', 'heart'], ['cookie', 'cookie'], ['hat', 'party'], ['tree', 'tree'], ['leaf', 'leaf'], ['flower', 'flower'], ['crown', 'crown'], ['berry', 'berry'], ['shoe', 'shoe']];
  const PRAISE = ['Yes!', 'Well done!', 'Brilliant!', 'Super reading!', 'Hooray!', 'You got it!'];
  function words() {
    const ov = overlay('wordsOv');
    const lvl = Math.min(3, Math.floor((S().words.rounds || 0) / 2));
    const nOpt = [2, 3, 4, 4][lvl], picOp = [1, 0.55, 0.2, 0][lvl];
    const targets = shuffle(WORDS).slice(0, 5);
    let q = 0, busy = false;
    ov.innerHTML = `${homeBtn()}<div class="wTop"><div class="pbox small" id="wPony"></div><button class="bubble" id="wBubble"><span id="wWord"></span>${ICON.sound}</button></div>
      <div class="wStars">${targets.map(() => `<span class="empty">${ICON.star}</span>`).join('')}</div><div class="wCards" id="wCards"></div>`;
    const pz = ponyBox($('#wPony'), G().look());
    function ask() {
      const [w] = targets[q];
      const others = shuffle(WORDS.filter(x => x[0] !== w)).slice(0, nOpt - 1);
      const opts = shuffle([targets[q]].concat(others));
      $('#wWord').textContent = w;
      $('#wCards').innerHTML = opts.map(([ow, ico]) => `<button class="card wcard" data-w="${ow}"><span class="pic sq" style="opacity:${picOp}">${ICON[ico]}</span><span class="word">${ow}</span></button>`).join('');
      say(`Can you find... ${w}?`);
      busy = false;
    }
    ov.onclick = async e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      if (e.target.closest('#wBubble')) { SFX.tap(); say(targets[q][0], { rate: 0.75 }); return; }
      const c = e.target.closest('.wcard'); if (!c || busy) return;
      const w = targets[q][0];
      if (c.dataset.w === w) {
        busy = true; c.classList.add('right'); c.querySelector('.pic').style.opacity = 1;
        SFX.ding(); restart(pz.parentNode, 'happy', 900);
        ov.querySelectorAll('.wStars span')[q].classList.remove('empty');
        say(`${pick(PRAISE)} ${w}!`);
        await wait(1500);
        if (++q < targets.length) ask(); else finish();
      } else {
        restart(c, 'shake', 450); SFX.boing();
        say(`That one says ${c.dataset.w}. Can you find ${w}?`);
      }
    };
    function finish() {
      S().words.rounds = (S().words.rounds || 0) + 1; reward(2); SFX.cheer();
      const up = Math.min(3, Math.floor(S().words.rounds / 2)) > lvl;
      $('#wCards').innerHTML = `<div class="finishCard">${shoeRow(2)}<button class="go pulse" data-x="close">${ICON.tick}</button></div>`;
      say(`You read all the words! ${G().nm()} is so proud of you. Here are two horseshoes!${up ? ' Next time the words get a little trickier!' : ''}`);
    }
    ask();
  }

  // ---------- 8. Tricks ----------
  const TRICKS = [['bow', 2], ['nod', 2], ['wave', 3], ['spin', 3], ['hop', 4], ['dance', 4]];
  const PAD = [['star', '#fde047'], ['heart', '#fda4af'], ['moon', '#c4b5fd'], ['sun', '#fdba74']];
  function perform(t, el) {
    if (!el) return;
    const ms = { bow: 1700, nod: 1500, wave: 1600, spin: 1300, hop: 1100, dance: 2100 }[t] || 1500;
    restart(el, 't-' + t, ms);
    ({ bow: () => SFX.aww(), nod: () => SFX.clop(), wave: () => SFX.ding(), spin: () => SFX.whoosh(), hop: () => SFX.jump(), dance: () => SFX.cheer() })[t]();
  }
  function tricks() {
    const ov = overlay('trickOv');
    ov.innerHTML = `${homeBtn()}<div class="pbox big" id="tPony"></div><div class="pad" id="tPad"></div><div class="tCards" id="tCards"></div>`;
    ponyBox($('#tPony'), G().look());
    const render = () => {
      $('#tCards').innerHTML = TRICKS.map(([t]) => `<button class="card tcard ${S().tricks[t] ? 'sel' : 'todo'}" data-t="${t}"><span class="pic sq">${ICON['t_' + t]}</span><span class="word">${t}</span><span class="tag">${S().tricks[t] ? ICON.tick : ICON.wand}</span></button>`).join('');
    };
    render();
    let teach = null;
    say(Object.keys(S().tricks).length ? `Tap a trick! Shiny ones ${G().nm()} already knows.` : `Let's teach ${G().nm()} a trick! Tap one.`);
    async function showPattern() {
      teach.busy = true; teach.i = 0;
      $('#tPad').classList.add('watch');
      await wait(700);
      for (const k of teach.seq) {
        const b = $('#tPad').children[k]; b.classList.add('lit'); SFX.note(k); await wait(560); b.classList.remove('lit'); await wait(200);
      }
      $('#tPad').classList.remove('watch'); teach.busy = false;
    }
    ov.onclick = async e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      const c = e.target.closest('.tcard');
      if (c && !(teach && teach.busy)) {
        const t = c.dataset.t;
        if (S().tricks[t]) { G().speakWord(t); perform(t, $('#tPony')); teach = null; $('#tPad').innerHTML = ''; return; }
        const n = TRICKS.find(x => x[0] === t)[1];
        teach = { t, seq: Array.from({ length: n }, () => Math.floor(Math.random() * 4)), i: 0, busy: true };
        window.MORE._seq = teach.seq;
        $('#tPad').innerHTML = PAD.map(([ico, col], i) => `<button class="padBtn" data-p="${i}" style="background:${col}">${ICON[ico]}</button>`).join('');
        G().speakWord(t, `Let's teach ${G().nm()} to ${t}! Watch the pictures light up, then copy.`);
        await wait(2600); showPattern(); return;
      }
      const p = e.target.closest('.padBtn');
      if (p && teach && !teach.busy) {
        const k = +p.dataset.p;
        if (k === teach.seq[teach.i]) {
          SFX.note(k); restart(p, 'lit', 250); teach.i++;
          if (teach.i >= teach.seq.length) {
            const t = teach.t; teach.busy = true;
            S().tricks[t] = true; reward(2); G().save();
            await wait(400); perform(t, $('#tPony'));
            say(`Clever ${G().nm()}! ${G().nm()} learned to ${t}! Here are two horseshoes.`);
            $('#tPad').innerHTML = shoeRow(2); render(); teach = null;
          }
        } else {
          restart(p, 'shake', 450); SFX.boing(); say('Oops! Watch again.');
          await wait(1200); showPattern();
        }
      }
    };
  }

  // ---------- 2. Pony show ----------
  const TITLES = ['Shiniest Pony', 'Best Jumper', 'Super Style', 'Happiest Pony', 'Kindest Pony', 'Sparkle Star', 'Bounciest Pony', 'Best Friend'];
  const ROSE = ['#3b82f6', '#ef4444', '#facc15', '#22c55e', '#a855f7', '#f472b6'];
  function show() {
    const ov = overlay('showOv');
    ov.innerHTML = `${homeBtn()}<div class="crowd">${Array.from({ length: 14 }, (_, i) => `<span style="--c:${['#f472b6', '#60a5fa', '#facc15', '#4ade80', '#c084fc'][i % 5]};animation-delay:${(i % 4) * 0.15}s"></span>`).join('')}</div>
      <div class="rounds"><span data-r="0">${ICON.brush}</span><span data-r="1">${ICON.fence}</span><span data-r="2">${ICON.bow}</span></div>
      <div class="arena" id="arena"><div class="pbox show" id="sPony"></div><div class="fenceEl" id="fenceEl">${ICON.fence}</div></div>
      <div class="showMsg" id="showMsg"></div>`;
    const sp = $('#sPony'), arena = $('#arena');
    ponyBox(sp, outdoorLook());
    const n = G().nm();
    let step = 0, count = 0, lock = false;
    const setRound = r => ov.querySelectorAll('.rounds span').forEach((s, i) => { s.classList.toggle('on', i === r); s.classList.toggle('done', i < r); });
    function groomRound() {
      setRound(0); step = 0; count = 0;
      say(`Welcome to the pony show! First, the grooming round. Tap the sparkles to make ${n} shine!`);
      const spots = [[0.35, 0.45], [0.55, 0.55], [0.8, 0.3]];
      spots.forEach(([x, y]) => {
        const b = document.createElement('button'); b.className = 'glint'; b.innerHTML = ICON.sparkle;
        b.style.left = x * 100 + '%'; b.style.top = y * 100 + '%'; sp.appendChild(b);
        b.addEventListener('pointerdown', ev => {
          ev.stopPropagation(); b.remove(); SFX.sparkle(); count++;
          const ar = arena.getBoundingClientRect(), br = sp.getBoundingClientRect();
          for (let i = 0; i < 4; i++) sparkAt(arena, br.left - ar.left + br.width * (x + (Math.random() - 0.5) * 0.3), br.top - ar.top + br.height * (y + (Math.random() - 0.5) * 0.3));
          if (count === 3) {
            const wasClean = S().needs.clean >= 75;
            S().needs.clean = Math.max(S().needs.clean, 85); G().save(); SFX.clap();
            say(wasClean ? `The judge says: so shiny! Well done for brushing ${n}!` : `The judge says: what a lovely shine!`);
            setTimeout(jumpRound, 3200);
          }
        });
      });
    }
    function jumpRound() {
      setRound(1); step = 1; count = 0;
      $('#fenceEl').classList.add('on');
      say(`Now the jumping round! Tap ${n} to jump the fence.`);
    }
    ov.onpointerdown = e => {
      if (e.target.closest('[data-x]') || step !== 1 || lock) return;
      lock = true; count++;
      SFX.jump(); restart(sp, 'showjump', 1000); restart($('#fenceEl'), 'slide', 1000);
      setTimeout(() => {
        lock = false; SFX.clap();
        if (count < 3) say(pick(['Hooray!', 'What a jump!', 'Wheee!']));
        else { step = 9; $('#fenceEl').classList.remove('on'); say(`Three perfect jumps! The crowd loves ${n}!`); setTimeout(outfitRound, 2600); }
      }, 1050);
    };
    function outfitRound() {
      setRound(2); step = 2;
      const e = S().equip, bits = [];
      if (e.mane) bits.push(`a beautiful ${e.mane} mane`);
      if (e.bow) bits.push('a pretty bow');
      if (e.saddle) bits.push('a smart saddle');
      if (S().prop) bits.push({ crown: 'a sparkly crown', party: 'a party hat', flowers: 'a flower crown', glasses: 'heart glasses' }[S().prop]);
      if (S().wear === 'raincoat') bits.push('a bright raincoat');
      const list = bits.length > 1 ? bits.slice(0, -1).join(', ') + ' and ' + bits[bits.length - 1] : bits[0];
      sp.classList.add('parade', 'running');
      say(`Last, the best outfit round! ${bits.length ? `The judge loves ${list}!` : `The judge says ${n} looks lovely just as ${n} is!`}`);
      setTimeout(() => { sp.classList.remove('parade', 'running'); SFX.clap(); ceremony(); }, 4200);
    }
    function ceremony() {
      setRound(3);
      const k = S().rosettes.length, title = TITLES[k % TITLES.length], first = S().showDay !== G().todayKey();
      S().rosettes.push({ c: k, t: title, d: G().todayKey() });
      if (S().rosettes.length > 40) S().rosettes.shift();
      S().showDay = G().todayKey(); G().cared();
      if (first) reward(3); else G().save();
      $('#showMsg').innerHTML = `<div class="roseBig">${ART.rosette(ROSE[k % ROSE.length])}</div>${first ? shoeRow(3) : ''}<button class="go pulse" data-x="close">${ICON.tick}</button>`;
      SFX.cheer(); setTimeout(SFX.clap, 400);
      say(`Hooray! ${n} wins the ${title} rosette! Every pony is a winner! It will go on the stable wall.`);
    }
    ov.onclick = e => { if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); G().renderStable(); } };
    groomRound();
  }

  // ---------- 3. Baby foal care ----------
  function foal() {
    const ov = overlay('foalOv'), fc = S().foalCare, today = G().todayKey();
    ov.innerHTML = `${homeBtn()}<button class="growRow" id="growRow"></button><div class="pbox foalBox" id="fPony"></div>
      <div class="fTiles"><button class="tile big" id="fBottle"><span class="ico">${ICON.bottle}</span><span class="word dark">bottle</span></button>
      <button class="tile big" id="fCuddle"><span class="ico">${ICON.cuddle}</span><span class="word dark">cuddle</span></button></div>`;
    const fp = $('#fPony');
    const size = () => { fp.style.setProperty('--grow', (0.72 + 0.04 * Math.min(7, fc.days)).toFixed(2)); };
    ponyBox(fp, G().friendLook()); size();
    const renderGrow = () => {
      $('#growRow').innerHTML = Array.from({ length: 7 }, (_, i) => `<span class="${i < fc.days ? '' : 'empty'}">${ICON.heart}</span>`).join('');
      $('#fBottle').classList.toggle('done', fc.fedDay === today); $('#fCuddle').classList.toggle('done', fc.cuddleDay === today);
      $('#fBottle').classList.toggle('glow', fc.fedDay !== today); $('#fCuddle').classList.toggle('glow', fc.cuddleDay !== today);
    };
    renderGrow();
    const grown = fc.days >= 7;
    say(grown ? `Your foal is all grown up into a young pony! You can still give cuddles.` : `Hello, little foal! Give the foal a bottle of milk and a big cuddle.`);
    let lastRub = 0, rubDist = 0, last = null;
    function checkGrow() {
      if (fc.fedDay === today && fc.cuddleDay === today && fc.lastDay !== today && fc.days < 7) {
        fc.lastDay = today; fc.days++; reward(2); G().cared();
        setTimeout(() => {
          size(); renderGrow(); SFX.cheer(); restart(fp, 'happy', 1000);
          if (fc.days >= 7) say(`Wow! Your foal has grown into a young pony! Thank you for taking such good care.`);
          else say(`Your foal grew a little bit bigger! Come back tomorrow for more milk and cuddles.`);
          ov.querySelector('.fTiles').insertAdjacentHTML('beforeend', `<div class="fShoes">${shoeRow(2)}</div>`);
        }, 1800);
      }
      G().save(); G().layout();
    }
    function cuddle() {
      SFX.aww(); heartsOn(ov, fp, 5); restart(fp, 'cuddle', 1200);
      if (fc.cuddleDay !== today) { fc.cuddleDay = today; say('Aww! The foal loves cuddles!'); renderGrow(); checkGrow(); }
    }
    ov.onclick = e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); G().renderStable(); G().layout(); return; }
      if (e.target.closest('#growRow')) { SFX.tap(); say(fc.days >= 7 ? 'All grown up!' : `Your foal has grown ${fc.days} ${fc.days === 1 ? 'time' : 'times'}. Seven hearts and it's a young pony!`); return; }
      if (e.target.closest('#fBottle')) {
        const b = $('#fBottle').getBoundingClientRect(), f = fp.getBoundingClientRect();
        const fl = document.createElement('div'); fl.className = 'dragging bottleFly'; fl.innerHTML = ICON.bottle;
        fl.style.left = b.left + b.width / 2 + 'px'; fl.style.top = b.top + b.height / 2 + 'px'; document.body.appendChild(fl);
        requestAnimationFrame(() => requestAnimationFrame(() => { fl.style.left = f.left + f.width * 0.97 + 'px'; fl.style.top = f.top + f.height * 0.4 + 'px'; fl.style.transform = 'rotate(-60deg)'; }));
        SFX.suck(); restart(fp.querySelector('.pony'), 'chew', 1800);
        setTimeout(() => { fl.remove(); heartsOn(ov, fp, 3); }, 1900);
        if (fc.fedDay !== today) { fc.fedDay = today; say('Glug glug! Yummy milk!'); setTimeout(() => { renderGrow(); checkGrow(); }, 1900); }
        else say('The foal is full! Thank you!');
        return;
      }
      if (e.target.closest('#fCuddle')) cuddle();
    };
    ov.onpointerdown = e => { if (e.target.closest('#fPony')) { last = { x: e.clientX, y: e.clientY }; if (Date.now() - lastRub > 1200) { lastRub = Date.now(); cuddle(); } } };
    ov.onpointermove = e => {
      if (!last || !e.buttons) return;
      rubDist += Math.hypot(e.clientX - last.x, e.clientY - last.y); last = { x: e.clientX, y: e.clientY };
      if (rubDist > 120) { rubDist = 0; heartsOn(ov, fp, 1); }
    };
  }

  // ---------- 4. Meadow trip ----------
  function meadow() {
    const se = G().seasonNow(), w = G().weatherNow();
    const ov = overlay('meadowOv', `m-${se} wx-${w}`);
    const got = { apple: 0, berry: 0, flower: 0 };
    const rnd = (a, b) => a + Math.random() * (b - a);
    const items = [];
    [[0.22, 0.2], [0.55, 0.15], [0.35, 0.42], [0.7, 0.38]].forEach(([x, y]) => items.push(['apple', 'tree', x, y]));
    const flowerSpots = shuffle([[0.36, 0.74], [0.5, 0.82], [0.62, 0.72], [0.74, 0.84], [0.88, 0.74], [0.44, 0.64], [0.94, 0.84]]).slice(0, se === 'winter' ? 3 : 6);
    ov.innerHTML = `${homeBtn()}<div class="hill h1"></div><div class="hill h2"></div>
      <div class="mTree" id="mTree">${ICON.tree.replace(/<g fill="#ef4444"[\s\S]*?<\/g>/, '')}</div>
      <div class="bush b1">${bush()}</div><div class="bush b2">${bush()}</div>
      ${se === 'autumn' ? `<div class="mPump p1">${ICON.pumpkin}</div><div class="mPump p2">${ICON.pumpkin}</div>` : ''}
      <div class="pbox mPony" id="mPony"></div>
      <div class="basket" id="basket"><span class="bk">${basketSvg()}</span><span class="cnt"><i>${ICON.apple}</i><b data-k="apple">0</b></span><span class="cnt"><i>${ICON.berry}</i><b data-k="berry">0</b></span><span class="cnt"><i>${ICON.flower}</i><b data-k="flower">0</b></span></div>
      <div class="wxLayer">${w === 'sun' ? '' : Array.from({ length: 40 }, () => `<i style="left:${rnd(0, 100)}%;animation-delay:${rnd(-3, 0)}s;animation-duration:${w === 'rain' ? rnd(0.6, 1) : rnd(3, 6)}s"></i>`).join('')}</div>`;
    ponyBox($('#mPony'), outdoorLook());
    const tree = $('#mTree');
    items.forEach(([k, , x, y]) => tree.insertAdjacentHTML('beforeend', `<button class="mItem apple" data-k="apple" style="left:${x * 100}%;top:${y * 100}%">${ICON.apple}</button>`));
    ov.querySelectorAll('.bush').forEach(b => [[0.2, 0.25], [0.55, 0.1], [0.4, 0.5]].forEach(([x, y]) => b.insertAdjacentHTML('beforeend', `<button class="mItem berry" data-k="berry" style="left:${x * 100}%;top:${y * 100}%">${ICON.berry}</button>`)));
    flowerSpots.forEach(([x, y]) => ov.insertAdjacentHTML('beforeend', `<button class="mItem flower" data-k="flower" style="left:${x * 100}%;top:${y * 100}%">${ICON.flower}</button>`));
    const total = ov.querySelectorAll('.mItem').length;
    say(`Welcome to the meadow! Tap the apples, berries and flowers to put them in the basket.`);
    ov.onclick = e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); goHome(); return; }
      const it = e.target.closest('.mItem');
      if (it) {
        const k = it.dataset.k, r = it.getBoundingClientRect(), b = $('#basket').getBoundingClientRect();
        it.remove(); SFX.pop(); got[k]++;
        const fl = document.createElement('div'); fl.className = 'dragging'; fl.innerHTML = ICON[k];
        fl.style.cssText += `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transition:left .6s ease-in,top .6s ease-in,transform .6s;`;
        document.body.appendChild(fl);
        requestAnimationFrame(() => requestAnimationFrame(() => { fl.style.left = b.left + 40 + 'px'; fl.style.top = b.top + 30 + 'px'; fl.style.transform = 'scale(.4)'; }));
        setTimeout(() => { fl.remove(); ov.querySelector(`.basket b[data-k="${k}"]`).textContent = got[k]; restart($('#basket'), 'bump', 400); }, 620);
        G().speakWord(k);
        if (got.apple + got.berry + got.flower === total) setTimeout(() => { SFX.cheer(); say('The basket is full! Tap the house to go home.'); ov.querySelector('[data-x]').classList.add('pulse'); }, 900);
        return;
      }
      if (e.target.closest('#mPony')) { SFX.neigh(); heartsOn(ov, $('#mPony'), 3); }
    };
    function goHome() {
      const n = got.apple + got.berry + got.flower, s = S();
      for (const k in got) s.bag[k] = (s.bag[k] || 0) + got[k];
      s.needs.fun = Math.min(100, s.needs.fun + 20); G().cared();
      if (n >= 3) reward(2); else G().save();
      close(ov); G().renderStable(); G().renderBar(); G().renderHUD();
      const parts = [];
      if (got.apple) parts.push(`${got.apple} ${got.apple === 1 ? 'apple' : 'apples'}`);
      if (got.berry) parts.push(`${got.berry} ${got.berry === 1 ? 'berry' : 'berries'}`);
      if (got.flower) parts.push(`${got.flower} ${got.flower === 1 ? 'flower' : 'flowers'}`);
      say(n ? `You brought home ${parts.join(', ')}! Apples and berries are in the food box, and the flowers make the stable pretty.` : 'What a lovely walk!');
    }
  }
  function bush() { return `<svg viewBox="0 0 100 60"><g fill="#22c55e" stroke="#166534" stroke-width="3"><circle cx="25" cy="38" r="22"/><circle cx="50" cy="28" r="26"/><circle cx="76" cy="38" r="22"/></g><rect x="4" y="44" width="92" height="16" fill="#22c55e"/></svg>`; }
  function basketSvg() { return `<svg viewBox="0 0 64 64"><path d="M14 26a18 18 0 0 1 36 0" fill="none" stroke="#92400e" stroke-width="5"/><path d="M6 26h52l-6 30H12z" fill="#d97706" stroke="#78350f" stroke-width="3" stroke-linejoin="round"/><path d="M10 36h44M12 46h40M22 26l2 30M32 26v30M42 26l-2 30" stroke="#78350f" stroke-width="2"/></svg>`; }

  // ---------- 6. Photo booth + album ----------
  const PROPS = [['none', 'none', null], ['crown', 'crown', 'crown'], ['hat', 'party', 'party'], ['flowers', 'flowercrown', 'flowers'], ['glasses', 'glasses', 'glasses']];
  const BACKS = [['stars', 'star'], ['hearts', 'heart'], ['meadow', 'tree'], ['rainbow', 'rainbow']];
  const DB = {
    db: null,
    open() {
      if (this.db) return Promise.resolve(this.db);
      return new Promise((res, rej) => {
        if (!window.indexedDB) return rej(new Error('no idb'));
        const r = indexedDB.open('ponyPals', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
        r.onsuccess = () => { this.db = r.result; res(this.db); };
        r.onerror = () => rej(r.error);
      });
    },
    async add(p) {
      try {
        const db = await this.open();
        await new Promise((res, rej) => { const t = db.transaction('photos', 'readwrite'); t.objectStore('photos').add(p); t.oncomplete = res; t.onerror = () => rej(t.error); });
        const all = await this.all();
        if (all.length > 40) await new Promise(res => { const t = db.transaction('photos', 'readwrite'); all.slice(40).forEach(x => t.objectStore('photos').delete(x.id)); t.oncomplete = res; t.onerror = res; });
      } catch (e) {
        const a = JSON.parse(localStorage.getItem('ponyPals.photos') || '[]'); a.unshift(Object.assign({ id: Date.now() }, p));
        while (a.length) { try { localStorage.setItem('ponyPals.photos', JSON.stringify(a)); break; } catch (_) { a.pop(); } }
      }
    },
    async all() {
      try {
        const db = await this.open();
        const list = await new Promise((res, rej) => { const t = db.transaction('photos', 'readonly'); const r = t.objectStore('photos').getAll(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
        return list.sort((a, b) => b.t - a.t);
      } catch (e) { return JSON.parse(localStorage.getItem('ponyPals.photos') || '[]'); }
    },
  };
  function backdropSVG(b) {
    if (b === 'hearts') { let h = '<rect width="480" height="360" fill="#fbcfe8"/>'; for (let i = 0; i < 18; i++) h += `<path d="${ART.HEART}" transform="translate(${(i * 97) % 470 - 10} ${(i * 61) % 330}) scale(${0.5 + (i % 3) * 0.2})" fill="${i % 2 ? '#f9a8d4' : '#fda4af'}"/>`; return h; }
    if (b === 'meadow') return '<rect width="480" height="360" fill="#bae6fd"/><circle cx="410" cy="60" r="36" fill="#fde047"/><path d="M0 250Q120 190 240 240T480 230V360H0Z" fill="#86efac"/><rect y="290" width="480" height="70" fill="#4ade80"/>' + [40, 110, 330, 420].map((x, i) => `<circle cx="${x}" cy="${320 + (i % 2) * 18}" r="9" fill="${i % 2 ? '#fff' : '#f472b6'}"/><circle cx="${x}" cy="${320 + (i % 2) * 18}" r="3.5" fill="#f59e0b"/>`).join('');
    if (b === 'rainbow') return '<rect width="480" height="360" fill="#e0f2fe"/>' + ['#ef4444', '#f59e0b', '#facc15', '#22c55e', '#3b82f6', '#a855f7'].map((c, i) => `<path d="M${-20 + i * 26} 380A${260 - i * 26} ${260 - i * 26} 0 0 1 ${500 - i * 26} 380" fill="none" stroke="${c}" stroke-width="26"/>`).join('');
    let st = '<defs><radialGradient id="bgS"><stop offset="0" stop-color="#4338ca"/><stop offset="1" stop-color="#1e1b4b"/></radialGradient></defs><rect width="480" height="360" fill="url(#bgS)"/>';
    for (let i = 0; i < 22; i++) st += `<path d="${ART.starPath((i * 83) % 470 + 5, (i * 47) % 340 + 10, 8 + (i % 3) * 4, 4)}" fill="#fde047" opacity="${0.5 + (i % 2) * 0.5}"/>`;
    return st;
  }
  function photoSVG() {
    const lk = G().look(), c = ART.COATS[lk.coat] || ART.COATS.brown;
    const cls = [lk.bow && 'has-bow', lk.saddle && 'has-saddle', lk.prop && 'p-' + lk.prop].filter(Boolean).join(' ');
    const mane = lk.mane ? ART.MANES[lk.mane] : c.mane;
    const pony = ART.ponySVG().replace('<svg class="pony"', '<svg class="pony" x="40" y="40" width="400" height="300"');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360"><defs>${ART.DEFS_INNER}</defs><style>${ART.PONY_CSS}</style>${backdropSVG(S().backdrop)}<g class="${cls}" style="--ol:#4a2e1d;--coat:${c.coat};--coatd:${c.coatd};--muz:${c.muz};--hoof:${c.hoof};--mane:${mane}">${pony}</g><rect x="6" y="6" width="468" height="348" rx="14" fill="none" stroke="#fff" stroke-width="12"/></svg>`;
  }
  function toImage(svg) {
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return new Promise(res => {
      const img = new Image();
      img.onload = () => {
        try { const cv = document.createElement('canvas'); cv.width = 480; cv.height = 360; cv.getContext('2d').drawImage(img, 0, 0, 480, 360); res(cv.toDataURL('image/jpeg', 0.78)); }
        catch (e) { res(url); }
      };
      img.onerror = () => res(url);
      img.src = url;
    });
  }
  function photo() {
    const ov = overlay('photoOv');
    ov.innerHTML = `${homeBtn()}<button class="topbtn right" id="albumBtn" aria-label="album">${ICON.album}</button>
      <div class="frame" id="frame"><div class="pbox" id="phPony"></div></div>
      <div class="pRow" id="propRow">${PROPS.map(([w, i, v]) => `<button class="tile small" data-prop="${v || ''}" data-w="${w}"><span class="ico">${ICON[i]}</span><span class="word dark">${w}</span></button>`).join('')}</div>
      <div class="pRow" id="backRow">${BACKS.map(([b, i]) => `<button class="swatch bd-${b}" data-bd="${b}" aria-label="${b}">${ICON[i]}</button>`).join('')}
        <button class="snap" id="snap" aria-label="camera">${ICON.camera}</button></div>
      <div class="flash" id="flash"></div>`;
    const render = () => {
      $('#frame').style.backgroundImage = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice">${backdropSVG(S().backdrop)}</svg>`)}")`;
      ponyBox($('#phPony'), G().look());
      ov.querySelectorAll('[data-prop]').forEach(b => b.classList.toggle('on', (b.dataset.prop || null) === (S().prop || null)));
      ov.querySelectorAll('[data-bd]').forEach(b => b.classList.toggle('on', b.dataset.bd === S().backdrop));
    };
    render();
    say('Photo time! Dress up your pony, pick a background, then tap the camera.');
    let snapping = false;
    ov.onclick = async e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); G().renderPony(); return; }
      if (e.target.closest('#albumBtn')) { SFX.tap(); G().speakWord('album'); album(); return; }
      const p = e.target.closest('[data-prop]');
      if (p) { S().prop = p.dataset.prop || null; G().save(); SFX.whoosh(); render(); restart($('#phPony'), 'happy', 800); G().speakWord(p.dataset.w); return; }
      const b = e.target.closest('[data-bd]');
      if (b) { S().backdrop = b.dataset.bd; G().save(); SFX.tap(); render(); G().speakWord(b.dataset.bd); return; }
      if (e.target.closest('#snap') && !snapping) {
        snapping = true;
        say('Smile! Say hay!');
        await wait(1300);
        SFX.shutter(); restart($('#flash'), 'go', 700);
        const src = await toImage(photoSVG());
        await DB.add({ t: Date.now(), src });
        const thumb = document.createElement('img'); thumb.className = 'thumbFly'; thumb.src = src; ov.appendChild(thumb);
        requestAnimationFrame(() => requestAnimationFrame(() => thumb.classList.add('go')));
        setTimeout(() => { thumb.remove(); restart($('#albumBtn'), 'bump', 400); }, 900);
        say(`Click! What a lovely photo of ${G().nm()}! It's in the album.`);
        snapping = false;
      }
    };
  }
  async function album() {
    const ov = overlay('albumOv');
    const list = await DB.all();
    ov.innerHTML = `${homeBtn()}<div class="sub">${ICON.album}</div><div class="albumGrid">${list.length ? list.map(p => `<button class="ph"><img src="${p.src}" alt=""></button>`).join('') : `<div class="emptyAlbum">${ICON.camera}</div>`}</div><div class="lightbox" id="lightbox"></div>`;
    if (!list.length) say('No photos yet. Tap the camera to take one!');
    ov.onclick = e => {
      if (e.target.closest('[data-x]')) { SFX.tap(); close(ov); return; }
      const lb = $('#lightbox');
      if (e.target.closest('#lightbox')) { lb.classList.remove('show'); return; }
      const ph = e.target.closest('.ph');
      if (ph) { SFX.tap(); lb.innerHTML = `<img src="${ph.querySelector('img').src}" alt="">`; lb.classList.add('show'); say(`${G().nm()} looks wonderful!`); }
    };
  }

  window.MORE = { init() {}, open, ridePicker, sayWeather, weatherCheck, perform, words, tricks, show, foal, meadow, photo, album, _DB: DB };
})();
