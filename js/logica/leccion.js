// Respuesta correcta de este ejercicio, en el orden esperado.
const respuestaCorrecta = ["Buenos", "días", "¿cómo", "estás?"];

// Compara la selección con la respuesta esperada.
export const evaluarRespuesta = (palabrasElegidas) => {
  const seleccion = palabrasElegidas.map((palabra) =>
    palabra.trim().toLowerCase(), // Normalizo la selección para que no importe mayúsculas ni espacios al principio o al final
  );

  const correcta = respuestaCorrecta.map((palabra) => 
    palabra.toLowerCase(),
  );

  return (
    seleccion.length === correcta.length &&
    seleccion.every((palabra, indice) => palabra === correcta[indice])
  ); // Devuelve true si la selección coincide con la respuesta correcta, false en caso contrario
};