/* Malla interactiva Enfermería — Script completo (paleta alterna + switch ponderado) */
(function () {
  'use strict';

  // ===== Configuración general =====
  const TOTAL_PROGRAM_CREDITS = 222;
  const STATE_KEY = 'malla_enfermeria_state_v1';
  const codeAliases = { 'EN82':'EN7082', 'EN83':'EN7083', 'EN84':'EN7084' };

  // Línea de tiempo académica: inicio 2024-I; periodo actual 2025-II => ciclo 4
  const ACADEMIC_START = { year: 2024, term: 'I' };
  const CURRENT_PERIOD = { year: 2025, term: 'II' };
  const currentCycle = ((CURRENT_PERIOD.year - ACADEMIC_START.year) * 2) + (CURRENT_PERIOD.term === 'II' ? 2 : 1);

  // ===== Datos de cursos =====
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

    // 4to CICLO (Actual)
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

  // Normaliza prereqs
  const codeSet = new Set(courses.map(c=>c.code));
  courses.forEach(c=>{
    c.prereqs = (c.prereqs||[]).map(p=>codeAliases[p]||p).filter(p=>codeSet.has(p));
  });

  // ===== Estado y persistencia =====
  const defaultState = {
    completed: [],
    electivesSelection: { ELC01:null, ELC02:null, ELC03:null },
    theme: 'light',
    sound: false,
    filter: 'todos',
    view: 'ciclos',
    grades: {},
    themeVariant: 'default', // 'default' | 'alt'
    showWeighted: true
  };
  let state = loadState();

  function loadState(){
    try{
      const raw = localStorage.getItem(STATE_KEY);
      if(!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(defaultState),
        ...parsed,
        electivesSelection:{...defaultState.electivesSelection, ...(parsed.electivesSelection||{})},
        grades:{...(parsed.grades||{})}
      };
    }catch{ return structuredClone(defaultState); }
  }
  function saveState(){ localStorage.setItem(STATE_KEY, JSON.stringify(state)); }

  // ===== Índices y utils =====
  const byCode = new Map(courses.map(c=>[c.code,c]));
  const dependents = {};
  courses.forEach(c=>c.prereqs.forEach(p=>(dependents[p]??=[]).push(c.code)));

  const $ = s=>document.querySelector(s);
  const $$ = s=>Array.from(document.querySelectorAll(s));

  function getStatus(code){
    if(state.completed.includes(code)) return 'completed';
    const c=byCode.get(code);
    if(!c) return 'blocked';
    return !c.prereqs?.length || c.prereqs.every(p=>state.completed.includes(p)) ? 'available' : 'blocked';
  }
  function statusText(st){ return st==='completed'?'Completado':st==='available'?'Disponible':'Bloqueado'; }
  function creditsOf(c){ if(!c) return 0; if(!c.code.startsWith('ELC')) return c.credits??0; const sel=state.electivesSelection[c.code]; return sel?.credits??c.credits??0; }
  function sumCredits(list){ return list.reduce((a,c)=>a+creditsOf(c),0); }
  function cycleCourses(cycle){ return courses.filter(c=>c.cycle===cycle); }

  // ===== Ponderado por ciclo =====
  function computeCycleWeighted(cycle){
    const list=cycleCourses(cycle);
    const den=sumCredits(list);
    const num=list.reduce((acc,c)=>{
      const g=Number(state.grades[c.code]);
      return acc + (isFinite(g) ? g * creditsOf(c) : 0);
    },0);
    return den ? num/den : 0;
  }
  function updateCyclePonderados(){
    $$('.group-card').forEach(card=>{
      const title=card.querySelector('.group-title')?.textContent||'';
      const m=title.match(/^(d+)° Ciclo$/); if(!m) return;
      const cyc=Number(m[1]);
      const credits=sumCredits(cycleCourses(cyc));
      const pond=computeCycleWeighted(cyc);
      const sub=card.querySelector('.group-subtitle');
      const pondText = state.showWeighted ? ` • Ponderado: ${pond.toFixed(2)}` : '';
      if(sub) sub.textContent = `${credits} créditos${pondText}`;
    });
  }

  // ===== Sidebar móvil =====
  const sidebar=$('#sidebar'), hamburger=$('#hamburgerMenu'), overlay=$('#sidebarOverlay'), closeSidebarBtn=$('#closeSidebar');
  function openSidebar(){ sidebar?.classList.add('open'); overlay?.classList.add('active'); hamburger?.setAttribute('aria-expanded','true'); document.body.classList.add('no-scroll'); }
  function closeSidebar(){ sidebar?.classList.remove('open'); overlay?.classList.remove('active'); hamburger?.setAttribute('aria-expanded','false'); document.body.classList.remove('no-scroll'); }
  hamburger?.addEventListener('click',()=> hamburger.getAttribute('aria-expanded')==='true' ? closeSidebar() : openSidebar());
  closeSidebarBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  // ===== Tema / Paleta / Sonido =====
  const themeToggle=$('#themeToggle'), paletteToggle=$('#paletteToggle'), showWeightedToggle=$('#showWeightedToggle'), soundToggle=$('#soundToggle');

  function applyTheme(){
    document.documentElement.classList.toggle('dark', state.theme==='dark');
    themeToggle?.setAttribute('aria-pressed', state.theme==='dark');
  }
  function applyPalette(){
    document.documentElement.classList.toggle('alt', state.themeVariant==='alt');
    paletteToggle?.setAttribute('aria-pressed', state.themeVariant==='alt');
  }

  themeToggle?.addEventListener('click',()=>{ state.theme=state.theme==='dark'?'light':'dark'; saveState(); applyTheme(); });
  paletteToggle?.addEventListener('click',()=>{ state.themeVariant = state.themeVariant==='alt' ? 'default' : 'alt'; saveState(); applyPalette(); renderAll(); });

  if(showWeightedToggle){
    showWeightedToggle.checked = !!state.showWeighted;
    showWeightedToggle.addEventListener('change', ()=>{
      state.showWeighted = showWeightedToggle.checked;
      saveState();
      renderGrid();
    });
  }

  if(soundToggle){ soundToggle.checked=!!state.sound; soundToggle.addEventListener('change',()=>{ state.sound=soundToggle.checked; saveState(); }); }

  // ===== Efectos =====
  let audioCtx=null, confettiInstance=null;
  function blip(){ if(!state.sound) return; try{ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g);g.connect(audioCtx.destination); o.type='sine'; o.frequency.setValueAtTime(660,audioCtx.currentTime); g.gain.setValueAtTime(0.0001,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.12,audioCtx.currentTime+0.03); g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+0.2); o.start(); o.stop(audioCtx.currentTime+0.22);}catch{} }
  function initConfetti(){ const canvas=document.getElementById('confettiCanvas'); if(window.confetti&&canvas){ confettiInstance=window.confetti.create(canvas,{resize:true,useWorker:true}); } }
  function celebrate(){ if(!confettiInstance) return; confettiInstance({particleCount:90,spread:60,origin:{y:0.35},colors:['#D4B8B4','#A9B7AA','#DBD2C9','#B7B7BD','#728A7A','#A08887']}); }

  // ===== Modales =====
  const electivosModal=$('#electivosModal'), electivosGrid=$('#electivosGrid'), closeElectivosBtn=$('#closeElectivos');
  const infoModal=$('#courseInfoModal'), closeInfoBtn=$('#closeCourseInfo');
  function toggleModal(m,show){ m?.classList.toggle('show',!!show); m?.setAttribute('aria-hidden', show?'false':'true'); }
  closeElectivosBtn?.addEventListener('click',()=>toggleModal(electivosModal,false));
  electivosModal?.addEventListener('click',e=>{ if(e.target===electivosModal) toggleModal(electivosModal,false); });
  closeInfoBtn?.addEventListener('click',()=>toggleModal(infoModal,false));
  infoModal?.addEventListener('click',e=>{ if(e.target===infoModal) toggleModal(infoModal,false); });

  function openElectivos(forCode){
    if(!electivosGrid) return;
    electivosGrid.innerHTML='';
    electivosPool.forEach(opt=>{
      const d=document.createElement('div'); d.className='electivo-option';
      d.innerHTML=`<strong>${opt.code}</strong><br>${opt.name}<br><small>${opt.credits} cr.</small>`;
      d.addEventListener('click',()=>{ state.electivesSelection[forCode]={...opt}; saveState(); toggleModal(electivosModal,false); renderAll(); });
      electivosGrid.appendChild(d);
    });
    toggleModal(electivosModal,true);
  }
  function showCourseInfo(code){
    const c=byCode.get(code); if(!c) return;
    const prereq=(c.prereqs||[]).map(p=>`${p} — ${byCode.get(p)?.name||''}`).join('<br>')||'Ninguno';
    const deps=(dependents[code]||[]).map(d=>`${d} — ${byCode.get(d)?.name||''}`).join('<br>')||'Ninguno';
    const sel=state.electivesSelection[code];
    const extra=c.code.startsWith('ELC')?`<p><strong>Electivo:</strong> ${sel?`${sel.code} — ${sel.name} (${sel.credits} cr.)`:'Ninguno'}</p>`:'';
    $('#courseInfoTitle').textContent=`${c.code} — ${c.name}`;
    $('#courseInfoBody').innerHTML=`
      <p><strong>Ciclo:</strong> ${c.cycle}</p>
      <p><strong>Créditos:</strong> ${creditsOf(c)}</p>
      <p><strong>Estado:</strong> ${statusText(getStatus(code))}</p>
      <p><strong>Pre-requisitos:</strong><br>${prereq}</p>
      <p><strong>Desbloquea:</strong><br>${deps}</p>
      ${extra}
    `;
    toggleModal(infoModal,true);
  }

  // ===== Render + delegación =====
  const container=$('#ciclosContainer');

  // Delegación: aprobar, electivo, tarjeta
  container?.addEventListener('click', e=>{
    const btn=e.target.closest('.approve-btn');
    if(btn){
      const code=btn.closest('.course-card')?.dataset.code; if(!code) return;
      const st=getStatus(code); const c=byCode.get(code);
      if(st==='blocked'){ showCourseInfo(code); return; }
      if(c.code.startsWith('ELC') && !state.electivesSelection[code]){ openElectivos(code); return; }
      toggleComplete(code); return;
    }
    const extra=e.target.closest('.course-extra');
    if(extra){ const code=extra.closest('.course-card')?.dataset.code; if(code) openElectivos(code); return; }
    const card=e.target.closest('.course-card');
    if(card && !e.target.closest('.grade-input') && !e.target.closest('.approve-btn')) showCourseInfo(card.dataset.code);
  });

  // Notas por curso
  container?.addEventListener('input', e=>{
    const inp=e.target.closest('.grade-input'); if(!inp) return;
    const code=inp.closest('.course-card')?.dataset.code; if(!code) return;
    const num=Number(String(inp.value).replace(',','.'));
    if(inp.value.trim()==='' || !isFinite(num)) delete state.grades[code];
    else state.grades[code]=Math.max(0, Math.min(20, num));
    saveState();
    updateCyclePonderados();
  });

  function renderElectivoExtra(c){
    const sel=state.electivesSelection[c.code];
    return sel ? `Electivo: <strong>${sel.code}</strong> — ${sel.name} (${sel.credits} cr.)` : 'Selecciona electivo';
  }
  function makeCourseCard(c){
    const st=getStatus(c.code);
    const gradeVal=state.grades[c.code];
    const div=document.createElement('div');
    div.className='course-card'; div.dataset.code=c.code; div.dataset.status=st;
    div.innerHTML=`
      <div class="course-header">
        <span class="course-code">${c.code}</span>
        <span class="course-credits">${creditsOf(c)} cr.</span>
      </div>
      <div class="course-name">${c.name}</div>
      <div class="course-footer">
        <span class="badge ${st}">${statusText(st)}</span>
        <button class="approve-btn ${st==='blocked'?'blocked':(st==='completed'?'completed':'')}">
          ${st==='completed'?'Desaprobar':'Aprobar'}
        </button>
      </div>
      <div class="grade-row">
        <label class="grade-label" for="g-${c.code}">Nota</label>
        <input id="g-${c.code}" class="grade-input" type="number" min="0" max="20" step="0.1"
               inputmode="decimal" placeholder="-" value="${isFinite(gradeVal)?gradeVal:''}" />
      </div>
      ${c.code.startsWith('ELC')?`<div class="course-extra">${renderElectivoExtra(c)}</div>`:''}
    `;
    return div;
  }
  function makeGroupCard(title, subtitle, list){
    const card=document.createElement('div');
    card.className='group-card';
    card.innerHTML=`
      <div class="group-header">
        <h4 class="group-title">${title}</h4>
        <p class="group-subtitle">${subtitle}</p>
      </div>
      <div class="group-body"></div>`;
    const body=card.querySelector('.group-body');
    list.forEach(c=>body.appendChild(makeCourseCard(c)));
    if(title.startsWith(`${currentCycle}° Ciclo`)) card.classList.add('current-cycle');
    return card;
  }

  function renderByCycles(){
    container.className='courses-grid view-ciclos';
    container.innerHTML='';
    for(let cyc=1;cyc<=10;cyc++){
      const list=cycleCourses(cyc);
      const credits=sumCredits(list);
      const pond=computeCycleWeighted(cyc);
      const pondText = state.showWeighted ? ` • Ponderado: ${pond.toFixed(2)}` : '';
      container.appendChild(makeGroupCard(`${cyc}° Ciclo`, `${credits} créditos${pondText}`, list));
    }
  }
  function renderByYears(){
    container.className='courses-grid view-anos';
    container.innerHTML='';
    for(let year=1;year<=5;year++){
      const cycles=[year*2-1, year*2];
      const list=courses.filter(c=>cycles.includes(c.cycle));
      container.appendChild(makeGroupCard(`Año ${year}`, `Ciclos ${cycles[0]}–${cycles[1]} • ${sumCredits(list)} créditos`, list));
    }
  }
  function renderCompact(){
    container.className='courses-grid view-compacta';
    container.innerHTML='';
    container.appendChild(makeGroupCard('Todos los cursos', `${courses.length} cursos`, courses));
  }
  function renderGrid(){
    if(state.view==='ciclos') renderByCycles();
    else if(state.view==='anos') renderByYears();
    else renderCompact();
    applyFilters();
    updateCyclePonderados();
  }

  // Vistas / Filtros / Búsqueda
  const searchInput=$('#searchInput');
  const filterBtns=$$('.filter-btn');
  const viewBtns=$$('.view-btn');

  filterBtns.forEach(b=>{
    if(b.dataset.filter===state.filter) b.classList.add('active');
    b.addEventListener('click',()=>{
      filterBtns.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      state.filter=b.dataset.filter;
      saveState();
      applyFilters();
    });
  });
  viewBtns.forEach(b=>{
    if(b.dataset.view===state.view){ b.classList.add('active'); b.setAttribute('aria-pressed','true'); }
    b.addEventListener('click',()=>{
      viewBtns.forEach(x=>{ x.classList.remove('active'); x.setAttribute('aria-pressed','false'); });
      b.classList.add('active'); b.setAttribute('aria-pressed','true');
      state.view=b.dataset.view;
      saveState();
      renderGrid();
    });
  });
  searchInput?.addEventListener('input', applyFilters);

  function applyFilters(){
    const q=searchInput?.value.trim().toLowerCase()||'';
    $$('.course-card').forEach(card=>{
      const code=card.dataset.code; const c=byCode.get(code); const st=getStatus(code);
      let vis=true;
      if(state.filter==='completados' && st!=='completed') vis=false;
  
