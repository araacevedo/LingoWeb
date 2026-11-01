// =============================================================================
// datos/cursos.js  ·  CAPA DE DATOS
// Rol en el TP: catálogo de los tres cursos que exige la consigna (Inglés,
// Alemán y Chino Mandarín desde Español). La consigna pide que el contenido
// "se construya a partir de la información que administra la aplicación y no
// quede fijado en cada pantalla": las tarjetas del dashboard (vista 2) se
// generarán recorriendo este arreglo. Por ahora ningún módulo lo importa.
// =============================================================================

// export: lo podrán importar el dashboard y el mapa del curso. const: la referencia al arreglo no se reasigna.
export const catalogoCursos = [   // arreglo de objetos literales: cada objeto agrupa los datos de un curso (propiedad: valor)
  {                               // --- curso de Inglés ---
    id: "ingles",                 // identificador interno: se usará en la URL (?curso=ingles) y para guardar el progreso
    titulo: "Inglés",             // nombre visible en la tarjeta
    descripcion: "Inglés desde Español", // subtítulo visible en la tarjeta
    bandera: "🇬🇧",               // bandera que pide la consigna en cada tarjeta
    nivel: "Intermedio (B1)",      // nivel que pide la consigna en cada tarjeta
    pagina: "cursoIngles.html",    // página a la que lleva el botón de la tarjeta (el mapa del curso)
    totalLecciones: 3              // cuántas lecciones tiene el curso; sirve para calcular el porcentaje de avance
  },                              
  {                               // --- curso de Alemán ---
    id: "aleman",                 // identificador interno
    titulo: "Alemán",             // nombre visible
    descripcion: "Alemán desde Español", // subtítulo visible
    bandera: "🇩🇪",               // bandera
    nivel: "Principiante (A1)",    // nivel
    pagina: "cursoAleman.html",   // página del mapa del curso
    totalLecciones: 3             // cantidad de lecciones
  },                             
  {                               // --- curso de Chino Mandarín ---
    id: "chino",                  // identificador interno
    titulo: "Chino Mandarín",     // nombre visible
    descripcion: "Chino desde Español", // subtítulo visible
    bandera: "🇨🇳",               // bandera
    nivel: "Inicial (HSK 1)",      // nivel
    pagina: "cursoChino.html",     // página del mapa del curso
    totalLecciones: 3              // cantidad de lecciones
  }                               
];                                
