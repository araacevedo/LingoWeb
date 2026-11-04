// =============================================================================
// logica/ranking.js  ·  CAPA LÓGICA
// Reglas de la tabla de clasificación (Vista 6): qué ligas hay, quiénes
// participan en cada una, en qué orden y quiénes ascienden.
// No muestra nada en pantalla: solo decide y devuelve el resultado.
// =============================================================================

import { obtenerUsuarios } from "../datos/almacenamiento.js";

// Las ligas, de la más baja a la más alta. El orden sirve para saber a cuál se asciende
export const LIGAS = ["Bronce", "Plata", "Oro"];

// Cuántos puestos de arriba ascienden a la liga siguiente cada semana
export const PUESTOS_ASCENSO = 3;

// Identifica la semana con la fecha de su lunes, usando el horario local.
export const obtenerInicioSemana = (fecha = new Date()) => {
  // Copia la fecha para no modificar la original.
  const lunes = new Date(fecha);

  // getDay(): domingo = 0, lunes = 1, ..., sábado = 6.
  // Convertimos ese número en los días transcurridos desde el lunes.
  const diasDesdeLunes = (lunes.getDay() + 6) % 7;

  // Retrocede hasta el lunes; también funciona entre meses y años.
  lunes.setDate(lunes.getDate() - diasDesdeLunes);

  const anio = lunes.getFullYear();
  const mes = String(lunes.getMonth() + 1).padStart(2, "0");
  const dia = String(lunes.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};

// Devuelve solamente los puntos que pertenecen a la semana consultada.
export const obtenerXpSemanal = (usuario, fecha = new Date()) => {
  const semanaActual = obtenerInicioSemana(fecha);

  // Si la semana no coincide, sus puntos semanales vigentes son 0.
  return usuario.semanaXp === semanaActual ? (usuario.xpSemanal ?? 0) : 0;
};

// Devuelve las cuentas de una liga ordenadas de mayor a menor XP semanal.
// (Si una cuenta no tiene XP semanal guardada, cuenta como 0)
export const obtenerRankingPorLiga = (ligaRequerida) => {
  const usuariosLiga = obtenerUsuarios().filter(
    (u) => u.liga === ligaRequerida,
  );
  // Ordena de mayor a menor usando solamente los puntos de esta semana.
  const fechaActual = new Date();
  usuariosLiga.sort(
    (a, b) =>
      obtenerXpSemanal(b, fechaActual) - obtenerXpSemanal(a, fechaActual),
  );
  return usuariosLiga;
};

// Devuelve la liga que sigue (por ejemplo, después de "Bronce" viene "Plata").
// Si es la última (Oro), devuelve null porque no hay a dónde ascender.
export const obtenerSiguienteLiga = (liga) =>
  LIGAS[LIGAS.indexOf(liga) + 1] || null;

// Decide el estado de un puesto: "Ascenso" si está entre los primeros y hay una liga más arriba;
// si no, "Permanencia"
export const obtenerEstadoPuesto = (puesto, liga) =>
  obtenerSiguienteLiga(liga) && puesto <= PUESTOS_ASCENSO
    ? "Ascenso"
    : "Permanencia";
