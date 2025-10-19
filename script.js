/* Malla interactiva Enfermería - FUNCIONAL y RESPONSIVA */
(function () {
  'use strict';

  // === (Queda igual tu configuración y datos de cursos...)
  // ... (Mantén aquí todo tu array de cursos y electivos igual) ...

  // (Persistencia, utilidades, indexadores, etc. igual...)

  // ===== Sidebar (móvil) =====
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburgerMenu');
  const overlay = document.getElementById('sidebarOverlay');
  const closeSidebarBtn = document.getElementById('closeSidebar');
  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    if (expanded) closeSidebar(); else openSidebar();
  });
  closeSidebarBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // ===== Tema/Sonido =====
  const themeToggle = document.getElementById('themeToggle');
  const soundToggle = document.getElementById('soundToggle');
  function applyTheme() {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  }
  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    applyTheme();
  });
  soundToggle.checked = !!state.sound;
  soundToggle.addEventListener('change', () => { state.sound = soundToggle.checked; saveState(); });

  // ==== Sonidos y confetti ====
  let audioCtx = null;
  function blip() {
    if (!state.sound) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(660, audioCtx.currentTime);
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      o.start(); o.stop(audioCtx.currentTime + 0.22);
    } catch (e) { }
  }
  let confettiInstance = null;
  function initConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (window.confetti && canvas) {
      confettiInstance = window.confetti.create(canvas, { resize: true, useWorker: true });
    }
  }
  function celebrate() {
    if (!confettiInstance) return;
    confettiInstance({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.35 },
      colors: ['#D4B8B4', '#A9B7AA', '#DBD2C9', '#B7B7BD', '#728A7A', '#A08887']
    });
  }

  // ==== Electivos/modal/Info ====
  // ... (Sin cambios, igual tu código para modales/infocurso/electivos)

  // ===== Renderización Correcta =====
  const container = document.getElementById('ciclosContainer');
  function renderElectivoExtra(c) {
    const sel = state.electivesSelection[c.code];
    return sel
      ? `Electivo: <strong>${sel.code}</strong> — ${sel.name} (${sel.credits} cr.)`
      : 'Haz clic para seleccionar electivo';
  }

  function makeCourseCard(c) {
    // Recrea siempre un div y asigna listeners después de armar el DOM:
    const st = getStatus(c.code);
    const div = document.createElement('div');
    div.className = 'course-card';
    div.dataset.code = c.code;
    div.dataset.status = st;
    div.innerHTML = `
      <div class="course-header">
        <span class="course-code">${c.code}</span>
        <span class="course-credits">${creditsOf(c)} cr.</span>
      </div>
      <div class="course-name">${c.name}</div>
      <div class="course-footer">
        <span class="badge ${st}">${statusText(st)}</span>
        <button class="approve-btn ${st === 'blocked' ? 'blocked' : (st === 'completed' ? 'completed' : '')}">
          ${st === 'completed' ? 'Desaprobar' : 'Aprobar'}
        </button>
      </div>
      ${c.code.startsWith('ELC') ? `<div class="course-extra">${renderElectivoExtra(c)}</div>` : ``}
    `;
    div.addEventListener('click', e => {
      if (e.target.closest('.approve-btn')) return;
      if (e.target.closest('.course-extra')) return;
      showCourseInfo(c.code);
    });
    const btnApprove = div.querySelector('.approve-btn');
    btnApprove.addEventListener('click', e => {
      e.stopPropagation();
      if (st === 'blocked') { showCourseInfo(c.code); return; }
      if (c.code.startsWith('ELC') && !state.electivesSelection[c.code]) {
        openElectivos(c.code); return;
      }
      toggleComplete(c.code);
    });
    if (c.code.startsWith('ELC')) {
      const extra = div.querySelector('.course-extra');
      extra?.addEventListener('click', e => { e.stopPropagation(); openElectivos(c.code); });
    }
    return div;
  }

  function makeGroupCard(title, subtitle, list) {
    const card = document.createElement('div');
    card.className = 'group-card';
    card.innerHTML = `
      <div class="group-header">
        <h4 class="group-title">${title}</h4>
        <p class="group-subtitle">${subtitle}</p>
      </div>
      <div class="group-body"></div>`;
    const body = card.querySelector('.group-body');
    list.forEach(c => body.appendChild(makeCourseCard(c))); // SOLO append, nunca innerHTML!
    return card;
  }

  function renderByCycles() {
    container.className = 'courses-grid view-ciclos';
    container.innerHTML = '';
    for (let cyc = 1; cyc <= 10; cyc++) {
      const list = courses.filter(c => c.cycle === cyc);
      const card = makeGroupCard(`${cyc}° Ciclo`, `${sumCredits(list)} créditos`, list);
      container.appendChild(card);
    }
  }
  function renderByYears() {
    container.className = 'courses-grid view-anos';
    container.innerHTML = '';
    for (let year = 1; year <= 5; year++) {
      const cycles = [year * 2 - 1, year * 2];
      const list = courses.filter(c => cycles.includes(c.cycle));
      const card = makeGroupCard(`Año ${year}`, `Ciclos ${cycles[0]}–${cycles[1]} • ${sumCredits(list)} créditos`, list);
      container.appendChild(card);
    }
  }
  function renderCompact() {
    container.className = 'courses-grid view-compacta';
    container.innerHTML = '';
    const card = makeGroupCard(`Todos los cursos`, `${courses.length} cursos`, courses);
    container.appendChild(card);
  }
  function renderGrid() {
    if (state.view === 'ciclos') renderByCycles();
    else if (state.view === 'anos') renderByYears();
    else renderCompact();
    applyFilters();
  }

  // ==== Resto igual (Filtros, búsqueda, estadísticas, chart, modals, eventos)====
  // ... Pega aquí igual todo el código de filtros, export/import, modales, estadísticas...

  // ==== Inicialización
  applyTheme();
  initConfetti();
  renderAll();
})();
