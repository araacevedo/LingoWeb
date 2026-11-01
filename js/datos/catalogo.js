// =============================================================================
// catalogo.js  ·  CAPA DE DATOS
// La lista de los tres cursos de LingoWeb, con sus unidades y lecciones.
// El dashboard arma sus tarjetas y el mapa del curso arma sus unidades
// recorriendo esta lista, así nada queda escrito a mano en el HTML
// (es lo que pide la consigna en "Presentación dinámica de la información").
//
// Forma de cada curso:
//   curso → unidades → lecciones
// Cada lección tiene un id ("l1", "l2"...) que se usa para guardar el progreso
// de cada persona. Las lecciones se hacen en orden: l1, l2, l3, l4. Ese id es lo 
// que se guarda en el progreso de cada persona (progreso.ingles.l3), así que no se 
// puede repetir dentro de un curso.
//
// Lo que se modifico a partir de la vista 3: 
// -(unidades: el contenido del mapa):
// La consigna pide “presentar unidades y lecciones con título, breve descripción y 
// estado”. Antes eso estaba escrito a mano en cursoIngles.html. Ahora está en los 
// datos y curso.js lo arma. Tiene forma de “lista dentro de lista”
//
// -Se quito pagina: "cursoIngles.html"
// Indicaba a qué página llevaba el botón de la tarjeta. Ya no hace falta, porque 
// ahora hay una sola página para todos los cursos y el enlace se arma con el id
//
// -Se quito totalLecciones:3
// Era un número escrito a mano. Ahora que las lecciones están en la lista, se cuentan 
// solas con obtenerLecciones(curso).length en progreso.js. Así, si mañana se agrega 
// una lección, el porcentaje se ajusta sin tocar nada más. Antes había que acordarse 
// de cambiar ese número, y si alguien se olvidaba, el porcentaje quedaba mal.
// 
// -Se agrego tambien paginaLeccion por cada idioma:
// A dónde llevan los botones “Empezar” y “Repetir” de cada lección. Es provisorio: 
// por ahora apunta a las páginas de lección fijas del TP1. En la vista 4 se reemplaza 
// por una lección real.
//
// -Se agrego la funcion buscarCurso, al final del archivo
// =============================================================================

// export: lo podrán importar el dashboard y el mapa del curso. const: la referencia al arreglo no se reasigna.
export const catalogoCursos = [   // arreglo de objetos literales: cada objeto agrupa los datos de un curso (propiedad: valor)
  {                               // --- curso de Inglés ---
    id: "ingles",                 // identificador interno: se usará en la URL (?curso=ingles) y para guardar el progreso
    titulo: "Inglés",             // nombre visible en la tarjeta
    descripcion: "Inglés desde Español", // subtítulo visible en la tarjeta
    bandera: "🇬🇧",               // bandera que pide la consigna en cada tarjeta
    nivel: "Intermedio (B1)",      // nivel que pide la consigna en cada tarjeta
    paginaLeccion: "leccionIngles.html",  // página del ejercicio (provisoria hasta la vista 4)
    unidades: [
      {
        titulo: "Saludos y presentaciones",              // nombre de la unidad
        lecciones: [
          { id: "l1", titulo: "Frases básicas", descripcion: "Saluda y despídete: Hello, Good morning, Goodbye." },
          { id: "l2", titulo: "Presentaciones", descripcion: "Di tu nombre y de dónde eres: My name is..., I am from..." }
        ]
      },
      {
        titulo: "Familia y hogar",
        lecciones: [
          { id: "l3", titulo: "Vocabulario de familia", descripcion: "Nombra a tu familia: mother, father, brother, sister." },
          { id: "l4", titulo: "La casa", descripcion: "Describe tu casa: kitchen, bedroom, bathroom, garden." }
        ]
      }
    ]
  },                           
  {
    id: "aleman",                         // nombre interno del curso
    titulo: "Alemán",                     // nombre que se ve
    descripcion: "Alemán desde Español",  // subtítulo
    bandera: "🇩🇪",                       // bandera
    nivel: "Principiante (A1)",           // nivel
    paginaLeccion: "leccionAleman.html",  // página del ejercicio (provisoria hasta la vista 4)
    unidades: [
      {
        titulo: "Saludos y presentaciones",
        lecciones: [
          { id: "l1", titulo: "Frases básicas", descripcion: "Saluda y despídete: Hallo, Guten Morgen, Tschüss." },
          { id: "l2", titulo: "Presentaciones", descripcion: "Di tu nombre y de dónde eres: Ich heiße..., Ich komme aus..." }
        ]
      },
      {
        titulo: "Familia y hogar",
        lecciones: [
          { id: "l3", titulo: "Vocabulario de familia", descripcion: "Nombra a tu familia: Mutter, Vater, Bruder, Schwester." },
          { id: "l4", titulo: "La casa", descripcion: "Describe tu casa: Küche, Schlafzimmer, Bad, Garten." }
        ]
      }
    ]
  },
  {
    id: "chino",                          // nombre interno del curso
    titulo: "Chino Mandarín",             // nombre que se ve
    descripcion: "Chino desde Español",   // subtítulo
    bandera: "🇨🇳",                       // bandera
    nivel: "Inicial (HSK 1)",             // nivel
    paginaLeccion: "leccionChino.html",   // página del ejercicio (provisoria hasta la vista 4)
    unidades: [
      {
        titulo: "Saludos y presentaciones",
        lecciones: [
          { id: "l1", titulo: "Frases básicas", descripcion: "Saluda y despídete: 你好 (nǐ hǎo), 再见 (zàijiàn)." },
          { id: "l2", titulo: "Presentaciones", descripcion: "Di tu nombre: 我叫... (wǒ jiào...), 我是... (wǒ shì...)." }
        ]
      },
      {
        titulo: "Familia y hogar",
        lecciones: [
          { id: "l3", titulo: "Vocabulario de familia", descripcion: "Nombra a tu familia: 妈妈 (māma), 爸爸 (bàba)." },
          { id: "l4", titulo: "La casa", descripcion: "Describe tu casa: 厨房 (chúfáng), 卧室 (wòshì)." }
        ]
      }
    ]
  }
];

// Busca un curso por su id (por ejemplo "ingles"). Si no existe, devuelve null.
export const buscarCurso = (id) => catalogoCursos.find((curso) => curso.id === id) || null;
