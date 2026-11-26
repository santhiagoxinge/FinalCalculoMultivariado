/* NeuroCode · controlador de la presentación (sin dependencias) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Datos reales del proyecto ---------- */
  const X = [0, 30, 60, 90, 120, 150, 180];
  const M = [718.681176, 751.736471, 790.022353, 954.597647, 1006.835294, 1121.297647, 1169.122353]; // medias por ángulo
  const W = 155637440.015059;   // SS dentro de cada ángulo (no depende de a, b)
  const K = 85;                 // ensayos por ángulo
  const A_OPT = 2.746737, B_OPT = 683.1213;
  const S = (a, b) => { let s = 0; for (let k = 0; k < 7; k++) { const e = M[k] - a * X[k] - b; s += e * e; } return W + K * s; };
  const S_MIN = S(A_OPT, B_OPT);
  const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  /* ---------- Estilo Beamer: el título de cada diapositiva va arriba (\frametitle) ---------- */
  $$('.slide .body').forEach(body => {
    const h = $('.head', body);
    if (h && body.firstElementChild !== h) body.prepend(h);
  });

  /* ---------- Controles visibles solo al mover el ratón ---------- */
  let uiT;
  const showUI = () => { document.body.classList.add('ui'); clearTimeout(uiT); uiT = setTimeout(() => document.body.classList.remove('ui'), 2500); };
  addEventListener('mousemove', showUI, { passive: true });
  addEventListener('touchstart', showUI, { passive: true });

  /* ---------- Controlador de diapositivas ---------- */
  class Deck {
    constructor() {
      this.slides = $$('.slide');
      this.i = 0;
      this.lock = 0;
      this.buildToc();
      this.bind();
      const h = parseInt(location.hash.slice(1), 10);
      this.go(Number.isFinite(h) ? h - 1 : 0, true);
    }
    go(n, instant) {
      n = Math.max(0, Math.min(this.slides.length - 1, n));
      const prev = this.slides[this.i];
      if (prev && prev !== this.slides[n]) { prev.classList.remove('active'); this.pauseMedia(prev); }
      this.i = n;
      const s = this.slides[n];
      s.classList.add('active');
      this.playMedia(s);
      $('#count').innerHTML = `<b>${String(n + 1).padStart(2, '0')}</b> / ${this.slides.length}`;
      const fl = $('#flNum'); if (fl) fl.textContent = `${n + 1} / ${this.slides.length}`;
      $('#progress').style.width = `${((n + 1) / this.slides.length) * 100}%`;
      document.documentElement.style.setProperty('--px', ((n / (this.slides.length - 1)) * 2 - 1).toFixed(3));
      history.replaceState(null, '', `#${n + 1}`);
      $$('#tocGrid button').forEach((b, k) => b.classList.toggle('cur', k === n));
      document.dispatchEvent(new CustomEvent('slidechange', { detail: { index: n, slide: s } }));
    }
    next() { this.go(this.i + 1); }
    prev() { this.go(this.i - 1); }
    playMedia(s) {
      $$('video', s).forEach(v => {
        const pane = v.closest('.tabpanes > .screen');
        if (!pane || pane.classList.contains('on')) { v.currentTime = 0; v.play().catch(() => {}); }
      });
    }
    pauseMedia(s) { $$('video', s).forEach(v => v.pause()); }
    buildToc() {
      const g = $('#tocGrid');
      this.slides.forEach((s, k) => {
        const b = document.createElement('button');
        b.innerHTML = `<span class="n">${String(k + 1).padStart(2, '0')} · ${s.dataset.who || ''}</span><span class="tt"></span><span class="s"></span>`;
        $('.tt', b).textContent = s.dataset.title || '';
        $('.s', b).textContent = s.dataset.sec || '';
        b.addEventListener('click', () => { this.toggle('#toc', false); this.go(k); });
        g.appendChild(b);
      });
    }
    toggle(sel, force) {
      const el = $(sel); const on = el.classList.toggle('open', force);
      if (sel === '#toc') $('#bToc').setAttribute('aria-pressed', on);
      return on;
    }
    full() {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen?.().catch(() => {});
    }
    bind() {
      $('#bPrev').onclick = () => this.prev();
      $('#bNext').onclick = () => this.next();
      $('#bToc').onclick = () => this.toggle('#toc');
      $('#bFull').onclick = () => this.full();
      $$('[data-prev]').forEach(b => b.addEventListener('click', () => this.prev()));
      $('#toc').addEventListener('click', e => { if (e.target.id === 'toc') this.toggle('#toc', false); });

      document.addEventListener('keydown', e => {
        if (e.target.matches?.('input, textarea')) { if (e.key === 'Escape') e.target.blur(); return; }
        if ($('#lightbox').classList.contains('open')) { if (['Escape', ' ', 'Enter'].includes(e.key)) closeLightbox(); return; }
        const k = e.key;
        if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); this.next(); }
        else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); this.prev(); }
        else if (k === 'Home') this.go(0);
        else if (k === 'End') this.go(this.slides.length - 1);
        else if (k === 'g' || k === 'G') this.toggle('#toc');
        else if (k === 'f' || k === 'F') this.full();
        else if (k === 'Escape') { this.toggle('#toc', false); }
        hideHint();
      });

      // rueda del ratón (con freno para no saltar varias)
      addEventListener('wheel', e => {
        if (e.target.closest('.overlay, canvas')) return;
        const now = Date.now(); if (now - this.lock < 750 || Math.abs(e.deltaY) < 18) return;
        this.lock = now; e.deltaY > 0 ? this.next() : this.prev();
      }, { passive: true });

      // gesto táctil
      let tx = null, ty = null;
      addEventListener('touchstart', e => {
        if (e.target.closest('canvas, input, .overlay')) { tx = null; return; }
        tx = e.touches[0].clientX; ty = e.touches[0].clientY;
      }, { passive: true });
      addEventListener('touchend', e => {
        if (tx === null) return;
        const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? this.next() : this.prev();
        tx = null;
      }, { passive: true });
    }
  }

  /* ---------- Pista de teclado ---------- */
  let hintT = setTimeout(hideHint, 7000);
  function hideHint() { clearTimeout(hintT); $('#hint')?.classList.add('gone'); }

  /* ---------- Partículas ---------- */
  if (false) { // partículas desactivadas en el tema claro
    const d = $('#dust');
    for (let k = 0; k < 26; k++) {
      const i = document.createElement('i');
      i.style.left = `${Math.random() * 100}%`;
      i.style.animationDelay = `${-Math.random() * 16}s`;
      i.style.animationDuration = `${12 + Math.random() * 10}s`;
      if (Math.random() < .3) i.style.background = i.style.boxShadow = '';
      if (Math.random() < .25) { i.style.background = '#ffb45c'; i.style.boxShadow = '0 0 8px #ffb45c'; }
      d.appendChild(i);
    }
  }

  /* ---------- Pestañas ---------- */
  $$('[data-tabs]').forEach(tl => {
    const panes = $(`[data-panes="${tl.dataset.tabs}"]`);
    $$('button', tl).forEach(b => b.addEventListener('click', () => {
      $$('button', tl).forEach(x => x.setAttribute('aria-selected', x === b));
      $$(':scope > .screen', panes).forEach((p, k) => {
        const on = k === +b.dataset.t; p.classList.toggle('on', on);
        const v = $('video', p); if (v) { if (on) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause(); }
      });
    }));
  });

  /* ---------- Visor ampliado ---------- */
  const lb = $('#lightbox');
  function closeLightbox() { lb.classList.remove('open'); $('#lbFrame').innerHTML = ''; }
  lb.addEventListener('click', closeLightbox);
  $$('[data-zoom]').forEach(f => f.addEventListener('click', () => {
    const src = $('img, video', f); if (!src) return;
    const el = src.cloneNode(); if (el.tagName === 'VIDEO') { el.muted = true; el.loop = true; el.autoplay = true; el.playsInline = true; }
    $('#lbFrame').innerHTML = ''; $('#lbFrame').appendChild(el); lb.classList.add('open');
  }));

  /* ---------- Portada: R holográfica que recorre los 7 ángulos ---------- */
  (() => {
    const box = $('#holoR'); if (!box) return;
    const img = $('img', box), angs = [0, 30, 60, 90, 120, 150, 180];
    angs.forEach(a => { const p = new Image(); p.src = `../blender/renders/R/R_normal_${String(a).padStart(3, '0')}.png`; });
    let k = 0;
    setInterval(() => {
      if (!box.closest('.slide').classList.contains('active')) return;
      k = (k + 1) % angs.length; const a = angs[k];
      img.src = `../blender/renders/R/R_normal_${String(a).padStart(3, '0')}.png`;
      $('#holoT').textContent = `${a}°`;
      $('#holoY').textContent = `${Math.round(683.12 + 2.7467 * a)} ms`;
    }, reduce ? 4000 : 1800);
  })();

  /* ---------- Diapositiva 7: control del ángulo ---------- */
  (() => {
    const r = $('#rotTheta'); if (!r) return;
    const upd = () => {
      const t = +r.value;
      $('#rotR').style.transform = `rotate(${t}deg)`;
      $('#rotT').textContent = `${t}°`;
      $('#rotY').textContent = `${(683.12 + 2.7467 * t).toFixed(1)} ms`;
      const k = X.indexOf(t);
      $('#rotM').textContent = k >= 0 ? `media medida a ${t}°: ${M[k].toFixed(1)} ms` : 'mueve a un múltiplo de 30° para comparar con la media medida';
    };
    r.addEventListener('input', upd); upd();
  })();

  /* ---------- Diapositiva 4: laboratorio (a, b) → recta ---------- */
  (() => {
    const cv = $('#labMap'), svg = $('#labPlot'); if (!cv) return;
    const A0 = -1, A1 = 7, B0 = 300, B1 = 1100;
    const cands = { opt: [A_OPT, B_OPT], c1: [A_OPT + 1.5, B_OPT - 100], c2: [A_OPT - 1.0, B_OPT + 150], c3: [A_OPT + 3.0, B_OPT - 300] };
    let a = A_OPT + 1.5, b = B_OPT - 100, base = null, anim = null;
    const ctx = cv.getContext('2d', { willReadFrequently: true });

    function paintBase() {
      const dpr = Math.min(2, devicePixelRatio || 1);
      const w = Math.max(10, Math.round(cv.clientWidth * dpr)), h = Math.max(10, Math.round(cv.clientHeight * dpr));
      cv.width = w; cv.height = h;
      const img = ctx.createImageData(w, h), step = 2;
      // altura sobre el mínimo, normalizada con el valor más alto del mapa
      const vmax = Math.max(S(A0, B0), S(A0, B1), S(A1, B0), S(A1, B1)) - S_MIN;
      for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
        const av = A0 + (x / w) * (A1 - A0), bv = B1 - (y / h) * (B1 - B0);
        const t = Math.min(1, Math.sqrt((S(av, bv) - S_MIN) / vmax));  // 0 en el mínimo, distancia "elíptica"
        const band = (Math.pow(t, .6) * 9) % 1;                         // curvas de nivel
        const line = band < .045 && t > .01 ? 1 : 0;
        // del azul claro (fondo del valle) al papel (paredes altas)
        let r = 168 + (255 - 168) * t, g = 202 + (255 - 202) * t, bb = 218 + (255 - 218) * t;
        if (line) { r = r * .5 + 0; g = g * .5 + 106 * .5; bb = bb * .5 + 134 * .5; }
        for (let yy = 0; yy < step && y + yy < h; yy++) for (let xx = 0; xx < step && x + xx < w; xx++) {
          const p = ((y + yy) * w + x + xx) * 4; img.data[p] = r; img.data[p + 1] = g; img.data[p + 2] = bb; img.data[p + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      base = ctx.getImageData(0, 0, w, h);
    }
    const toPx = (av, bv) => [(av - A0) / (A1 - A0) * cv.width, (B1 - bv) / (B1 - B0) * cv.height];
    function dot(av, bv, col, r, ring) {
      const [x, y] = toPx(av, bv), d = Math.min(2, devicePixelRatio || 1);
      ctx.beginPath(); ctx.arc(x, y, r * d, 0, 7); ctx.fillStyle = col; ctx.fill();
      if (ring) { ctx.lineWidth = 2 * d; ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.stroke(); }
    }
    function drawMap() {
      if (!base) return;
      ctx.putImageData(base, 0, 0);
      const d = Math.min(2, devicePixelRatio || 1);
      ctx.font = `${11 * d}px "CMU Serif", serif`; ctx.fillStyle = 'rgba(20,33,61,.6)';
      ctx.fillText('a = −1', 6 * d, cv.height - 6 * d); ctx.textAlign = 'right'; ctx.fillText('a = 7', cv.width - 6 * d, cv.height - 6 * d);
      ctx.textAlign = 'left'; ctx.fillText('b = 1100', 6 * d, 14 * d);
      ['c1', 'c2', 'c3'].forEach(k => dot(...cands[k], 'rgba(20,33,61,.45)', 3.5));
      dot(A_OPT, B_OPT, '#c0392b', 6, true);
      const [x, y] = toPx(a, b);
      ctx.beginPath(); ctx.arc(x, y, 13 * d, 0, 7); ctx.strokeStyle = 'rgba(20,33,61,.35)'; ctx.lineWidth = 1.5 * d; ctx.stroke();
      dot(a, b, '#006a86', 7, true);
    }
    // gráfico de la recta (SVG en unidades del viewBox 640×400)
    const PX = x => 50 + x / 180 * 570, PY = y => 370 - (y - 450) / (1350 - 450) * 345;
    function drawPlot() {
      let h = '', txt = '';
      for (let y = 500; y <= 1300; y += 200) { h += `<line x1="50" x2="620" y1="${PY(y)}" y2="${PY(y)}" stroke="rgba(20,33,61,.08)"/>`; txt += `<text x="44" y="${PY(y) + 4}" fill="#8a93a2" font-size="12" text-anchor="end" font-family="CMU Serif">${y}</text>`; }
      X.forEach(x => txt += `<text x="${PX(x)}" y="392" fill="#8a93a2" font-size="12" text-anchor="middle" font-family="CMU Serif">${x}°</text>`);
      h += `<line x1="${PX(0)}" y1="${PY(B_OPT)}" x2="${PX(180)}" y2="${PY(B_OPT + 180 * A_OPT)}" stroke="#c0392b" stroke-opacity=".7" stroke-width="2" stroke-dasharray="6 6"/>`;
      X.forEach((x, k) => { const yh = a * x + b; h += `<line x1="${PX(x)}" x2="${PX(x)}" y1="${PY(M[k])}" y2="${PY(yh)}" stroke="#c0392b" stroke-opacity=".75" stroke-width="2"/>`; });
      const ya = b, yb = a * 180 + b;
      h += `<line x1="${PX(0)}" y1="${PY(ya)}" x2="${PX(180)}" y2="${PY(yb)}" stroke="#006a86" stroke-width="3"/>`;
      X.forEach((x, k) => h += `<circle cx="${PX(x)}" cy="${PY(M[k])}" r="6" fill="#fff" stroke="#1a1a1a" stroke-width="2"/>`);
      svg.innerHTML = `<defs><clipPath id="clp"><rect x="50" y="10" width="575" height="365"/></clipPath></defs><g clip-path="url(#clp)">${h}</g>${txt}`;
    }
    function readout() {
      const s = S(a, b);
      $('#labA').textContent = a.toFixed(3); $('#labB').textContent = b.toFixed(1);
      $('#labS').textContent = fmt(s);
      $('#labP').textContent = `+${((s / S_MIN - 1) * 100).toFixed(2)} %`;
    }
    const render = () => { drawMap(); drawPlot(); readout(); };
    function setFromEvent(e) {
      const r = cv.getBoundingClientRect();
      const fx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), fy = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      a = A0 + fx * (A1 - A0); b = B1 - fy * (B1 - B0); render();
    }
    let drag = false;
    cv.addEventListener('pointerdown', e => { cancelAnimationFrame(anim); drag = true; cv.setPointerCapture(e.pointerId); setFromEvent(e); });
    cv.addEventListener('pointermove', e => { if (drag) setFromEvent(e); });
    cv.addEventListener('pointerup', () => drag = false);
    $$('[data-go]').forEach(btn => btn.addEventListener('click', () => {
      const [ta, tb] = cands[btn.dataset.go], fa = a, fb = b, t0 = performance.now(), dur = reduce ? 1 : 900;
      cancelAnimationFrame(anim);
      const tick = now => { const u = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - u, 3); a = fa + (ta - fa) * e; b = fb + (tb - fb) * e; render(); if (u < 1) anim = requestAnimationFrame(tick); };
      anim = requestAnimationFrame(tick);
    }));
    const ro = new ResizeObserver(() => { if (cv.clientWidth) { paintBase(); render(); } });
    ro.observe(cv);
    document.addEventListener('slidechange', e => { if (e.detail.slide.contains(cv)) requestAnimationFrame(() => { paintBase(); render(); }); });
  })();

  window.deck = new Deck();
})();
