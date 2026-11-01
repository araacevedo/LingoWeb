// =============================================================================
// opiniones.js  ·  CAPA LÓGICA
// Todo lo que tiene que ver con las valoraciones y comentarios de un curso:
// leer las de un curso, calcular el promedio y publicar una nueva.
// La consigna pide que cada opinión quede asociada al curso y a quien la publicó.
// =============================================================================

// Traemos lo que necesitamos de la capa de datos y de las validaciones
import { obtenerOpiniones, agregarOpinion, buscarUsuarioPorId } from "../datos/almacenamiento.js";
import { validarOpinion } from "./validaciones.js";

// Devuelve las opiniones de UN curso, de la más nueva a la más vieja,
// con el nombre de quien la escribió agregado.
export const obtenerOpinionesDelCurso = (cursoId) => {
  // filter se queda solo con las opiniones de este curso
  const delCurso = obtenerOpiniones().filter((opinion) => opinion.cursoId === cursoId);
  // map arma una copia de cada opinión con un dato más: el nombre del autor.
  // Lo buscamos por su id, así si la persona cambia su nombre en el perfil, se ve el nombre nuevo.
  const conAutor = delCurso.map((opinion) => {
    const autor = buscarUsuarioPorId(opinion.usuarioId);
    return { ...opinion, autor: autor ? autor.nombre : "Cuenta eliminada" };
  });
  // reverse da vuelta la lista: las últimas publicadas quedan arriba
  return conAutor.reverse();
};

// Calcula el promedio de estrellas de una lista de opiniones (por ejemplo 4.5).
// Si no hay opiniones, devuelve 0.
export const calcularPromedio = (opiniones) => {
  if (opiniones.length === 0) {
    return 0;
  }
  // Sumamos las estrellas de todas las opiniones
  let suma = 0;
  opiniones.forEach((opinion) => {
    suma = suma + opinion.estrellas;
  });
  // Dividimos por la cantidad; toFixed(1) deja un solo decimal y Number lo vuelve número
  return Number((suma / opiniones.length).toFixed(1));
};

// Publica una opinión nueva. Devuelve { ok: true } o { ok: false, campo, mensaje }, igual que el login.
export const publicarOpinion = (usuario, cursoId, estrellas, comentario) => {
  // Primero revisamos que los datos estén bien
  const error = validarOpinion(estrellas, comentario);
  if (error) {
    return { ok: false, ...error };
  }
  // Armamos la opinión: queda asociada al curso y al id de quien la publica
  const opinion = {
    id: "o-" + Date.now(),                          // id único, igual que en las cuentas
    cursoId,                                        // a qué curso pertenece
    usuarioId: usuario.id,                          // quién la publicó
    estrellas,                                      // calificación elegida (1 a 5)
    comentario,                                     // texto escrito
    // fecha de hoy con día y mes de dos cifras, por ejemplo "01/11/2026"
    fecha: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })
  };
  // La guardamos y avisamos que salió bien
  agregarOpinion(opinion);
  return { ok: true };
};
