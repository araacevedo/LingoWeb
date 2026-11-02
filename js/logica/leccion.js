// =============================================================================
// leccion.js  ·  CAPA LÓGICA
// Las reglas de la lección interactiva: cuántas oportunidades hay, si una
// respuesta es correcta y cuánta experiencia se gana al terminar.
// No muestra nada en pantalla: solo decide y devuelve el resultado.
// =============================================================================

// Cantidad de oportunidades (vidas) por lección
export const VIDAS_POR_LECCION = 3;

// Compara las palabras elegidas con la respuesta del ejercicio activo.
// Devuelve true si son las mismas palabras y en el mismo orden.
export const evaluarRespuesta = (palabrasElegidas, respuestaCorrecta) => {
  // Pasa todas las palabras a minúsculas y sin espacios en los extremos, para comparar solo el contenido
  const normalizar = (palabras) =>
    palabras.map((palabra) => palabra.trim().toLowerCase());

  const seleccion = normalizar(palabrasElegidas);
  const correcta = normalizar(respuestaCorrecta);

  // Tienen que tener la misma cantidad de palabras y coincidir una por una, en el mismo orden.
  // every devuelve true solo si TODAS las palabras cumplen la condición.
  return (
    seleccion.length === correcta.length &&
    seleccion.every((palabra, indice) => palabra === correcta[indice])
  );
};

// Calcula la experiencia que se gana al terminar la lección, según los errores:
// 0 errores → 50 XP, 1 error → 40 XP, 2 errores → 30 XP (con 3 errores se pierde la lección).
// Math.max asegura que nunca baje de 10 XP.
export const calcularXpLeccion = (errores) => Math.max(50 - errores * 10, 10);
