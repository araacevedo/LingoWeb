// =============================================================================
// presentacion/ranking.js  ·  CONTROLADOR de ranking.html (Vista 6)
// Arma la tabla de clasificación de la liga elegida:
//   - marca la pestaña de la liga elegida y escribe su nombre e indicación de ascenso
//   - una fila por participante, ordenadas por XP semanal, con la fila propia resaltada
//   - un mensaje si la liga no tiene participantes
// La liga se elige con la dirección: ranking.html?liga=Plata
// Si no viene ninguna, se muestra la liga de la persona conectada.
// (Parte de la versión que armó el grupo, que usaba una página por liga)
// =============================================================================

import { iniciarPaginaPrivada } from "./navegacion.js";
import { LIGAS, PUESTOS_ASCENSO, obtenerRankingPorLiga, obtenerSiguienteLiga, obtenerEstadoPuesto } from "../logica/ranking.js";

// El portero: nos da la cuenta de quien está conectado, o null si lo mandó al login
const usuarioActivo = iniciarPaginaPrivada();

// Extrae hasta 2 iniciales del nombre de forma simple (para el avatar)
const calcularIniciales = (nombreCompleto) => {
  const palabras = nombreCompleto.split(" ");
  let iniciales = "";
  if (palabras.length > 0) iniciales = iniciales + palabras[0][0];
  if (palabras.length > 1) iniciales = iniciales + palabras[1][0];
  return iniciales.toUpperCase();
};

// Elige qué liga mostrar: la de la dirección si es válida; si no, la de la persona conectada
const elegirLiga = () => {
  const pedida = new URLSearchParams(window.location.search).get("liga");
  // includes revisa que la liga pedida sea una de las que existen (Bronce, Plata u Oro)
  if (LIGAS.includes(pedida)) return pedida;
  return LIGAS.includes(usuarioActivo.liga) ? usuarioActivo.liga : LIGAS[0];
};

// Marca la pestaña de la liga elegida (la clase liga-activa ya tiene su estilo en el CSS)
const marcarPestaña = (liga) => {
  document.querySelectorAll(".tab-liga").forEach((pestaña) => {
    const esLaElegida = pestaña.dataset.liga === liga;
    pestaña.classList.toggle("liga-activa", esLaElegida);
    // aria-current le dice a los lectores de pantalla cuál es la opción elegida
    if (esLaElegida) pestaña.setAttribute("aria-current", "page");
    else pestaña.removeAttribute("aria-current");
  });
};

// Escribe el nombre de la liga y la indicación de ascenso o permanencia
const mostrarEncabezado = (liga) => {
  document.title = `Clasificación Liga ${liga} | LingoWeb`;
  document.querySelector("#nombre-liga").textContent = `Liga ${liga}`;

  const siguiente = obtenerSiguienteLiga(liga);
  // En Oro no hay a dónde ascender: todos permanecen
  const textoAscenso = siguiente
    ? `Los ${PUESTOS_ASCENSO} primeros ascienden a la Liga ${siguiente} esta semana; el resto permanece.`
    : "Es la liga máxima: todos los participantes permanecen.";
  document.querySelector("#info-liga").textContent = `${textoAscenso} Tu liga actual es ${usuarioActivo.liga}.`;
};

// Arma la tabla con los participantes de la liga
const mostrarTabla = (liga) => {
  const tbody = document.getElementById("cuerpo-ranking");
  const usuariosRanking = obtenerRankingPorLiga(liga);
  tbody.innerHTML = "";

  // Si no hay participantes en esta liga, mostramos un mensaje en vez de una tabla vacía
  if (usuariosRanking.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Todavía no hay participantes registrados en la Liga ${liga}.</td></tr>`;
    return;
  }

  usuariosRanking.forEach((estudiante, index) => {
    const puesto = index + 1;

    // Medallas para los tres primeros
    let textoPuesto = puesto;
    if (puesto === 1) textoPuesto = "🥇 1";
    else if (puesto === 2) textoPuesto = "🥈 2";
    else if (puesto === 3) textoPuesto = "🥉 3";

    // La lógica decide si asciende o permanece; acá solo le ponemos una flecha además del texto
    const estado = obtenerEstadoPuesto(puesto, liga);
    const textoEstado = estado === "Ascenso" ? "⬆ Ascenso" : "= Permanencia";

    const iniciales = calcularIniciales(estudiante.nombre);
    const esUsuarioActual = estudiante.id === usuarioActivo.id;
    const nombreMostrar = esUsuarioActual ? `${estudiante.usuario} <span>(Tú)</span>` : estudiante.usuario;

    const tr = document.createElement("tr");
    // La fila de la persona conectada lleva la clase que la resalta (ya definida en el CSS)
    if (esUsuarioActual) {
      tr.classList.add("usuario-actual");
    }

    tr.innerHTML = `
      <td>${textoPuesto}</td>
      <td><div class="avatar">${iniciales}</div></td>
      <td>${nombreMostrar}</td>
      <td>${estudiante.xpSemanal || 0} XP</td>
      <td>${textoEstado}</td>
    `;
    tbody.appendChild(tr);
  });
};

// Solo armamos la página si hay alguien conectado
if (usuarioActivo) {
  const liga = elegirLiga();
  marcarPestaña(liga);
  mostrarEncabezado(liga);
  mostrarTabla(liga);
}
