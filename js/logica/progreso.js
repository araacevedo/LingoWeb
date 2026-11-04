// =============================================================================
// progreso.js  ·  CAPA LÓGICA
// Hace las cuentas sobre el avance de cada persona. No muestra nada en
// pantalla: solo calcula y devuelve el resultado.
// En la vista 4 la lección usa registrarLeccionCompletada para guardar el resultado.
// =============================================================================

// El progreso y sus resultados se guardan por usuario y por curso.
import { obtenerUsuarios, guardarUsuarios } from "../datos/almacenamiento.js";
import { obtenerUsuarioActivo } from "./autenticacion.js";
import { actualizarRachaYXpDiaria } from "./rachaYMetaDiaria.js";
import { obtenerInicioSemana, obtenerXpSemanal } from "./ranking.js";

// Convierte las unidades del curso en una sola lista de lecciones.
export const obtenerLecciones = (curso) =>
  curso.unidades.flatMap((unidad) => unidad.lecciones);

// Devuelve los resultados guardados para un curso o un objeto vacío.
export const obtenerResultados = (usuario, cursoId) =>
  usuario.progreso?.[cursoId] ?? {};

// Calcula el porcentaje a partir de las lecciones que tienen resultado.
export const calcularPorcentaje = (usuario, curso) => {
  const lecciones = obtenerLecciones(curso);
  const resultados = obtenerResultados(usuario, curso.id);

  if (lecciones.length === 0) return 0;

  const completadas = lecciones.filter(
    (leccion) => resultados[leccion.id],
  ).length;

  return Math.round((completadas / lecciones.length) * 100);
};

// Devuelve la primera lección que todavía no fue completada.
export const obtenerLeccionActual = (usuario, curso) => {
  const resultados = obtenerResultados(usuario, curso.id);

  return (
    obtenerLecciones(curso).find((leccion) => !resultados[leccion.id]) ?? null
  );
};

// Marca cada lección como completada, en curso o bloqueada según el orden.
export const obtenerEstadoLeccion = (usuario, curso, leccion) => {
  const resultados = obtenerResultados(usuario, curso.id);

  if (resultados[leccion.id]) return "completada";
  if (obtenerLeccionActual(usuario, curso)?.id === leccion.id) {
    return "en-progreso";
  }

  return "bloqueada";
};

// Indica si la persona ya ganó experiencia.
export const tieneActividad = (usuario) =>
  usuario.xp > 0 || contarLeccionesCompletadas(usuario) > 0; //tiene actividad si tiene XP o lecciones completadas

// Cuenta cuántas lecciones terminó la persona sumando todos sus cursos (la muestra el perfil en "Mis logros").
// Object.values da los resultados de cada curso; Object.keys(...).length cuenta las lecciones de cada uno.
export const contarLeccionesCompletadas = (usuario) => {
  let total = 0;
  Object.values(usuario.progreso || {}).forEach((resultadosDelCurso) => {
    total = total + Object.keys(resultadosDelCurso).length;
  });
  return total;
};

// Guarda el resultado y suma XP solo la primera vez que se completa.
// La experiencia (xp) la calcula logica/leccion.js según los errores.
export const registrarLeccionCompletada = (cursoId, leccionId, xp, errores) => {
  const usuarioActivo = obtenerUsuarioActivo();

  if (!usuarioActivo) {
    return { ok: false, mensaje: "No hay una sesión activa." };
  }

  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find((item) => item.id === usuarioActivo.id);

  if (!usuario) {
    return { ok: false, mensaje: "No se encontró la cuenta activa." };
  }

  usuario.progreso ??= {};
  usuario.progreso[cursoId] ??= {};

  // Repasar cuenta como actividad del día, pero no vuelve a otorgar XP.
  if (usuario.progreso[cursoId][leccionId]) {
    actualizarRachaYXpDiaria(usuario, 0);

    // Guarda la fecha y la racha actualizadas antes de salir.
    guardarUsuarios(usuarios);

    return { ok: true, nueva: false, usuario };
  }

  usuario.progreso[cursoId][leccionId] = {
    xp,
    errores,
    fecha: new Date().toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };
  usuario.xp += xp;

  // Conserva los puntos de esta semana y suma los de la lección.
  // Si los anteriores son de otra semana, obtenerXpSemanal devuelve 0.
  const fechaActual = new Date();
  usuario.xpSemanal = obtenerXpSemanal(usuario, fechaActual) + xp;

  // Guarda a qué semana pertenece el puntaje actualizado.
  usuario.semanaXp = obtenerInicioSemana(fechaActual);
  actualizarRachaYXpDiaria(usuario, xp);
  guardarUsuarios(usuarios);

  return { ok: true, nueva: true, usuario };
};
