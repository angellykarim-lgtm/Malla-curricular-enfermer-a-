/* Malla interactiva Enfermería - FUNCIONAL + Notas y Ponderado por ciclo */
(function() {
  'use strict';

  // ---- Estado/Constantes ----
  const TOTAL_PROGRAM_CREDITS = 222;
  const STATE_KEY = 'malla_enfermeria_state_v1';
  const codeAliases = { 'EN82':'EN7082', 'EN83':'EN7083', 'EN84':'EN7084' };

  // ---- Datos (usa tus mismos arrays completos) ----
  const courses = [
    // ... pega aquí TODOS tus cursos sin cambios ...
    // Ejemplo de última línea:
    // { code:'EN7103', name:'TRABAJO DE INVESTIGACIÓN', credits:3, cycle:10, prereqs:['EN7093'] },
  ];
  const electivosPool = [
    // ... pega aquí tus electivos sin cambios ...
  ];

  // Normaliza prereqs
  const codeSet = new Set(courses.map(c=>c.code));
  courses.forEach(c=>{
    c.prereqs = (c.prereqs||[]).map(p=>codeAliases[p]||p).filter(p=>codeSet.has(p));
  });

  // ---- Persistencia ----
  const defaultState = {
    completed: [],
    electivesSelection: { ELC01:null, ELC02:null, ELC03:null },
    theme: 'light',
    sound: false,
    filter: 'todos',
    view: 'ciclos',
    grades: {}           // NUEVO: { 'AC4012': 18.5, ... }
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
        electivesSelection: { ...defaultState.electivesSelection, ...(parsed.electivesSelection||{}) },
        grades: { ...(parsed.grades||{}) }
      };
    } catch { return structuredClone(defaultState); }
  }
  function saveState() { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }

  // ---- Índices/Utils ----
  const byCode = new Map(courses.map(c=>[c.code,c]));
  const dependents = {};
  courses.forEach(c=>c.prereqs.forEach(p=>(dependents[p]??=[]).push(c.code)));

  const $ = s=>document.querySelector(s);
  const $$ = s=>Array.from(document.querySelectorAll(s));

  function getStatus(code){
    if(state.completed.includes(code)) return 'completed';
    const c = byCode.get(code);
    if(!c) return 'blocked';
    return !c.prereqs?.length || c.prereqs.every(p=>state.completed.includes(p)) ? 'available' : 'blocked';
  }
  function statusText(st){ return st==='completed'?'Completado':st==='available'?'Disponible':'Bloqueado'; }
  function creditsOf(c){
    if(!c) return 0;
    if(!c.code.startsWith('ELC')) return c.credits||0;
    const sel = state.electivesSelection[c.code];
    return sel?.credits ?? c.credits ?? 0;
  }
  function sumCredits(list){ return list.reduce((a,c)=>a+creditsOf(c),0); }

  // ---- Ponderado por ciclo ----
  function cycleCourses(cycle){ return courses.filter(c=>c.cycle===cycle); }
  function computeCycleWeighted(cycle){
    const list = cycleCourses(cycle);
    const den = sumCredits(list); // créditos totales del ciclo
    const num = list.reduce((a,c)=>{
      const grade = Number(state.grades[c.code]);
      return a + (isFinite(grade)? grade*creditsOf(c) : 0);
    },0);
    return den ? num/den : 0;
  }
  function updateCyclePonderados(){
    $$('.group-card').forEach(card=>{
      const title = card.querySelector('.group-title')?.textContent || '';
      const m = title.match(/^(d+)° Ciclo$/);
      if(!m) return;
      const cyc = Number(m[1]);
      const list = cycleCourses(cyc);
      const credits = sumCredits(list);
      const pond = computeCycleWeighted(cyc);
      const subtitle = card.querySelector('.group-subtitle');
      if(subtitle) subtitle.textContent = `${credits} créditos • Ponderado: ${pond.toFixed(2)}`;
    });
  }

  // ---- Sidebar móvil ----
  const sidebar = $('#sidebar'), hamburger=$('#hamburgerMenu'), overlay=$('#sidebarOverlay'), closeSidebarBtn=$('#closeSidebar');
  function openSidebar(){ sidebar.classList.add('open'); overlay.classList.add('active'); hamburger.setAttribute('aria-expanded','true'); document.body.classList.add('no-scroll'); }
  function closeSidebar(){ sidebar.classList.remove('open'); overlay.classList.remove('active'); hamburger.setAttribute('aria-expanded','false'); document.body.classList.remove('no-scroll'); }
  hamburger.addEventListener('click',()=> (hamburger.getAttribute('aria-expanded')==='true'?closeSidebar():openSidebar()));
  closeSidebarBtn.addEventListener('click',closeSidebar);
  overlay.addEventListener('click',closeSidebar);

  // ---- Tema/Sonido ----
  const themeToggle=$('#themeToggle'), soundToggle=$('#soundToggle');
  function applyTheme(){ document.documentElement.classList.toggle('dark', state.theme==='dark'); themeToggle.setAttribute('aria-pressed', state.theme==='dark'); }
  themeToggle.addEventListener('click',()=>{ state.theme=state.theme==='dark'?'light':'dark'; saveState(); applyTheme(); });
  soundToggle.checked=!!state.sound; soundToggle.addEventListener('change',()=>{ state.sound=soundToggle.checked; saveState(); });

  // ---- Efectos ----
  let audioCtx=null, confettiInstance=null;
  function blip(){ if(!state.sound) return; try{ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.connect(g);g.connect(audioCtx.destination); o.type='sine';o.frequency.setValueAtTime(660,audioCtx.currentTime); g.gain.setValueAtTime(0.0001,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.12,audioCtx.currentTime+0.03); g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+0.2); o.start();o.stop(audioCtx.currentTime+0.22);}catch{} }
  function initConfetti(){ const canvas=$('#confettiCanvas'); if(window.confetti&&canvas){ confettiInstance=window.confetti.create(canvas,{resize:true,useWorker:true}); } }
  function celebrate(){ if(!confettiInstance) return; confettiInstance({particleCount:90,spread:60,origin:{y:0.35},colors:['#D4B8B4','#A9B7AA','#DBD2C9','#B7B7BD','#728A7A','#A08887']}); }

  // ---- Modales ----
  const electivosModal=$('#electivosModal'), electivosGrid=$('#electivosGrid'), closeElectivosBtn=$('#closeElectivos');
  const infoModal=$('#courseInfoModal'), closeInfoBtn=$('#closeCourseInfo');
  function toggleModal(el, show){ el.classList.toggle('show',!!show); el.setAttribute('aria-hidden', show?'false':'true'); }
  closeElectivosBtn.addEventListener('click',()=>toggleModal(electivosModal,false));
  electivosModal.addEventListener('click',e=>{ if(e.target===electivosModal) toggleModal(electivosModal,false); });
  closeInfoBtn.addEventListener('click',()=>toggleModal(infoModal,false));
  infoModal.addEventListener('click',e=>{ if(e.target===infoModal) toggleModal(infoModal,false); });

  function openElectivos(forCode){
    electivosGrid.innerHTML='';
    electivosPool.forEach(opt=>{
      const div=document.createElement('div'); div.className='electivo-option';
      div.innerHTML=`<strong>${opt.code}</strong><br>${opt.name}<br><small>${opt.credits} cr.</small>`;
      div.addEventListener('click',()=>{ state.electivesSelection[forCode]={...opt}; saveState(); toggleModal(electivosModal,false); renderAll(); });
      electivosGrid.appendChild(div);
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

  // ---- Render + Delegación de eventos ----
  const container=$('#ciclosContainer');

  // Delegación: aprobar / electivo / nota
  container.addEventListener('click', e=>{
    const btn=e.target.closest('.approve-btn');
    if(btn){
      const code=btn.closest('.course-card')?.dataset.code; if(!code) return;
      const st=getStatus(code); const c=byCode.get(code);
      if(st==='blocked'){ showCourseInfo(code); return; }
      if(c.code.startsWith('ELC') && !state.electivesSelection[code]){ openElectivos(code); return; }
      toggleComplete(code);
      return;
    }
    const extra=e.target.closest('.course-extra');
    if(extra){ const code=extra.closest('.course-card')?.dataset.code; if(code) openElectivos(code); return; }
    const card=e.target.closest('.course-card');
    if(card && !e.target.closest('.grade-input') && !e.target.closest('.approve-btn')) showCourseInfo(card.dataset.code);
  });

  container.addEventListener('input', e=>{
    const inp = e.target.closest('.grade-input');
    if(!inp) return;
    const code = inp.closest('.course-card')?.dataset.code;
    if(!code) return;
    const val = inp.value.trim();
    const num = Number(val.replace(',', '.'));
    // Validación simple 0-20 (ajusta si usas otra escala)
    if(val==='' || !isFinite(num)){ delete state.grades[code]; }
    else state.grades[code] = Math.max(0, Math.min(20, num));
    saveState();
    updateCyclePonderados();
  });

  function renderElectivoExtra(c){
    const sel=state.electivesSelection[c.code];
    return sel ? `Electivo: <strong>${sel.code}</strong> — ${sel.name} (${sel.credits} cr.)` : 'Selecciona electivo';
  }

  function makeCourseCard(c){
    const st=getStatus(c.code);
    const gradeVal = state.grades[c.code];
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
    const card=document.createElement('div'); card.className='group-card';
    card.innerHTML=`
      <div class="group-header">
        <h4 class="group-title">${title}</h4>
        <p class="group-subtitle">${subtitle}</p>
      </div>
      <div class="group-body"></div>
    `;
    const body=card.querySelector('.group-body');
    list.forEach(c=>body.appendChild(makeCourseCard(c)));
    return card;
  }

  function renderByCycles(){
    container.className='courses-grid view-ciclos'; container.innerHTML='';
    for(let cyc=1;cyc<=10;cyc++){
      const list=cycleCourses(cyc);
      const credits=sumCredits(list);
      const pond=computeCycleWeighted(cyc);
      container.appendChild(makeGroupCard(`${cyc}° Ciclo`, `${credits} créditos • Ponderado: ${pond.toFixed(2)}`, list));
    }
  }
  function renderByYears(){
    container.className='courses-grid view-anos'; container.innerHTML='';
    for(let year=1;year<=5;year++){
      const cycles=[year*2-1, year*2];
      const list=courses.filter(c=>cycles.includes(c.cycle));
      container.appendChild(makeGroupCard(`Año ${year}`, `Ciclos ${cycles[0]}–${cycles[1]} • ${sumCredits(list)} créditos`, list));
    }
  }
  function renderCompact(){
    container.className='courses-grid view-compacta'; container.innerHTML='';
    container.appendChild(makeGroupCard('Todos los cursos', `${courses.length} cursos`, courses));
  }
  function renderGrid(){
    if(state.view==='ciclos') renderByCycles();
    else if(state.view==='anos') renderByYears();
    else renderCompact();
    applyFilters();
    updateCyclePonderados();
  }

  // ---- Filtros/Búsqueda ----
  const searchInput=$('#searchInput'), filterBtns=$$('.filter-btn'), viewBtns=$$('.view-btn');
  filterBtns.forEach(b=>{
    if(b.dataset.filter===state.filter) b.classList.add('active');
    b.addEventListener('click',()=>{
      filterBtns.forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); state.filter=b.dataset.filter; saveState(); applyFilters();
    });
  });
  viewBtns.forEach(b=>{
    if(b.dataset.view===state.view){ b.classList.add('active'); b.setAttribute('aria-pressed','true'); }
    b.addEventListener('click',()=>{
      viewBtns.forEach(x=>{ x.classList.remove('active'); x.setAttribute('aria-pressed','false'); });
      b.classList.add('active'); b.setAttribute('aria-pressed','true');
      state.view=b.dataset.view; saveState(); renderGrid();
    });
  });
  searchInput.addEventListener('input', applyFilters);

  function applyFilters(){
    const q=searchInput.value.trim().toLowerCase();
    $$('.course-card').forEach(card=>{
      const code=card.dataset.code; const c=byCode.get(code); const st=getStatus(code);
      let vis=true;
      if(state.filter==='completados' && st!=='completed') vis=false;
      if(state.filter==='disponibles' && st!=='available') vis=false;
      if(state.filter==='bloqueados' && st!=='blocked') vis=false;
      if(q && !(c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))) vis=false;
      card.style.display=vis?'':'none';
      // Refresca badge/btn por si cambió dependencia
      const badge=card.querySelector('.badge');
      badge.className=`badge ${st}`; badge.textContent=statusText(st);
      const btn=card.querySelector('.approve-btn');
      btn.classList.toggle('blocked', st==='blocked');
      btn.classList.toggle('completed', st==='completed');
      btn.textContent = st==='completed'?'Desaprobar':'Aprobar';
      if(code.startsWith('ELC')){
        const extra=card.querySelector('.course-extra');
        if(extra) extra.innerHTML=renderElectivoExtra(c);
      }
    });
    updateHeader();
  }

  // ---- Estadísticas/Barra ----
  const totalCreditsEl=$('#totalCredits'), completedCountEl=$('#completedCount'), totalCountEl=$('#totalCount'), progressPercentEl=$('#progressPercent'), progressBarEl=$('#progressBar'), yearProgressEl=$('#yearProgress');

  function updateHeader(){
    totalCountEl.textContent=String(courses.length);
    const completedCourses=state.completed.length;
    const completedCredits=state.completed.reduce((a,code)=>a+creditsOf(byCode.get(code)),0);
    const pct=Math.round((completedCredits/TOTAL_PROGRAM_CREDITS)*100);
    totalCreditsEl.textContent=String(completedCredits);
    completedCountEl.textContent=String(completedCourses);
    progressPercentEl.textContent=String(isFinite(pct)?pct:0);
    progressBarEl.style.width=`${Math.max(0,Math.min(100,pct))}%`;
    renderYearChips();
  }
  function renderYearChips(){
    yearProgressEl.innerHTML='';
    for(let year=1;year<=5;year++){
      const cycles=[year*2-1, year*2];
      const list=courses.filter(c=>cycles.includes(c.cycle));
      const creditsTotal=sumCredits(list);
      const creditsDone=list.filter(c=>state.completed.includes(c.code)).reduce((a,c)=>a+creditsOf(c),0);
      const pct=creditsTotal?Math.round((creditsDone/creditsTotal)*100):0;
      const chip=document.createElement('div'); chip.className='year-chip';
      chip.innerHTML=`
        <div class="year-chip-title">Año ${year} — ${creditsDone}/${creditsTotal} cr.</div>
        <div class="year-chip-bar"><div class="year-chip-fill" style="width:${pct}%"></div></div>
      `;
      yearProgressEl.appendChild(chip);
    }
  }

  // ---- Export/Import/Reset ----
  $('#exportBtn').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='progreso-malla.json'; a.click(); URL.revokeObjectURL(a.href);
  });
  const importFile=$('#importFile'), importLabel=$('#importBtn');
  importLabel.addEventListener('click',()=>importFile.click());
  importFile.addEventListener('change', async ()=>{
    const f=importFile.files?.[0]; if(!f) return;
    try{
      const text=await f.text(); const obj=JSON.parse(text);
      state={ ...defaultState, ...obj, electivesSelection:{...defaultState.electivesSelection, ...(obj.electivesSelection||{})}, grades:{...(obj.grades||{})} };
      saveState(); soundToggle.checked=!!state.sound; applyTheme(); renderAll(); alert('Progreso importado correctamente');
    }catch{ alert('Archivo inválido'); }
    importFile.value='';
  });
  $('#resetBtn').addEventListener('click',()=>{
    if(!confirm('¿Reiniciar todo el progreso?')) return;
    state=structuredClone(defaultState); saveState(); soundToggle.checked=false; applyTheme(); renderAll();
  });

  // ---- Chart ----
  let chart=null;
  function buildChart(){
    const canvas=$('#creditsChart'); if(!canvas) return;
    const ctx=canvas.getContext('2d');
    const labels=Array.from({length:10},(_,i)=>`${i+1}°`);
    const data=labels.map((_,i)=> sumCredits(cycleCourses(i+1)));
    const colors=['#A9B7AA','#D4B8B4','#DBD2C9','#B7B7BD','#728A7A','#A08887','#DDD0C8','#9ea3b0','#8fa59c','#c9b8b2'];
    if(chart) chart.destroy();
    chart=new Chart(ctx,{ type:'bar', data:{ labels, datasets:[{ label:'Créditos', data, backgroundColor:colors, borderRadius:6 } ] },
      options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ beginAtZero:true, ticks:{precision:0} } }, plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:(ctx)=>`${ctx.parsed.y} créditos` } } } } });
  }

  // ---- Toggle completar ----
  function toggleComplete(code){
    const idx=state.completed.indexOf(code);
    if(idx>=0) state.completed.splice(idx,1);
    else { state.completed.push(code); blip(); celebrate(); }
    saveState(); renderAll();
  }

  // ---- Render global ----
  function renderAll(){ renderGrid(); updateHeader(); if(window.Chart) buildChart(); }

  // ---- Init ----
  applyTheme(); initConfetti(); renderAll();
})();
