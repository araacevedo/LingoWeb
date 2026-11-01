// =============================================================================
// progreso.js  ·  CAPA LÓGICA
// Hace las cuentas sobre el avance de cada persona. No muestra nada en
// pantalla: solo calcula y devuelve el resultado.
// En las vistas 3 y 4 se van a sumar acá las funciones para completar lecciones.
// =============================================================================

// Permite leer y guardar las cuentas desde la capa de datos.
import { obtenerUsuarios, guardarUsuarios } from "../datos/almacenamiento.js";

// Permite identificar la cuenta que está usando la aplicación.
import { obtenerUsuarioActivo } from "./autenticacion.js";

// Calcula qué porcentaje de un curso completó la persona (de 0 a 100).
export const calcularPorcentaje = (usuario, curso) => {
  // Buscamos la lista de lecciones terminadas de ese curso; si todavía no empezó, usamos una lista vacía
  const completadas = usuario.progreso[curso.id] || [];
  // Lecciones terminadas dividido el total, por 100; Math.round lo redondea para no mostrar decimales
  return Math.round((completadas.length / curso.totalLecciones) * 100);
};

// Indica si la cuenta ya tuvo alguna actividad. Toda lección suma experiencia,
// así que si la experiencia sigue en 0, la persona todavía no empezó nada.
export const tieneActividad = (usuario) => usuario.xp > 0;

// Registra una lección y recompensa solo si es la primera vez que se completa.
export const registrarLeccionCompletada = (cursoId, leccionId, xp = 10) => {
  const usuarioActivo = obtenerUsuarioActivo();

  // Sin sesión activa no hay una cuenta a la que asignar el avance.
  if (!usuarioActivo) {
    return { ok: false, mensaje: "No hay una sesión activa." };
  }

  const usuarios = obtenerUsuarios();

  // Busca la versión del usuario que está dentro de la lista que se guarda.
  const usuario = usuarios.find((item) => item.id === usuarioActivo.id);

  if (!usuario) {
    return { ok: false, mensaje: "No se encontró la cuenta activa." };
  }

  // Crea el objeto o la lista del curso si todavía no existen.
  usuario.progreso ??= {}; // asigna un valor por defecto si es undefined o null
  usuario.progreso[cursoId] ??= [];

  // Evita volver a premiar una lección ya completada.
  if (usuario.progreso[cursoId].includes(leccionId)) {
    // comprueba si la lección ya fue completada
    return { ok: true, nueva: false, usuario };
  }

  usuario.progreso[cursoId].push(leccionId);
  usuario.xp += xp;

  // Persiste los cambios para que sigan disponibles al volver a entrar.
  guardarUsuarios(usuarios);

  return { ok: true, nueva: true, usuario };
};
