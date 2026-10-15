/* Sounds are generated with WebAudio (no files), voice uses the Web Speech API. */
(function () {
  'use strict';
  let ctx = null, master = null, enabled = true;
  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function unlock() {
    const c = ensure();
    if (!c) return;
    try { const b = c.createBuffer(1, 1, 22050); const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } catch (e) {}
  }
  function tone(freq, dur, o) {
    o = o || {};
    if (!enabled) return;
    const c = ensure(); if (!c) return;
    const t = c.currentTime + (o.delay || 0);
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t + dur);
    const v = o.vol == null ? 0.3 : o.vol;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + (o.attack || 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.05);
    return { osc, g, t };
  }
  let noiseBuf = null;
  function noise(dur, o) {
    o = o || {};
    if (!enabled) return;
    const c = ensure(); if (!c) return;
    if (!noiseBuf) {
      noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t = c.currentTime + (o.delay || 0);
    const src = c.createBufferSource(); src.buffer = noiseBuf;
    const f = c.createBiquadFilter(); f.type = o.ftype || 'bandpass'; f.frequency.value = o.freq || 2000; f.Q.value = o.q || 1;
    const g = c.createGain();
    g.gain.setValueAtTime(o.vol || 0.3, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.02);
  }
  const SFX = {
    tap() { tone(660, 0.08, { vol: 0.15, type: 'triangle' }); },
    pop() { tone(320, 0.12, { slideTo: 900, vol: 0.25 }); },
    ding() { tone(1046, 0.35, { vol: 0.2, type: 'triangle' }); tone(1568, 0.4, { vol: 0.15, delay: 0.08, type: 'triangle' }); },
    crunch() { for (let i = 0; i < 5; i++) noise(0.07, { delay: i * 0.17, freq: 1800 + Math.random() * 1500, q: 0.8, vol: 0.5 }); },
    scrub() { noise(0.08, { freq: 4000, ftype: 'highpass', vol: 0.12 }); },
    sparkle() { [1319, 1568, 1976, 2637, 3136].forEach((f, i) => tone(f, 0.25, { delay: i * 0.07, vol: 0.12, type: 'triangle' })); },
    cheer() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.3, { delay: i * 0.1, vol: 0.18, type: 'triangle' })); },
    jump() { tone(280, 0.28, { slideTo: 760, vol: 0.2, type: 'square' }); },
    boing() { tone(180, 0.3, { slideTo: 420, vol: 0.2 }); tone(420, 0.2, { slideTo: 200, vol: 0.15, delay: 0.25 }); },
    whoosh() { noise(0.4, { freq: 800, q: 0.5, vol: 0.25 }); },
    click() { tone(1400, 0.05, { vol: 0.15, type: 'square' }); },
    rumble() {
      if (!enabled) return; const r = tone(70, 0.9, { vol: 0.35, type: 'sine' });
      if (r) { const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 9; lg.gain.value = 25; lfo.connect(lg); lg.connect(r.osc.frequency); lfo.start(r.t); lfo.stop(r.t + 1); }
    },
    neigh() {
      if (!enabled) return; const c = ensure(); if (!c) return;
      const t = c.currentTime, osc = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
      const lfo = c.createOscillator(), lg = c.createGain();
      osc.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 1600;
      osc.frequency.setValueAtTime(500, t); osc.frequency.linearRampToValueAtTime(950, t + 0.15);
      osc.frequency.linearRampToValueAtTime(700, t + 0.6); osc.frequency.linearRampToValueAtTime(420, t + 0.95);
      lfo.frequency.value = 14; lg.gain.value = 60; lfo.connect(lg); lg.connect(osc.frequency);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.05);
      g.gain.setValueAtTime(0.18, t + 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
      osc.connect(f); f.connect(g); g.connect(master);
      osc.start(t); lfo.start(t); osc.stop(t + 1.05); lfo.stop(t + 1.05);
    },
    lullaby() {
      const notes = [659, 587, 523, 587, 659, 659, 659, 0, 587, 587, 587, 0, 659, 784, 784];
      notes.forEach((n, i) => { if (n) tone(n, 0.5, { delay: i * 0.32, vol: 0.12, type: 'triangle', attack: 0.04 }); });
    },
    clop() { tone(900, 0.04, { vol: 0.12, type: 'square' }); tone(700, 0.04, { vol: 0.1, type: 'square', delay: 0.09 }); },
  };

  // ----- Voice -----
  let voice = null, voiceOn = true;
  const hasSpeech = 'speechSynthesis' in window;
  function pickVoice() {
    if (!hasSpeech) return;
    const vs = speechSynthesis.getVoices();
    const gb = vs.filter(v => /en[-_]GB/i.test(v.lang));
    const prefer = ['Serena', 'Kate', 'Stephanie', 'Martha', 'Google UK English Female', 'Libby', 'Sonia', 'Female'];
    voice = null;
    for (const p of prefer) { voice = gb.find(v => v.name.indexOf(p) >= 0); if (voice) break; }
    if (!voice) voice = gb[0] || vs.find(v => /^en/i.test(v.lang)) || null;
  }
  if (hasSpeech) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  let sayTimer = 0;
  function say(text, o) {
    o = o || {};
    if (!hasSpeech || !voiceOn || !text) return;
    clearTimeout(sayTimer);
    const go = () => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-GB'; if (voice) u.voice = voice;
      u.rate = o.rate || 0.92; u.pitch = o.pitch || 1.15; u.volume = 1;
      speechSynthesis.speak(u);
    };
    if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); sayTimer = setTimeout(go, 80); } else go();
  }
  let unlocked = false;
  function unlockAll() {
    unlock();
    if (!unlocked && hasSpeech) {
      unlocked = true;
      try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {}
    }
  }
  window.SND = {
    SFX, say, unlock: unlockAll,
    set sound(v) { enabled = !!v; }, get sound() { return enabled; },
    set voice(v) { voiceOn = !!v; if (!v && hasSpeech) speechSynthesis.cancel(); }, get voice() { return voiceOn; },
  };
})();
