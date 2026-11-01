// =============================================================================
// progreso.js  ·  CAPA LÓGICA
// Hace las cuentas sobre el avance de cada persona. No muestra nada en
// pantalla: solo calcula y devuelve el resultado.
// En las vistas 3 y 4 se van a sumar acá las funciones para completar lecciones.
// =============================================================================
 
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