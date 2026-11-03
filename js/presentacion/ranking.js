// =============================================================================
// presentacion/ranking.js  ·  CONTROLADOR de ranking.html, rankingPlata.html, rankingOro.html
// =============================================================================

import { iniciarPaginaPrivada } from "./navegacion.js";
import { obtenerRankingPorLiga } from "../logica/ranking.js";

const usuarioActivo = iniciarPaginaPrivada();

const calcularIniciales = (nombreCompleto) => {
  const palabras = nombreCompleto.split(" ");
  let iniciales = "";
  if (palabras.length > 0) iniciales = iniciales + palabras[0][0];
  if (palabras.length > 1) iniciales = iniciales + palabras[1][0];
  return iniciales.toUpperCase();
};

if (usuarioActivo) {
  const tbody = document.getElementById("cuerpo-ranking");

  if (tbody) {
    // 1. Leemos la liga desde la URL
    const parametros = new URLSearchParams(window.location.search);
    let ligaActual = parametros.get("liga");

    // 2. Si entran a ranking.html a secas (sin parámetro), mostramos su liga por defecto
    if (!ligaActual) {
      ligaActual = usuarioActivo.liga;
    }

    // 3. Actualizamos el título <h2>
    const tituloLiga = document.getElementById("nombre-liga");
    if (tituloLiga) {
      tituloLiga.textContent = `Liga ${ligaActual}`;
    }

    // 4. Marcamos visualmente la pestaña activa en el menú
    document.querySelectorAll(".tab-liga").forEach(tab => {
      if (tab.getAttribute("data-liga") === ligaActual) {
        tab.classList.add("liga-activa");
      } else {
        tab.classList.remove("liga-activa");
      }
    });
    const usuariosRanking = obtenerRankingPorLiga(ligaActual);

    // Actualizar el texto informativo con la liga real del usuario conectado
    const parrafoHeader = document.querySelector(".ranking-header p");
    if (parrafoHeader) {
      const textoAscenso = ligaActual === "Oro"
        ? "Estás consultando la Liga de Oro (liga máxima)."
        : "Los 5 primeros ascienden a la siguiente liga esta semana.";
      parrafoHeader.textContent = `${textoAscenso} Tu liga actual es ${usuarioActivo.liga}.`;
    }

    tbody.innerHTML = "";

    // Si no hay participantes en esta liga, mostramos mensaje informativo
    if (usuariosRanking.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">Todavía no hay participantes registrados en la Liga ${ligaActual}.</td></tr>`;
    } else {
      usuariosRanking.forEach((estudiante, index) => {
        const puesto = index + 1;

        let textoPuesto = puesto;
        if (puesto === 1) textoPuesto = "🥇 1";
        else if (puesto === 2) textoPuesto = "🥈 2";
        else if (puesto === 3) textoPuesto = "🥉 3";

        let estado = "Zona Segura";
        if (puesto <= 5 && ligaActual !== "Oro") {
          estado = "Zona de Ascenso";
        }

        const iniciales = calcularIniciales(estudiante.nombre);
        const esUsuarioActual = estudiante.id === usuarioActivo.id;
        const nombreMostrar = esUsuarioActual
          ? `${estudiante.usuario} <span>(Tú)</span>`
          : estudiante.usuario;

        const tr = document.createElement("tr");
        if (esUsuarioActual) {
          tr.classList.add("usuario-actual");
        }

        tr.innerHTML = `
          <td>${textoPuesto}</td>
          <td><div class="avatar">${iniciales}</div></td>
          <td>${nombreMostrar}</td>
          <td>${estudiante.xp} XP</td>
          <td>${estado}</td>
        `;

        tbody.appendChild(tr);
      });
    }
  }
}