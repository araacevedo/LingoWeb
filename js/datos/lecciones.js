// =============================================================================
// lecciones.js  ·  CAPA DE DATOS
// Los ejercicios de cada lección, separados por curso y por lección:
//   ejerciciosPorCurso → ingles / aleman / chino → l1, l2, l3, l4 → lista de ejercicios
// Así la misma página (leccion.html) muestra los ejercicios del curso elegido.
// Los id de las lecciones (l1, l2...) son los mismos que en catalogo.js.
//
// Cada ejercicio tiene:
//   frase     → la oración en el idioma del curso, que hay que traducir
//   audio     → (opcional) archivo con la pronunciación; si no tiene, no se muestra el reproductor
//   palabras  → las opciones del banco de palabras (incluye algunas que sobran, para despistar)
//   respuesta → las palabras correctas, en el orden correcto
// =============================================================================
// Cada propiedad corresponde al ID que llega desde el mapa del curso.
export const ejerciciosPorCurso = {
  // ---------------------------------------------------------------- INGLÉS
  ingles: {
  l1: [
    {
      frase: "Good morning, how are you?",
      audio: "audio/leccion-ingles.mp3",
      palabras: ["Buenos", "días", "¿cómo", "estás?", "Hola", "Gracias", "Adiós"],
      respuesta: ["Buenos", "días", "¿cómo", "estás?"],
    },
    {
      frase: "Thank you very much.",
      audio: "audio/ingles/l1-e2.wav",
      palabras: ["Muchas", "gracias", "por", "favor", "Hola", "Adiós"],
      respuesta: ["Muchas", "gracias"],
    },
    {
      frase: "Goodbye, see you tomorrow.",
      audio: "audio/ingles/l1-e3.wav",
      palabras: ["Adiós", "hasta", "mañana", "Buenos", "días", "gracias"],
      respuesta: ["Adiós", "hasta", "mañana"],
    },
  ],
  l2: [
    {
      frase: "What is your name?",
      audio: "audio/ingles/l2-e1.wav",
      palabras: ["¿Cómo", "te", "llamas?", "Dónde", "estás?"],
      respuesta: ["¿Cómo", "te", "llamas?"],
    },
    {
      frase: "My name is Ana.",
      audio: "audio/ingles/l2-e2.wav",
      palabras: ["Me", "llamo", "Ana.", "Soy", "de"],
      respuesta: ["Me", "llamo", "Ana."],
    },
    {
      frase: "I am from Argentina.",
      audio: "audio/ingles/l2-e3.wav",
      palabras: ["Soy", "de", "Argentina.", "Me", "llamo"],
      respuesta: ["Soy", "de", "Argentina."],
    },
  ],
  l3: [
    {
      frase: "This is my mother.",
      audio: "audio/ingles/l3-e1.wav",
      palabras: ["Esta", "es", "mi", "madre.", "padre."],
      respuesta: ["Esta", "es", "mi", "madre."],
    },
    {
      frase: "This is my father.",
      audio: "audio/ingles/l3-e2.wav",
      palabras: ["Este", "es", "mi", "padre.", "hermano."],
      respuesta: ["Este", "es", "mi", "padre."],
    },
    {
      frase: "I have one brother.",
      audio: "audio/ingles/l3-e3.wav",
      palabras: ["Tengo", "un", "hermano.", "una", "hermana."],
      respuesta: ["Tengo", "un", "hermano."],
    },
  ],
  l4: [
    {
      frase: "The kitchen is big.",
      audio: "audio/ingles/l4-e1.wav",
      palabras: ["La", "cocina", "es", "grande.", "pequeña."],
      respuesta: ["La", "cocina", "es", "grande."],
    },
    {
      frase: "My bedroom is small.",
      audio: "audio/ingles/l4-e2.wav",
      palabras: ["Mi", "habitación", "es", "pequeña.", "grande."],
      respuesta: ["Mi", "habitación", "es", "pequeña."],
    },
    {
      frase: "The garden is next to the house.",
      audio: "audio/ingles/l4-e3.wav",
      palabras: ["El", "jardín", "está", "al", "lado", "de", "la", "casa.", "cocina."],
      respuesta: ["El", "jardín", "está", "al", "lado", "de", "la", "casa."],
    },
  ],
}, 

// ---------------------------------------------------------------- ALEMÁN
  aleman: {
    l1: [
      {
        frase: "Guten Tag, wie geht es dir?",
        audio: "audio/leccion-aleman.mp3",   // el audio que ya tenía la lección de alemán del TP1
        palabras: ["Buenos", "días", "¿cómo", "estás?", "Hola", "Gracias", "Adiós"],
        respuesta: ["Buenos", "días", "¿cómo", "estás?"],
      },
      {
        frase: "Danke schön.",
        palabras: ["Muchas", "gracias", "por", "favor", "Hola", "Adiós"],
        respuesta: ["Muchas", "gracias"],
      },
      {
        frase: "Tschüss, bis morgen.",
        palabras: ["Adiós", "hasta", "mañana", "Buenos", "días", "gracias"],
        respuesta: ["Adiós", "hasta", "mañana"],
      },
    ],
    l2: [
      {
        frase: "Wie heißt du?",
        palabras: ["¿Cómo", "te", "llamas?", "Dónde", "estás?"],
        respuesta: ["¿Cómo", "te", "llamas?"],
      },
      {
        frase: "Ich heiße Ana.",
        palabras: ["Me", "llamo", "Ana.", "Soy", "de"],
        respuesta: ["Me", "llamo", "Ana."],
      },
      {
        frase: "Ich komme aus Argentinien.",
        palabras: ["Soy", "de", "Argentina.", "Me", "llamo"],
        respuesta: ["Soy", "de", "Argentina."],
      },
    ],
    l3: [
      {
        frase: "Das ist meine Mutter.",
        palabras: ["Esta", "es", "mi", "madre.", "padre."],
        respuesta: ["Esta", "es", "mi", "madre."],
      },
      {
        frase: "Das ist mein Vater.",
        palabras: ["Este", "es", "mi", "padre.", "hermano."],
        respuesta: ["Este", "es", "mi", "padre."],
      },
      {
        frase: "Ich habe einen Bruder.",
        palabras: ["Tengo", "un", "hermano.", "una", "hermana."],
        respuesta: ["Tengo", "un", "hermano."],
      },
    ],
    l4: [
      {
        frase: "Die Küche ist groß.",
        palabras: ["La", "cocina", "es", "grande.", "pequeña."],
        respuesta: ["La", "cocina", "es", "grande."],
      },
      {
        frase: "Mein Schlafzimmer ist klein.",
        palabras: ["Mi", "habitación", "es", "pequeña.", "grande."],
        respuesta: ["Mi", "habitación", "es", "pequeña."],
      },
      {
        frase: "Der Garten ist neben dem Haus.",
        palabras: ["El", "jardín", "está", "al", "lado", "de", "la", "casa.", "cocina."],
        respuesta: ["El", "jardín", "está", "al", "lado", "de", "la", "casa."],
      },
    ],
  },
 
  // ---------------------------------------------------------------- CHINO MANDARÍN
  // Cada frase lleva entre paréntesis su pronunciación (pinyin) para poder leerla.
  chino: {
    l1: [
      {
        frase: "你好，你好吗？ (nǐ hǎo, nǐ hǎo ma?)",
        audio: "audio/leccion-chino.mp3",    // el audio que ya tenía la lección de chino del TP1
        palabras: ["Hola,", "¿cómo", "estás?", "Gracias", "Adiós", "días"],
        respuesta: ["Hola,", "¿cómo", "estás?"],
      },
      {
        frase: "非常感谢。 (fēicháng gǎnxiè.)",
        palabras: ["Muchas", "gracias", "por", "favor", "Hola", "Adiós"],
        respuesta: ["Muchas", "gracias"],
      },
      {
        frase: "再见，明天见。 (zàijiàn, míngtiān jiàn.)",
        palabras: ["Adiós", "hasta", "mañana", "Buenos", "días", "gracias"],
        respuesta: ["Adiós", "hasta", "mañana"],
      },
    ],
    l2: [
      {
        frase: "你叫什么名字？ (nǐ jiào shénme míngzi?)",
        palabras: ["¿Cómo", "te", "llamas?", "Dónde", "estás?"],
        respuesta: ["¿Cómo", "te", "llamas?"],
      },
      {
        frase: "我叫安娜。 (wǒ jiào Ānnà.)",
        palabras: ["Me", "llamo", "Ana.", "Soy", "de"],
        respuesta: ["Me", "llamo", "Ana."],
      },
      {
        frase: "我来自阿根廷。 (wǒ láizì Āgēntíng.)",
        palabras: ["Soy", "de", "Argentina.", "Me", "llamo"],
        respuesta: ["Soy", "de", "Argentina."],
      },
    ],
    l3: [
      {
        frase: "这是我妈妈。 (zhè shì wǒ māma.)",
        palabras: ["Esta", "es", "mi", "madre.", "padre."],
        respuesta: ["Esta", "es", "mi", "madre."],
      },
      {
        frase: "这是我爸爸。 (zhè shì wǒ bàba.)",
        palabras: ["Este", "es", "mi", "padre.", "hermano."],
        respuesta: ["Este", "es", "mi", "padre."],
      },
      {
        frase: "我有一个哥哥。 (wǒ yǒu yí ge gēge.)",
        palabras: ["Tengo", "un", "hermano.", "una", "hermana."],
        respuesta: ["Tengo", "un", "hermano."],
      },
    ],
    l4: [
      {
        frase: "厨房很大。 (chúfáng hěn dà.)",
        palabras: ["La", "cocina", "es", "grande.", "pequeña."],
        respuesta: ["La", "cocina", "es", "grande."],
      },
      {
        frase: "我的卧室很小。 (wǒ de wòshì hěn xiǎo.)",
        palabras: ["Mi", "habitación", "es", "pequeña.", "grande."],
        respuesta: ["Mi", "habitación", "es", "pequeña."],
      },
      {
        frase: "花园在房子旁边。 (huāyuán zài fángzi pángbiān.)",
        palabras: ["El", "jardín", "está", "al", "lado", "de", "la", "casa.", "cocina."],
        respuesta: ["El", "jardín", "está", "al", "lado", "de", "la", "casa."],
      },
    ],
  },
};
 
// Devuelve los ejercicios de una lección de un curso.
// Si el curso o la lección no existen, devuelve una lista vacía.
export const buscarEjercicios = (cursoId, leccionId) => {
  // Primero buscamos el curso; si no está, usamos un objeto vacío para no provocar un error
  const delCurso = ejerciciosPorCurso[cursoId] || {};
  // Después la lección dentro de ese curso; si no está, una lista vacía
  return delCurso[leccionId] || [];
};
