/* ═══════════════════════════════════════════
   Para vos, Vicky ❤️  —  lógica
   ═══════════════════════════════════════════ */
(function () {
  'use strict';
  var D = window.DATA;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function el(id) { return document.getElementById(id); }

  // celda de foto con lazy-load suave; devuelve nodo y registra en la galería lb
  function makePhoto(item, className, lbGroup) {
    var fig = document.createElement('div');
    fig.className = className;
    var img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = item.thumb;
    img.alt = 'Tommy y Vicky · ' + item.dateLabel;
    img.addEventListener('load', function () { img.classList.add('loaded'); });
    if (img.complete) img.classList.add('loaded');
    fig.appendChild(img);
    var idx = lbGroup.push({ full: item.full, cap: item.dateLabel }) - 1;
    fig.addEventListener('click', function () { openLightbox(lbGroup, idx); });
    return fig;
  }

  /* ---------- HERO / BREAK ---------- */
  el('heroImg').src = D.hero.full;
  el('heroImg').alt = 'Tommy y Vicky · ' + D.hero.dateLabel;
  el('breakImg').src = D.midbreak.full;
  el('breakImg').alt = 'Tommy y Vicky · ' + D.midbreak.dateLabel;

  /* ---------- FAVORITAS (destacadas menos hero y break) ---------- */
  var favGroup = [];
  var favsGrid = el('favsGrid');
  D.destacadas.forEach(function (it) {
    if (it.full === D.hero.full || it.full === D.midbreak.full) return;
    favsGrid.appendChild(makePhoto(it, 'ph', favGroup));
  });

  /* ---------- TIMELINE (agrupada por mes) ---------- */
  var tlGroup = [];
  var track = el('timelineTrack');
  var lastMonth = null;
  var sideToggle = 0;
  D.timeline.forEach(function (it) {
    if (it.month !== lastMonth) {
      lastMonth = it.month;
      var m = document.createElement('div');
      m.className = 'tl-month reveal';
      m.textContent = it.month;
      track.appendChild(m);
    }
    var item = document.createElement('div');
    item.className = 'tl-item reveal ' + (sideToggle % 2 === 0 ? 'tl-item--left' : 'tl-item--right');
    sideToggle++;

    var card = document.createElement('div');
    card.className = 'tl-card';
    var img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = it.thumb;
    img.alt = 'Tommy y Vicky · ' + it.dateLabel;
    card.appendChild(img);

    var date = document.createElement('p');
    date.className = 'tl-date';
    date.textContent = it.dateLabel;

    var idx = tlGroup.push({ full: it.full, cap: it.dateLabel }) - 1;
    card.addEventListener('click', function () { openLightbox(tlGroup, idx); });

    item.appendChild(card);
    item.appendChild(date);
    track.appendChild(item);
  });

  /* ---------- GALERÍAS vicky / tommy ---------- */
  var vickyGroup = [];
  var vg = el('vickyGrid');
  D.vicky.forEach(function (it) { vg.appendChild(makePhoto(it, 'ph', vickyGroup)); });

  var tommyGroup = [];
  var tg = el('tommyGrid');
  D.tommy.forEach(function (it) { tg.appendChild(makePhoto(it, 'ph', tommyGroup)); });

  /* ---------- REVEAL + PARALLAX (un solo handler de scroll) ---------- */
  var revealPending = [];
  function checkReveals() {
    var vh = window.innerHeight;
    for (var i = revealPending.length - 1; i >= 0; i--) {
      var n = revealPending[i];
      var r = n.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) {
        n.classList.add('in');
        revealPending.splice(i, 1);
      }
    }
  }
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (reduce) { items.forEach(function (n) { n.classList.add('in'); }); return; }
    revealPending = items;
    checkReveals(); // revela lo que ya está en pantalla
  }

  function initScroll() {
    var heroImg = el('heroImg');
    var breakImg = el('breakImg');
    var breakSec = el('break');
    var ticking = false;
    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (!reduce) {
        heroImg.style.transform = 'translateY(' + (y * 0.18) + 'px) scale(1.08)';
        if (breakSec) {
          var rect = breakSec.getBoundingClientRect();
          var prog = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          prog = Math.max(0, Math.min(1, prog));
          breakImg.style.transform = 'translateY(' + ((prog - 0.5) * 40) + 'px) scale(1.12)';
        }
      }
      if (revealPending.length) checkReveals();
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------- CONTADOR ---------- */
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function initCountdown() {
    var reunion = new Date(D.meta.reunion + 'T00:00:00'); // hora local del teléfono
    var dayAfter = new Date(reunion.getTime() + 24 * 3600 * 1000);
    var first = new Date(D.meta.firstDate + 'T00:00:00');
    var section = el('countdown');
    var clock = el('cdClock');
    var label = el('cdLabel');
    var sub = el('cdSub');
    var since = el('cdSince');

    function tick() {
      var now = new Date();

      // días desde la primera foto
      var d0 = Math.floor((now - first) / 86400000);
      since.textContent = d0 + ' días desde nuestra primera foto juntos · 19 de agosto de 2025';

      if (now >= dayAfter) {
        section.classList.add('is-today');
        clock.innerHTML = '<p class="countdown__today">Y por fin,<br>juntos de nuevo ❤</p>';
        label.textContent = '';
        sub.textContent = '';
        return true;
      }
      if (now >= reunion) {
        section.classList.add('is-today');
        clock.innerHTML = '<p class="countdown__today">¡Hoy nos vemos! ❤</p>';
        label.textContent = 'Por fin llegó el día';
        sub.textContent = 'Corré a abrazarme.';
        return true;
      }

      var diff = reunion - now;
      var days = Math.floor(diff / 86400000);
      var hrs = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);
      el('cdDays').textContent = days;
      el('cdHours').textContent = two(hrs);
      el('cdMins').textContent = two(mins);
      el('cdSecs').textContent = two(secs);
      return false;
    }

    if (!tick()) {
      setInterval(tick, 1000);
    }
  }

  /* ---------- LIGHTBOX ---------- */
  var lb = el('lightbox'), lbImg = el('lbImg'), lbCap = el('lbCap');
  var curGroup = null, curIdx = 0;
  function openLightbox(group, idx) {
    curGroup = group; curIdx = idx;
    showLb();
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function showLb() {
    var it = curGroup[curIdx];
    lbImg.src = it.full;
    lbImg.alt = 'Tommy y Vicky · ' + it.cap;
    lbCap.textContent = it.cap;
  }
  function closeLb() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  function nav(dir) {
    if (!curGroup) return;
    curIdx = (curIdx + dir + curGroup.length) % curGroup.length;
    showLb();
  }
  el('lbClose').addEventListener('click', closeLb);
  el('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); nav(-1); });
  el('lbNext').addEventListener('click', function (e) { e.stopPropagation(); nav(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') nav(-1);
    else if (e.key === 'ArrowRight') nav(1);
  });
  // swipe en móvil
  var tx = 0;
  lb.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) nav(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------- WELCOME GATE ---------- */
  function enterSite() {
    var welcome = el('welcome');
    var site = el('site');
    welcome.classList.add('is-hidden');
    site.classList.add('is-visible');
    site.setAttribute('aria-hidden', 'false');
    window.scrollTo(0, 0);
    checkReveals(); // asegura que el hero aparezca al entrar
  }
  el('openBtn').addEventListener('click', enterSite);

  /* ---------- INIT ---------- */
  initReveal();
  initScroll();
  initCountdown();
})();
