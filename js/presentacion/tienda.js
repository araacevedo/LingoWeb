// =============================================================================
// presentacion/tienda.js  ·  CONTROLADOR de tienda.html (Rachas y Tienda)
// =============================================================================

import { iniciarPaginaPrivada } from "./navegacion.js";
import { mostrarMensaje } from "./ui.js";
import { comprarRecompensa } from "../logica/tienda.js";
import { obtenerRachaYXpDiaria } from "../logica/rachaYMetaDiaria.js";

const usuario = iniciarPaginaPrivada();

if (usuario) {
  // 1. Mostrar datos iniciales del usuario (Racha y XP)
  const xpDisponible = document.getElementById("xp-disponible");
  const rachaActual = document.getElementById("racha-actual");
  const metaDiaria = document.getElementById("meta-diaria");

  const { racha, xpDiaria } = obtenerRachaYXpDiaria(usuario);
  const palabraDias = racha === 1 ? "día" : "días";

  xpDisponible.textContent = `⚡ ${usuario.xp} XP disponibles`;
  rachaActual.textContent = `${racha} ${palabraDias}`;
  metaDiaria.textContent = `${xpDiaria} / ${usuario.metaDiaria} XP`;

  // 2. Funcionalidad del filtro (Selector de recompensas)
  const filtro = document.getElementById("filtro-recompensas");
  const recompensas = document.querySelectorAll(".recompensa");

  filtro.addEventListener("change", (evento) => {
    const categoriaElegida = evento.target.value;

    recompensas.forEach((articulo) => {
      // Leemos la categoría guardada en el data-attribute del HTML
      const categoriaArticulo = articulo.getAttribute("data-categoria");

      // En lugar de usar la clase .oculto, usamos la propiedad booleana nativa .hidden
      if (
        categoriaElegida === "todas" ||
        categoriaElegida === categoriaArticulo
      ) {
        articulo.hidden = false; // Lo muestra
      } else {
        articulo.hidden = true; // Lo esconde (aprovechando el [hidden] con !important de tu CSS)
      }
    });
  });

  // 3. Funcionalidad de los botones de Canjear
  const botonesComprar = document.querySelectorAll(".boton-comprar");

  botonesComprar.forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      // Leemos el costo del data-attribute y lo convertimos a número
      const costo = Number(evento.target.getAttribute("data-costo"));

      // Pasamos la acción a la capa lógica
      const resultado = comprarRecompensa(usuario.id, costo);

      if (!resultado.ok) {
        // Falló (XP insuficiente o error de sesión)
        mostrarMensaje("mensaje-tienda", resultado.mensaje, false);
      } else {
        // Compra exitosa: actualizamos el texto de XP en la pantalla
        xpDisponible.textContent = `⚡ ${resultado.nuevoXp} XP disponibles`;
        // Para asegurar coherencia, actualizamos el objeto en memoria
        usuario.xp = resultado.nuevoXp;

        mostrarMensaje(
          "mensaje-tienda",
          `¡Compra realizada con éxito! Se han descontado ${costo} XP de tu cuenta.`,
          true,
        );
      }
    });
  });
}
