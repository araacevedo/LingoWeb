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

// Devuelve las cuentas de una liga ordenadas de mayor a menor XP semanal.
// (Si una cuenta no tiene XP semanal guardada, cuenta como 0)
export const obtenerRankingPorLiga = (ligaRequerida) => {
  const usuariosLiga = obtenerUsuarios().filter((u) => u.liga === ligaRequerida);
  usuariosLiga.sort((a, b) => (b.xpSemanal || 0) - (a.xpSemanal || 0));
  return usuariosLiga;
};

// Devuelve la liga que sigue (por ejemplo, después de "Bronce" viene "Plata").
// Si es la última (Oro), devuelve null porque no hay a dónde ascender.
export const obtenerSiguienteLiga = (liga) => LIGAS[LIGAS.indexOf(liga) + 1] || null;

// Decide el estado de un puesto: "Ascenso" si está entre los primeros y hay una liga más arriba;
// si no, "Permanencia"
export const obtenerEstadoPuesto = (puesto, liga) =>
  obtenerSiguienteLiga(liga) && puesto <= PUESTOS_ASCENSO ? "Ascenso" : "Permanencia";
