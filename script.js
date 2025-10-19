```javascript
const coursesData = {
    ciclo1: [
        { code: 'AC4012', name: 'INGLÉS I', credits: 3, prereqs: [] },
        { code: 'EN7011', name: 'PROCESOS BIOLÓGICOS', credits: 6, prereqs: [] },
        { code: 'EN7012', name: 'PRÁCTICAS DE ENFERMERÍA I', credits: 5, prereqs: [] },
        { code: 'AC4011', name: 'DESARROLLO HUMANO Y SOCIAL', credits: 4, prereqs: [] },
        { code: 'TF5012', name: 'ESTRUCTURA Y FUNCIÓN DEL CUERPO HUMANO', credits: 4, prereqs: [] }
    ],
    ciclo2: [
        { code: 'AC4021', name: 'ESTILO DE VIDA, SALUD Y MEDIO AMBIENTE', credits: 4, prereqs: [] },
        { code: 'AC4022', name: 'INGLÉS II', credits: 2, prereqs: ['AC4012'] },
        { code: 'EN7021', name: 'SISTEMA MUSCULOESQUELÉTICO', credits: 3, prereqs: ['TF5012'] },
        { code: 'EN7022', name: 'SISTEMA NERVIOSO Y ENDOCRINO', credits: 5, prereqs: ['TF5012'] },
        { code: 'EN7023', name: 'PRÁCTICAS DE ENFERMERÍA II', credits: 5, prereqs: ['EN7012'] },
        { code: 'ND4021', name: 'MECANISMO DE AGRESIÓN Y DEFENSA I', credits: 4, prereqs: ['EN7011'] }
    ],
    ciclo3: [
        { code: 'EN7031', name: 'SISTEMA CARDIORESPIRATORIO', credits: 5, prereqs: ['EN7021'] },
        { code: 'EN7032', name: 'SISTEMA TEGUMENTARIO', credits: 3, prereqs: ['EN7022'] },
        { code: 'EN7033', name: 'PRÁCTICAS DE ENFERMERÍA III', credits: 5, prereqs: ['EN7023'] },
        { code: 'EN7034', name: 'BASES DE LA TERAPEÚTICA FARMACOLÓGICA', credits: 4, prereqs: [] },
        { code: 'ND4032', name: 'MECANISMOS DE AGRESIÓN Y DEFENSA II', credits: 4, prereqs: ['ND4021'] }
    ],
    ciclo4: [
        { code: 'AC4041', name: 'SALUD PÚBLICA Y SISTEMAS DE SALUD', credits: 5, prereqs: ['AC4021'] },
        { code: 'EN7041', name: 'SISTEMA URINARIO Y REPRODUCTIVO', credits: 4, prereqs: ['EN7031'] },
        { code: 'EN7042', name: 'SISTEMA DIGESTIVO', credits: 4, prereqs: ['EN7032'] },
        { code: 'EN7043', name: 'MECANISMO DE AGRESIÓN Y DEFENSA III', credits: 4, prereqs: ['ND4032'] },
        { code: 'EN7044', name: 'PRÁCTICAS DE ENFERMERÍA IV', credits: 5, prereqs: ['EN7033'] }
    ],
    ciclo5: [
        { code: 'AC4051', name: 'PREVENCIÓN Y PROMOCIÓN DE LA SALUD', credits: 5, prereqs: ['AC4041'] },
        { code: 'EN7051', name: 'SALUD DEL NIÑO Y ADOLESCENTE', credits: 7, prereqs: ['EN7044'] },
        { code: 'EN7052', name: 'SALUD DE LA MUJER Y NEONATO', credits: 7, prereqs: ['EN7044'] },
        { code: 'ELC01', name: 'ELECTIVO I', credits: 3, prereqs: [], isElectivo: true }
    ],
    ciclo6: [
        { code: 'AC4061', name: 'CIENCIA Y DESCUBRIMIENTO', credits: 6, prereqs: [] },
        { code: 'EN7061', name: 'GESTIÓN CLÍNICA Y HOSPITALARIA', credits: 4, prereqs: ['EN7051'] },
        { code: 'EN7062', name: 'SALUD DEL ADULTO', credits: 7, prereqs: ['EN7052'] },
        { code: 'ELC02', name: 'ELECTIVO II', credits: 3, prereqs: [], isElectivo: true }
    ],
    ciclo7: [
        { code: 'EN7071', name: 'SALUD DEL ADULTO MAYOR', credits: 7, prereqs: ['EN7062'] },
        { code: 'EN7072', name: 'SALUD COMUNITARIA Y FAMILIAR', credits: 5, prereqs: ['EN7061'] },
        { code: 'AC4063', name: 'TENDENCIAS GLOBALES EN SALUD', credits: 3, prereqs: [] },
        { code: 'ELC03', name: 'ELECTIVO III', credits: 3, prereqs: [], isElectivo: true }
    ],
    ciclo8: [
        { code: 'EN7082', name: 'SALUD MENTAL', credits: 4, prereqs: ['EN7072'] },
        { code: 'EN7083', name: 'CUIDADOS PALIATIVOS Y DEL FIN DE LA VIDA', credits: 4, prereqs: ['AC4051'] },
        { code: 'EN7084', name: 'URGENCIAS Y EMERGENCIAS', credits: 5, prereqs: ['EN7071'] },
        { code: 'AC4064', name: 'PROYECTOS DE INTERVENCIÓN EN SALUD', credits: 3, prereqs: [] }
    ],
    ciclo9: [
        { code: 'EN7091', name: 'PRÁCTICAS PRE-PROFESIONALES I', credits: 14, prereqs: ['AC4011', 'AC4012', 'AC4021', 'AC4022', 'AC4041', 'AC4051', 'AC4061', 'ELC01', 'ELC02', 'ELC03', 'EN7011', 'EN7012', 'EN7021', 'EN7022', 'EN7023', 'EN7031', 'EN7032', 'EN7033', 'EN7041', 'EN7042', 'EN7043', 'EN7044', 'EN7051', 'EN7052', 'EN7061', 'EN7062', 'EN7071', 'EN7072', 'EN7082', 'EN7083', 'EN7084', 'ND4021', 'ND4032', 'TF5012'] },
        { code: 'EN7092', name: 'SEMINARIOS DE INTEGRACIÓN CLÍNICA I', credits: 1, prereqs: ['AC4064'] },
        { code: 'EN7093', name: 'SEMINARIO DE INVESTIGACIÓN', credits: 3, prereqs: ['AC4061'] }
    ],
    ciclo10: [
        { code: 'EN7101', name: 'PRÁCTICAS PRE-PROFESIONALES II', credits: 14, prereqs: ['EN7091'] },
        { code: 'EN7102', name: 'SEMINARIOS DE INTEGRACIÓN CLÍNICA II', credits: 1, prereqs: ['EN7092'] },
        { code: 'EN7103', name: 'TRABAJO DE INVESTIGACIÓN', credits: 3, prereqs: ['EN7093'] }
    ]
};

const electivosData = [
    { code: 'AC4E01', name: 'EDUCACIÓN, DERECHOS Y AUTONOMÍA DE LAS PERSONAS CON DISCAPACIDAD', credits: 3 },
    { code: 'LC5E01', name: 'SALUD AMBIENTAL Y URBANA', credits: 3 },
    { code: 'MH3E01', name: 'DETERMINANTES SOCIALES DE SALUD Y CONDUCTAS DE SALUD', credits: 3 },
    { code: 'MH3E02', name: 'ANTROPOLOGÍA MÉDICA: CULTURA Y SALUD', credits: 3 },
    { code: 'ND4E01', name: 'LA DIETA OCCIDENTAL', credits: 3 },
    { code: 'OD5E01', name: 'MÉTODOS DE INVESTIGACIÓN PARA PROFESIONALES DE SALUD', credits: 3 },
    { code: 'PS4E01', name: 'MANEJO DEL ESTRÉS PARA EL BIENESTAR', credits: 3 },
    { code: 'PS4E02', name: 'FUNDAMENTOS DEL BIENESTAR', credits: 3 },
    { code: 'TF5E01', name: 'IMPACTO DE LA ACTIVIDAD FÍSICA EN LA SALUD Y EL BIENESTAR', credits: 3 }
];

let completedCourses = new Set();
let selectedElectivos = {
    ELC01: null,
    ELC02: null,
    ELC03: null
};
let totalCredits = 0;
let currentElectivoSlot = null;

function init() {
    renderCiclos();
    setupModal();
    updateCredits();
}

function isUnlocked(course) {
    if (course.prereqs.length === 0) return true;
    return course.prereqs.every(prereq => completedCourses.has(prereq));
}

function toggleCourse(courseCode, credits) {
    if (completedCourses.has(courseCode)) {
        completedCourses.delete(courseCode);
        totalCredits -= credits;
    } else {
        completedCourses.add(courseCode);
        totalCredits += credits;
    }
    updateCredits();
    renderCiclos();
}

function updateCredits() {
    document.getElementById('totalCredits').textContent = totalCredits;
}

function createCourseCard(course) {
    const isCompleted = completedCourses.has(course.code);
    const unlocked = isUnlocked(course);
    
    const card = document.createElement('div');
    card.className = `course-card ${isCompleted ? 'completed' : ''} ${!unlocked ? 'locked' : ''} ${course.isElectivo ? 'electivo' : ''}`;
    
    if (course.isElectivo) {
        const selectedCourse = selectedElectivos[course.code];
        card.innerHTML = `
            <div class="course-header">
                <span class="course-code">${course.code}</span>
                <div class="course-meta">
                    <span class="course-credits">${course.credits} cr</span>
                    ${isCompleted ? '<svg class="course-icon check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                </div>
            </div>
            <p class="course-name">${selectedCourse ? selectedCourse.name : course.name}</p>
            <button class="select-electivo-btn ${selectedCourse ? 'selected-electivo' : ''}" onclick="openElectivosModal('${course.code}')">
                ${selectedCourse ? '✓ ' + selectedCourse.code : 'Seleccionar Electivo'}
            </button>
        `;
    } else {
        card.innerHTML = `
            <div class="course-header">
                <span class="course-code">${course.code}</span>
                <div class="course-meta">
                    <span class="course-credits">${course.credits} cr</span>
                    ${isCompleted ? '<svg class="course-icon check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                    ${!unlocked ? '<svg class="course-icon lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>' : ''}
                </div>
            </div>
            <p class="course-name">${course.name}</p>
            ${course.prereqs.length > 0 ? `
                <div class="course-prereqs">
                    <span class="prereq-label">Req:</span> ${course.prereqs.slice(0, 2).join(', ')}${course.prereqs.length > 2 ? ` +${course.prereqs.length - 2}` : ''}
                </div>
            ` : ''}
        `;
        
        if (unlocked && !course.isElectivo) {
            card.onclick = () => toggleCourse(course.code, course.credits);
        }
    }
    
    return card;
}

function renderCiclos() {
    const container = document.getElementById('ciclosContainer');
    container.innerHTML = '';
    
    Object.entries(coursesData).forEach(([ciclo, courses], index) => {
        const cicloDiv = document.createElement('div');
        cicloDiv.className = 'ciclo';
        
        const year = Math.floor(index / 2) + 1;
        const semester = index % 2 === 0 ? '1er' : '2do';
        
        cicloDiv.innerHTML = `
            <div class="ciclo-header">
                <h2>Ciclo ${index + 1} - Año ${year} (${semester} Semestre)</h2>
            </div>
            <div class="ciclo-body">
                <div class="courses-grid" id="grid-${ciclo}"></div>
            </div>
        `;
        
        container.appendChild(cicloDiv);
        
        const grid = document.getElementById(`grid-${ciclo}`);
        courses.forEach(course => {
            grid.appendChild(createCourseCard(course));
        });
    });
}

function openElectivosModal(electivoCode) {
    currentElectivoSlot = electivoCode;
    const modal = document.getElementById('electivosModal');
    const grid = document.getElementById('electivosGrid');
    
    grid.innerHTML = '';
    
    electivosData.forEach(electivo => {
        const isSelected = selectedElectivos[electivoCode]?.code === electivo.code;
        const isUsedElsewhere = Object.entries(selectedElectivos).some(
            ([slot, selected]) => slot !== electivoCode && selected?.code === electivo.code
        );
        
        const option = document.createElement('div');
        option.className = `electivo-option ${isSelected ? 'selected' : ''}`;
        
        if (isUsedElsewhere) {
            option.style.opacity = '0.5';
            option.style.cursor = 'not-allowed';
        }
        
        option.innerHTML = `
            <div class="course-header">
                <span class="course-code">${electivo.code}</span>
                <div class="course-meta">
                    <span class="course-credits">${electivo.credits} cr</span>
                    ${isSelected ? '<svg class="course-icon check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
                </div>
            </div>
            <p class="course-name">${electivo.name}</p>
        `;
        
        if (!isUsedElsewhere) {
            option.onclick = () => selectElectivo(electivo);
        }
        
        grid.appendChild(option);
    });
    
    modal.classList.add('show');
}

function selectElectivo(electivo) {
    const previousElectivo = selectedElectivos[currentElectivoSlot];
    
    if (previousElectivo?.code === electivo.code) {
        selectedElectivos[currentElectivoSlot] = null;
        if (completedCourses.has(currentElectivoSlot)) {
            completedCourses.delete(currentElectivoSlot);
            totalCredits -= 3;
        }
    } else {
        selectedElectivos[currentElectivoSlot] = electivo;
        if (!completedCourses.has(currentElectivoSlot)) {
            completedCourses.add(currentElectivoSlot);
            totalCredits += 3;
        }
    }
    
    updateCredits();
    renderCiclos();
    closeModal();
}

function closeModal() {
    document.getElementById('electivosModal').classList.remove('show');
}

function setupModal() {
    const modal = document.getElementById('electivosModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = closeModal;
    
    window.onclick = (event) => {
        if (event.target === modal) {
            closeModal();
        }
    };
}

document.addEventListener('DOMContentLoaded', init);
```
