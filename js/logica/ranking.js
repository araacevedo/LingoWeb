// =============================================================================
// logica/ranking.js  ·  CAPA LÓGICA
// Filtra los usuarios por liga y los ordena de mayor a menor XP.
// =============================================================================

import { obtenerUsuarios } from "../datos/almacenamiento.js";

export const obtenerRankingPorLiga = (ligaRequerida) => {
  const todosLosUsuarios = obtenerUsuarios();
  const usuariosLiga = todosLosUsuarios.filter((u) => u.liga === ligaRequerida);
  usuariosLiga.sort((a, b) => b.xp - a.xp);
  return usuariosLiga;
};