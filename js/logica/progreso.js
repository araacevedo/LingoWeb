// =============================================================================
// progreso.js  ·  CAPA LÓGICA
// Hace las cuentas sobre el avance de cada persona. No muestra nada en
// pantalla: solo calcula y devuelve el resultado.
// En la vista 4 la lección usa registrarLeccionCompletada para guardar el resultado.
// =============================================================================

// El progreso y sus resultados se guardan por usuario y por curso.
import { obtenerUsuarios, guardarUsuarios } from "../datos/almacenamiento.js";
import { obtenerUsuarioActivo } from "./autenticacion.js";

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
export const tieneActividad = (usuario) => usuario.xp > 0;

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

  // No vuelve a sumar XP si el resultado ya existe.
  if (usuario.progreso[cursoId][leccionId]) {
    return { ok: true, nueva: false, usuario };
  }

  usuario.progreso[cursoId][leccionId] = {
    xp,
    errores,
    fecha: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }),
  };
  usuario.xp += xp;

  guardarUsuarios(usuarios);

  return { ok: true, nueva: true, usuario };
};
