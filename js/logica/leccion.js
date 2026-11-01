// Compara las palabras elegidas con la respuesta del ejercicio activo.
export const evaluarRespuesta = (palabrasElegidas, respuestaCorrecta) => {
  // Normaliza mayúsculas y espacios para comparar el contenido.
  const normalizar = (palabras) =>
    palabras.map((palabra) => palabra.trim().toLowerCase());

  const seleccion = normalizar(palabrasElegidas);
  const correcta = normalizar(respuestaCorrecta);

  // El orden y la cantidad de palabras también deben coincidir.
  return (
    seleccion.length === correcta.length &&
    seleccion.every((palabra, indice) => palabra === correcta[indice])
  );
};
