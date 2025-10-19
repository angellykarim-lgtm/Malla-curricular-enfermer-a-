/* Malla interactiva Enfermería - FUNCIONAL */
(function() {
  'use strict';

  // ---- Constantes/estado ----
  const TOTAL_PROGRAM_CREDITS = 222;
  const STATE_KEY = 'malla_enfermeria_state_v1';

  // Aliases para prerequisitos mal tipeados
  const codeAliases = { 'EN82':'EN7082', 'EN83':'EN7083', 'EN84':'EN7084' };

  // Datos de cursos
  const courses = [
    // 1er CICLO
    { code:'AC4012', name:'INGLÉS I', credits:3, cycle:1, prereqs:[] },
    { code:'EN7011', name:'PROCESOS BIOLÓGICOS', credits:6, cycle:1, prereqs:[] },
    { code:'EN7012', name:'PRÁCTICAS DE ENFERMERÍA', credits:5, cycle:1, prereqs:[] },
    { code:'AC4011', name:'DESARROLLO HUMANO Y SOCIAL', credits:4, cycle:1, prereqs:[] },
    { code:'TF5012', name:'ESTRUCTURA Y FUNCIÓN DEL CUERPO HUMANO', credits:4, cycle:1, prereqs:[] },

    // 2do CICLO
    { code:'AC4021', name:'ESTILO DE VIDA, SALUD Y MEDIO AMBIENTE', credits:4, cycle:2, prereqs:[] },
    { code:'AC4022', name:'INGLÉS II', credits:2, cycle:2, prereqs:['AC4012'] },
    { code:'EN7021', name:'SISTEMA MUSCULOESQUELÉTICO', credits:3, cycle:2, prereqs:['TF5012'] },
    { code:'EN7022', name:'SISTEMA NERVIOSO Y ENDOCRINO', credits:5, cycle:2, prereqs:['TF5012'] },
    { code:'EN7023', name:'PRÁCTICAS DE ENFERMERÍA II', credits:5, cycle:2, prereqs:['EN7012'] },
    { code:'ND4021', name:'MECANISMO DE AGRESIÓN Y DEFENSA I', credits:4, cycle:2, prereqs:['EN7011'] },

    // 3er CICLO
    { code:'EN7031', name:'SISTEMA CARDIORESPIRATORIO', credits:5, cycle:3, prereqs:[] },
    { code:'EN7032', name:'SISTEMA TEGUMENTARIO', credits:3, cycle:3, prereqs:[] },
    { code:'EN7033', name:'PRÁCTICAS DE ENFERMERÍA III', credits:5, cycle:3, prereqs:['EN7023'] },
    { code:'EN7034', name:'BASES DE LA TERAPEÚTICA FARMACOLÓGICA', credits:4, cycle:3, prereqs:[] },
    { code:'ND4032', name:'MECANISMOS DE AGRESIÓN Y DEFENSA II', credits:4, cycle:3, prereqs:['ND4021'] },

    // 4to CICLO
    { code:'AC4041', name:'SALUD PÚBLICA Y SISTEMAS DE SALUD', credits:5, cycle:4, prereqs:['AC4021'] },
    { code:'EN7041', name:'SISTEMA URINARIO Y REPRODUCTIVO', credits:4, cycle:4, prereqs:['EN7031'] },
    { code:'EN7042', name:'SISTEMA DIGESTIVO', credits:4, cycle:4, prereqs:['EN7032'] },
    { code:'EN7043', name:'MECANISMO DE AGRESIÓN Y DEFENSA III', credits:4, cycle:4, prereqs:['ND4032'] },
    { code:'EN7044', name:'PRÁCTICAS DE ENFERMERÍA IV', credits:5, cycle:4, prereqs:['EN7033'] },

    // 5to CICLO
    { code:'AC4051', name:'PREVENCIÓN Y PROMOCIÓN DE LA SALUD', credits:5, cycle:5, prereqs:['AC4041'] },
    { code:'EN7051', name:'SALUD DEL NIÑO Y ADOLESCENTE', credits:7, cycle:5, prereqs:['EN7044'] },
    { code:'EN7052', name:'SALUD DE LA MUJER Y NEONATO', credits:7, cycle:5, prereqs:['EN7044'] },
    { code:'ELC01', name:'ELECTIVO I', credits:3, cycle:5, prereqs:[] },

    // 6to CICLO
    { code:'AC4061', name:'CIENCIA Y DESCUBRIMIENTO', credits:6, cycle:6, prereqs:[] },
    { code:'EN7061', name:'GESTIÓN CLÍNICA Y HOSPITALARIA', credits:4, cycle:6, prereqs:['EN7051'] },
    { code:'EN7062', name:'SALUD DEL ADULTO', credits:6, cycle:6, prereqs:['EN7052'] },
    { code:'ELC02', name:'ELECTIVO II', credits:3, cycle:6, prereqs:[] },

    // 7mo CICLO
    { code:'EN7071', name:'SALUD DEL ADULTO MAYOR', credits:7, cycle:7, prereqs:['EN7062'] },
    { code:'EN7072', name:'SALUD COMUNITARIA Y FAMILIAR', credits:5, cycle:7, prereqs:['EN7061'] },
    { code:'AC4063', name:'TENDENCIAS GLOBALES EN SALUD', credits:3, cycle:7, prereqs:[] },
    { code:'ELC03', name:'ELECTIVO III', credits:3, cycle:7, prereqs:[] },

    // 8vo CICLO
    { code:'EN7082', name:'SALUD MENTAL', credits:4, cycle:8, prereqs:['EN7072'] },
    { code:'EN7083', name:'CUIDADOS PALIATIVOS Y DEL FIN DE LA VIDA', credits:4, cycle:8, prereqs:['AC4051'] },
    { code:'EN7084', name:'URGENCIAS Y EMERGENCIAS', credits:5, cycle:8, prereqs:['EN7071'] },
    { code:'AC4064', name:'PROYECTOS DE INTERVENCIÓN EN SALUD', credits:3, cycle:8, prereqs:[] },

    // 9no CICLO
    { code:'EN7091', name:'PRÁCTICAS PRE-PROFESIONALES I', credits:14, cycle:9, prereqs:[
      'AC4011','AC4012','AC4021','AC4022','AC4041','AC4051','AC4061','ELC01','ELC02','ELC03',
      'EN7011','EN7012','EN7021','EN7022','EN7023','EN7031','EN7032','EN7033','EN7041','EN7042','EN7043','EN7044',
      'EN7051','EN7052','EN7061','EN7062','EN7071','EN7072','EN82','EN83','EN84','ND4021','ND4032','TF5012'
    ]},
    { code:'EN7092', name:'SEMINARIOS DE INTEGRACIÓN CLÍNICA I', credits:1, cycle:9, prereqs:['EN7081'] },
    { code:'EN7093', name:'SEMINARIO DE INVESTIGACIÓN', credits:3, cycle:9, prereqs:['AC4061'] },

    // 10mo CICLO
    { code:'EN7101', name:'PRÁCTICAS PRE-PROFESIONALES II', credits:14, cycle:10, prereqs:['EN7091'] },
    { code:'EN7102', name:'SEMINARIOS DE INTEGRACIÓN CLÍNICA II', credits:1, cycle:10, prereqs:['EN7092'] },
    { code:'EN7103', name:'TRABAJO DE INVESTIGACIÓN', credits:3, cycle:10, prereqs:['EN7093'] },
  ];

  // Electivos ofertados
  const electivosPool = [
    { code:'AC4E01', name:'EDUCACIÓN, DERECHOS Y AUTONOMÍA DE LAS PERSONAS CON DISCAPACIDAD', credits:2 },
    { code:'LC5E01', name:'SALUD AMBIENTAL Y URBANA', credits:3 },
    { code:'MH3E01', name:'DETERMINANTES SOCIALES DE SALUD Y CONDUCTAS DE SALUD', credits:3 },
    { code:'MH3E02', name:'ANTROPOLOGÍA MÉDICA: CULTURA Y SALUD', credits:3 },
    { code:'ND4E01', name:'LA DIETA OCCIDENTAL', credits:3 },
    { code:'OD5E01', name:'MÉTODOS DE INVESTIGACIÓN PARA PROFESIONALES DE SALUD', credits:3 },
    { code:'PS4E01', name:'MANEJO DEL ESTRÉS PARA EL BIENESTAR', credits:3 },
    { code:'PS4E02', name:'FUNDAMENTOS DEL BIENESTAR', credits:3 },
    { code:'TF5E01', name:'IMPACTO DE LA ACTIVIDAD FÍSICA EN LA SALUD Y EL BIENESTAR', credits:3 },
  ];

  // Normalizar prerequisitos
  const codeSet = new Set(courses.map(c => c.code));
  courses.forEach(c => {
    c.prereqs = (c.prereqs||[]).map(p => codeAliases[p] || p).filter(p => codeSet.has(p));
  });

  // ---- Persistencia ----
  const defaultState = {
    completed: [],
    electivesSelection: { ELC01:null, ELC02:null, ELC03:null },
    theme: 'light',
    sound: false,
    filter: 'todos',
    view: 'ciclos'
  };
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(defaultState),
        ...parsed,
        electivesSelection: { ...defaultState.electivesSelection, ...(parsed.electivesSelection||{}) }
      };
    } catch { return structuredClone(defaultState); }
  }
  function saveState() { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }

  // ---- Indexadores ----
  const byCode = new Map(courses.map(c => [c.code, c]));
  const dependents = {};
  courses.forEach(c => c.prereqs.forEach(p => (dependents[p] ??= []).push(c.code)));

  // ---- Utilidades ----
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  function getStatus(code) {
    if (state.completed.includes(code)) return 'completed';
    const c = byCode.get(code);
    if (!c) return 'blocked';
    if (!c.prereqs?.length) return 'available';
    return c.prereqs.every(p => state.completed.includes(p)) ? 'available' : 'blocked';
  }

  function statusText(st) {
    return st === 'completed' ? 'Completado' : st === 'available' ? 'Disponible' : 'Bloqueado';
  }

  function creditsOf(course) {
    if (!course) return 0;
    if (!course.code.startsWith('ELC')) return course.credits ?? 0;
    const sel = state.electivesSelection[course.code];
    return sel?.credits ?? course.credits ?? 0;
  }

  function sumCredits(list) { return list.reduce((a,c)=> a + creditsOf(c), 0); }

  function toggleComplete(code) {
    const idx = state.completed.indexOf(code);
    if (idx >= 0) state.completed.splice(idx,1);
    else { state.completed.push(code); celebrate(); blip(); }
    saveState();
    renderAll();
  }

  // ---- Sidebar (móvil) ----
  const sidebar = $('#sidebar');
  const hamburger = $('#hamburgerMenu');
  const overlay = $('#sidebarOverlay');
  const closeSidebarBtn = $('#closeSidebar');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    if (expanded) closeSidebar(); else openSidebar();
  });
  closeSidebarBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // ---- Tema/Sonido ----
  const themeToggle = $('#themeToggle');
  const soundToggle = $('#soundToggle');
  
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
  soundToggle.addEventListener('change', () => { 
    state.sound = soundToggle.checked; 
    saveState(); 
  });

  // ---- Sonidos y confetti ----
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
    } catch(e) { console.warn('Audio error:', e); }
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
      colors: ['#D4B8B4','#A9B7AA','#DBD2C9','#B7B7BD','#728A7A','#A08887']
    });
  }

  // ---- Electivos ----
  const electivosModal = $('#electivosModal');
  const electivosGrid = $('#electivosGrid');
  const closeElectivosBtn = $('#closeElectivos');
  
  function toggleModal(modal, show) {
    modal.classList.toggle('show', !!show);
    modal.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  closeElectivosBtn.addEventListener('click', () => toggleModal(electivosModal,false));
  electivosModal.addEventListener('click', e => { 
    if (e.target === electivosModal) toggleModal(electivosModal,false); 
  });

  function openElectivos(forCode) {
    electivosGrid.innerHTML = '';
    electivosPool.forEach(opt => {
      const div = document.createElement('div');
      div.className = 'electivo-option';
      div.innerHTML = `<strong>${opt.code}</strong><br>${opt.name}<br><small>${opt.credits} cr.</small>`;
      div.addEventListener('click', () => {
        state.electivesSelection[forCode] = { ...opt };
        saveState();
        toggleModal(electivosModal,false);
        renderAll();
      });
      electivosGrid.appendChild(div);
    });
    toggleModal(electivosModal,true);
  }

  // ---- Info de curso ----
  const infoModal = $('#courseInfoModal');
  const infoTitle = $('#courseInfoTitle');
  const infoBody = $('#courseInfoBody');
  const closeInfoBtn = $('#closeCourseInfo');
  
  closeInfoBtn.addEventListener('click', () => toggleModal(infoModal,false));
  infoModal.addEventListener('click', e => { 
    if (e.target === infoModal) toggleModal(infoModal,false); 
  });

  function showCourseInfo(code) {
    const c = byCode.get(code);
    if (!c) return;
    infoTitle.textContent = `${c.code} — ${c.name}`;
    const prereqNames = (c.prereqs||[]).map(p => `${p} — ${byCode.get(p)?.name||''}`).join('<br>') || 'Ninguno';
    const depend = (dependents[c.code]||[]).map(d => `${d} — ${byCode.get(d)?.name||''}`).join('<br>') || 'Ninguno';
    const sel = state.electivesSelection[c.code];
    const extraElectivo = c.code.startsWith('ELC') 
      ? `<p><strong>Electivo seleccionado:</strong> ${sel ? `${sel.code} — ${sel.name} (${sel.credits} cr.)` : 'Ninguno'}</p>` 
      : '';
    infoBody.innerHTML = `
      <p><strong>Ciclo:</strong> ${c.cycle}</p>
      <p><strong>Créditos:</strong> ${creditsOf(c)}</p>
      <p><strong>Estado:</strong> ${statusText(getStatus(c.code))}</p>
      <p><strong>Pre-requisitos:</strong><br>${prereqNames}</p>
      <p><strong>Desbloquea:</strong><br>${depend}</p>
      ${extraElectivo}
    `;
    toggleModal(infoModal,true);
  }

  // ---- Render de tarjetas ----
  const container = $('#ciclosContainer');

  function renderElectivoExtra(c) {
    const sel = state.electivesSelection[c.code];
    return sel 
      ? `Electivo: <strong>${sel.code}</strong> — ${sel.name} (${sel.credits} cr.)` 
      : 'Haz clic para seleccionar electivo';
  }

  function makeCourseCard(c) {
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
    
    // Click en tarjeta abre info
    div.addEventListener('click', e => {
      if (e.target.closest('.approve-btn')) return;
      if (e.target.closest('.course-extra')) return;
      showCourseInfo(c.code);
    });
    
    // Botón aprobar
    const btnApprove = div.querySelector('.approve-btn');
    btnApprove.addEventListener('click', e => {
      e.stopPropagation();
      if (st === 'blocked') { 
        showCourseInfo(c.code); 
        return; 
      }
      if (c.code.startsWith('ELC') && !state.electivesSelection[c.code]) {
        openElectivos(c.code);
        return;
      }
      toggleComplete(c.code);
    });
    
    // Click en extra electivo abre modal
    if (c.code.startsWith('ELC')) {
      const extra = div.querySelector('.course-extra');
      extra?.addEventListener('click', e => { 
        e.stopPropagation(); 
        openElectivos(c.code); 
      });
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
      <div class="group-body"></div>
    `;
    const body = card.querySelector('.group-body');
    list.forEach(c => body.appendChild(makeCourseCard(c)));
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

  // ---- Filtros y búsqueda ----
  const searchInput = $('#searchInput');
  const filterBtns = $$('.filter-btn');
  const viewBtns = $$('.view-btn');

  filterBtns.forEach(b => {
    if (b.dataset.filter === state.filter) b.classList.add('active');
    b.addEventListener('click', () => {
      filterBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.filter = b.dataset.filter;
      saveState();
      applyFilters();
    });
  });

  viewBtns.forEach(b => {
    if (b.dataset.view === state.view) {
      b.classList.add('active');
      b.setAttribute('aria-pressed','true');
    }
    b.addEventListener('click', () => {
      viewBtns.forEach(x => { 
        x.classList.remove('active'); 
        x.setAttribute('aria-pressed','false'); 
      });
      b.classList.add('active');
      b.setAttribute('aria-pressed','true');
      state.view = b.dataset.view;
      saveState();
      renderGrid();
    });
  });

  searchInput.addEventListener('input', applyFilters);

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    $$('.course-card').forEach(card => {
      const code = card.dataset.code;
      const c = byCode.get(code);
      const status = getStatus(code);
      let vis = true;
      
      if (state.filter === 'completados' && status !== 'completed') vis = false;
      if (state.filter === 'disponibles' && status !== 'available') vis = false;
      if (state.filter === 'bloqueados' && status !== 'blocked') vis = false;
      
      if (q) {
        const hay = c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
        if (!hay) vis = false;
      }
      
      card.style.display = vis ? '' : 'none';
      
      // Actualizar badge y botón
      const badge = card.querySelector('.badge');
      badge.className = `badge ${status}`;
      badge.textContent = statusText(status);
      
      const btn = card.querySelector('.approve-btn');
      btn.classList.toggle('blocked', status === 'blocked');
      btn.classList.toggle('completed', status === 'completed');
      btn.textContent = status === 'completed' ? 'Desaprobar' : 'Aprobar';
      
      if (code.startsWith('ELC')) {
        const extra = card.querySelector('.course-extra');
        if (extra) extra.innerHTML = renderElectivoExtra(c);
      }
    });
    updateHeader();
  }

  // ---- Estadísticas ----
  const totalCreditsEl = $('#totalCredits');
  const completedCountEl = $('#completedCount');
  const totalCountEl = $('#totalCount');
  const progressPercentEl = $('#progressPercent');
  const progressBarEl = $('#progressBar');
  const yearProgressEl = $('#yearProgress');

  function updateHeader() {
    totalCountEl.textContent = String(courses.length);
    const completedCourses = state.completed.length;
    const completedCredits = state.completed.reduce((a,code)=> a + creditsOf(byCode.get(code)), 0);
    const pct = Math.round((completedCredits / TOTAL_PROGRAM_CREDITS) * 100);
    totalCreditsEl.textContent = String(completedCredits);
    completedCountEl.textContent = String(completedCourses);
    progressPercentEl.textContent = String(isFinite(pct) ? pct : 0);
    progressBarEl.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    renderYearChips();
  }

  function renderYearChips() {
    yearProgressEl.innerHTML = '';
    for (let year=1; year<=5; year++) {
      const cycles = [year*2-1, year*2];
      const list = courses.filter(c => cycles.includes(c.cycle));
      const creditsTotal = sumCredits(list);
      const creditsDone = list.filter(c => state.completed.includes(c.code)).reduce((a,c)=> a + creditsOf(c), 0);
      const pct = creditsTotal ? Math.round((creditsDone/creditsTotal)*100) : 0;
      const chip = document.createElement('div');
      chip.className = 'year-chip';
      chip.innerHTML = `
        <div class="year-chip-title">Año ${year} — ${creditsDone}/${creditsTotal} cr.</div>
        <div class="year-chip-bar"><div class="year-chip-fill" style="width:${pct}%"></div></div>
      `;
      yearProgressEl.appendChild(chip);
    }
  }

  // ---- Exportar/Importar/Reset ----
  $('#exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'progreso-malla.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  const importFile = $('#importFile');
  const importLabel = $('#importBtn');
  importLabel.addEventListener('click', () => importFile.click());
  
  importFile.addEventListener('change', async () => {
    const f = importFile.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      const obj = JSON.parse(text);
      state = { 
        ...defaultState, 
        ...obj, 
        electivesSelection: { ...defaultState.electivesSelection, ...(obj.electivesSelection||{}) } 
      };
      saveState();
      soundToggle.checked = !!state.sound;
      applyTheme();
      renderAll();
      alert('Progreso importado correctamente');
    } catch(e) { 
      alert('Archivo inválido'); 
      console.error(e);
    }
    importFile.value = '';
  });

  $('#resetBtn').addEventListener('click', () => {
    if (!confirm('¿Reiniciar todo el progreso?')) return;
    state = structuredClone(defaultState);
    saveState();
    soundToggle.checked = false;
    applyTheme();
    renderAll();
  });

  // ---- Chart.js ----
  let chart = null;
  function buildChart() {
    const canvas = document.getElementById('creditsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const labels = Array.from({length:10}, (_,i)=>`${i+1}°`);
    const data = labels.map((_,i)=> sumCredits(courses.filter(c=>c.cycle===i+1)));
    const colors = ['#A9B7AA','#D4B8B4','#DBD2C9','#B7B7BD','#728A7A','#A08887','#DDD0C8','#9ea3b0','#8fa59c','#c9b8b2'];
    
    if (chart) chart.destroy();
    
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ 
          label: 'Créditos', 
          data, 
          backgroundColor: colors, 
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { 
          y: { 
            beginAtZero: true, 
            ticks: { precision: 0 } 
          } 
        },
        plugins: { 
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} créditos`
            }
          }
        }
      }
    });
  }

  // ---- Render completo ----
  function renderAll() {
    renderGrid();
    updateHeader();
    if (window.Chart) buildChart();
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    initConfetti();
    renderAll();
  });

  // Por si el script se carga después del DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyTheme();
      initConfetti();
      renderAll();
    });
  } else {
    applyTheme();
    initConfetti();
    renderAll();
  }

})();
