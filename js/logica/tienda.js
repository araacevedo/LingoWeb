// =============================================================================
// logica/tienda.js  ·  CAPA LÓGICA
// Procesa las compras en la tienda: verifica si hay XP suficiente, descuenta
// el valor y actualiza el perfil del usuario.
// =============================================================================

import { obtenerUsuarios, guardarUsuarios } from "../datos/almacenamiento.js";

export const comprarRecompensa = (idUsuario, costo) => {
  const usuarios = obtenerUsuarios();
  
  // Buscamos la posición del usuario en el array para actualizarlo directamente
  const indice = usuarios.findIndex((u) => u.id === idUsuario);
  
  if (indice === -1) {
    return { ok: false, mensaje: "Error de sesión: no se encontró la cuenta." };
  }

  const usuario = usuarios[indice];

  // Verificamos si los fondos son suficientes
  if (usuario.xp < costo) {
    return { 
      ok: false, 
      mensaje: `Necesitas ${costo} XP para esta recompensa y tienes ${usuario.xp} XP. ¡Completa más lecciones para sumar puntos!` 
    };
  }

  // Descontamos el XP y guardamos la lista actualizada
  usuario.xp = usuario.xp - costo;
  guardarUsuarios(usuarios);

  return { ok: true, nuevoXp: usuario.xp };
};