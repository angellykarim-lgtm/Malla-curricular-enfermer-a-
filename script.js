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
  const electiv
