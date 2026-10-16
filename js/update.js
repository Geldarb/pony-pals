/* Pony Pals: grown-up "update" button. Fetches version.json fresh, activates any new service worker,
   clears old cached game files and reloads. It only touches Cache Storage: the save in localStorage
   and the photos in IndexedDB are never cleared. */
(function () {
  'use strict';
  const RUNNING = (document.querySelector('meta[name="build"]') || {}).content || '';
  const ICO = `<svg viewBox="0 0 64 64"><path d="M50 22A21 21 0 0 0 12 26" fill="none" stroke="#7c3aed" stroke-width="7" stroke-linecap="round"/><path d="M52 8v16H36z" fill="#7c3aed" stroke="#7c3aed" stroke-width="3" stroke-linejoin="round"/><path d="M14 42a21 21 0 0 0 38-4" fill="none" stroke="#ec4899" stroke-width="7" stroke-linecap="round"/><path d="M12 56V40h16z" fill="#ec4899" stroke="#ec4899" stroke-width="3" stroke-linejoin="round"/></svg>`;
  const $ = s => document.querySelector(s);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const say = (t, o) => { try { window.SND && SND.say(t, o); } catch (e) {} };
  let remote = null, busy = false;

  // strip the one-off ?refresh= marker so it never ends up in a bookmark / home-screen launch
  if (/[?&]refresh=/.test(location.search)) {
    const q = new URLSearchParams(location.search); q.delete('refresh');
    history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + location.hash);
  }

  async function latest() {
    const r = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error('version ' + r.status);
    return (await r.json()).build;
  }
  function waitInstalled(w) {
    return new Promise(res => {
      if (!w || w.state === 'installed' || w.state === 'activated' || w.state === 'redundant') return res();
      w.addEventListener('statechange', () => { if (w.state !== 'installing') res(); });
      setTimeout(res, 8000);
    });
  }
  async function swUpdate() {
    if (!('serviceWorker' in navigator)) return;
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return;
    try { await reg.update(); } catch (e) {}
    await waitInstalled(reg.installing);
    if (reg.waiting) { reg.waiting.postMessage('skipWaiting'); await waitInstalled(reg.waiting); await wait(300); }
  }
  async function clearOldCaches(keep) {
    if (!window.caches) return;
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k.startsWith('pony-pals') && k !== keep).map(k => caches.delete(k)));
  }
  function overlay(state) {
    let ov = $('#updOv');
    if (!ov) { ov = document.createElement('div'); ov.id = 'updOv'; document.body.appendChild(ov); }
    const tick = (window.ART && ART.ICON.tick) || '';
    const shoe = (window.ART && ART.ICON.shoe) || ICO;
    ov.className = 'show ' + state;
    ov.innerHTML = state === 'ok' ? `<div class="updTick">${tick}</div>` : `<div class="updSpin">${shoe}</div>`;
  }

  async function run() {
    if (busy) return; busy = true;
    const btn = $('#updBtn'); btn && btn.classList.remove('ready');
    try { window.PP && PP.speakWord ? PP.speakWord('update') : say('update'); } catch (e) {}
    overlay('spin');
    await wait(900);
    say('Checking for a new version. One moment!');
    let found = null;
    try { found = await latest(); } catch (e) { found = null; }
    const isNew = !!found && found !== RUNNING;
    try { await swUpdate(); } catch (e) {}
    try { await clearOldCaches(isNew ? found : null); } catch (e) {}
    try { window.PP && PP.save(); } catch (e) {}
    if (isNew) { say('Hooray! A new version! Updating now.'); await wait(2600); }
    else if (found) { overlay('ok'); say("You're up to date! Refreshing."); await wait(2400); }
    else { say('Refreshing.'); await wait(1500); } // offline: just reload from the saved copy
    location.replace(location.pathname + '?refresh=' + Date.now() + location.hash);
  }

  function init() {
    const b = $('#updBtn'); if (!b) return;
    b.innerHTML = ICO;
    b.addEventListener('click', run);
    // quiet check on launch: if a newer build is out, make the button glow for a grown-up
    setTimeout(async () => {
      try { remote = await latest(); if (remote && remote !== RUNNING) b.classList.add('ready'); } catch (e) {}
    }, 2500);
    if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) reg.addEventListener('updatefound', () => b.classList.add('ready'));
    }).catch(() => {});
  }
  window.UPDATE = { run, latest, RUNNING, get remote() { return remote; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
