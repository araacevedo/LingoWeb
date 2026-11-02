// =============================================================================
// leccion.js  ·  CONTROLADOR de leccion.html (Vista 4)
// Muestra los ejercicios de la lección elegida, uno por uno:
//   - la frase, el audio (si tiene), el banco de palabras, el avance y las vidas
//   - la persona elige o quita palabras y presiona "Comprobar respuesta"
//   - si acierta, puede continuar; si se equivoca, pierde una vida y vuelve a intentar
//   - al terminar, guarda el resultado y muestra un resumen con la experiencia ganada
// El curso y la lección se eligen con la dirección: leccion.html?curso=ingles&leccion=l2
// (Parte de la versión de inglés que armó el grupo en leccionIngles.js)
// =============================================================================

// Traemos lo que necesitamos de cada capa
import { iniciarPaginaPrivada } from "./navegacion.js";
import { buscarCurso } from "../datos/catalogo.js";
import { buscarEjercicios } from "../datos/lecciones.js";
import { evaluarRespuesta, calcularXpLeccion, VIDAS_POR_LECCION } from "../logica/leccion.js";
import { obtenerLecciones, obtenerEstadoLeccion, obtenerLeccionActual, registrarLeccionCompletada } from "../logica/progreso.js";

// El portero: nos da la cuenta de quien está conectado, o null si lo mandó al login
const usuario = iniciarPaginaPrivada();

// Buscamos en el HTML los elementos que vamos a ir cambiando
const respuesta = document.querySelector("#respuesta");
const bancoPalabras = document.querySelector("#banco-palabras");
const frase = document.querySelector("#frase");
const audio = document.querySelector("#audio-ejercicio");
const numeroEjercicio = document.querySelector("#numero-ejercicio");
const progresoTexto = document.querySelector("#progreso-texto");
const barraProgreso = document.querySelector("#barra-progreso");
const mensajeResultado = document.querySelector("#mensaje-resultado");
const botonComprobar = document.querySelector("#comprobar-respuesta");
const botonContinuar = document.querySelector("#continuar-leccion");
const botonReintentar = document.querySelector("#reintentar-leccion");
const vidas = document.querySelector(".vidas");
const enlaceVolverCurso = document.querySelector("#volver-curso");

// Leemos de la dirección qué curso y qué lección se eligieron en el mapa
const parametros = new URLSearchParams(window.location.search);
const curso = buscarCurso(parametros.get("curso"));
const leccionId = parametros.get("leccion");
// Buscamos la lección dentro del curso (para saber su título). Si el curso no existe, queda en null
const leccion = curso ? obtenerLecciones(curso).find((item) => item.id === leccionId) || null : null;
// Los ejercicios de esa lección de ese curso (lista vacía si no hay)
const ejercicios = curso ? buscarEjercicios(curso.id, leccionId) : [];

// Dirección para volver al mapa justo en esta lección (por ejemplo curso.html?curso=ingles#leccion-l2).
// Si el curso no existe, volvemos al dashboard
const urlMapa = curso ? `curso.html?curso=${curso.id}#leccion-${leccionId}` : "dashboard.html";

// Estado de la lección mientras se hace
let indiceEjercicio = 0;                   // qué ejercicio se está mostrando (las listas empiezan en 0)
let errores = 0;                           // respuestas incorrectas en toda la lección
let vidasRestantes = VIDAS_POR_LECCION;    // oportunidades que quedan
let actividadPendiente = false;            // true cuando ya empezó a responder y todavía no terminó

// ---------------------------------------------------------------------------
// Funciones para mostrar cosas en pantalla
// ---------------------------------------------------------------------------

// Muestra el estado del ejercicio. Cada estado lleva un texto propio (no depende solo del color):
//   "pendiente"  → instrucción, recuadro neutro
//   "correcta"   → ✓ y recuadro verde
//   "incorrecta" → ✕ y recuadro rojo
const mostrarEstado = (tipo, texto) => {
  // Elegimos el símbolo según el tipo
  const simbolos = { pendiente: "", correcta: "✓ ", incorrecta: "✕ " };
  mensajeResultado.textContent = simbolos[tipo] + texto;
  // Quitamos los colores anteriores y ponemos el que corresponde (clases del CSS del proyecto)
  mensajeResultado.classList.remove("resultado-correcto", "resultado-incorrecto");
  if (tipo === "correcta") mensajeResultado.classList.add("resultado-correcto");
  if (tipo === "incorrecta") mensajeResultado.classList.add("resultado-incorrecto");
};

// Esconde el ejercicio y muestra el bloque de cierre: el resumen final o el aviso de que no se puede hacer
const mostrarCierre = (titulo, texto, esExito) => {
  document.querySelector("#ejercicio").hidden = true;
  const cierre = document.querySelector("#cierre-leccion");
  document.querySelector("#cierre-titulo").textContent = titulo;
  document.querySelector("#cierre-texto").textContent = texto;
  document.querySelector("#cierre-mapa").href = urlMapa;
  // Verde si terminó bien, rojo si es un aviso
  cierre.classList.add(esExito ? "resultado-correcto" : "resultado-incorrecto");
  cierre.hidden = false;
};

// Dibuja los corazones: ❤️ por cada vida que queda y 🤍 por las perdidas
const mostrarVidas = () => {
  vidas.textContent = "❤️".repeat(vidasRestantes) + "🤍".repeat(VIDAS_POR_LECCION - vidasRestantes);
  // Para los lectores de pantalla lo decimos con palabras
  vidas.setAttribute("aria-label", `Vidas restantes: ${vidasRestantes} de ${VIDAS_POR_LECCION}`);
};

// Habilita o deshabilita todas las palabras (por ejemplo, después de acertar o al quedarse sin vidas)
const bloquearPalabras = (bloquear) => {
  document.querySelectorAll(".palabra").forEach((boton) => {
    boton.disabled = bloquear;
  });
};

// Muestra en pantalla el ejercicio actual
const mostrarEjercicio = () => {
  const ejercicio = ejercicios[indiceEjercicio];

  // La frase a traducir
  frase.textContent = ejercicio.frase;

  // El audio: solo se muestra si el ejercicio tiene uno
  audio.hidden = !ejercicio.audio;
  audio.pause();
  if (ejercicio.audio) {
    audio.src = ejercicio.audio;
  } else {
    audio.removeAttribute("src");
  }
  audio.load();

  // El avance: "Ejercicio 2 de 3", "2 / 3" y la barra
  numeroEjercicio.textContent = `Ejercicio ${indiceEjercicio + 1} de ${ejercicios.length}`;
  progresoTexto.textContent = `${indiceEjercicio + 1} / ${ejercicios.length}`;
  barraProgreso.max = ejercicios.length;
  barraProgreso.value = indiceEjercicio + 1;

  // Creamos un botón por cada palabra del banco
  bancoPalabras.innerHTML = "";
  ejercicio.palabras.forEach((texto) => {
    const elemento = document.createElement("li");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton palabra";
    boton.textContent = texto;
    elemento.appendChild(boton);
    bancoPalabras.appendChild(elemento);
  });

  // Vaciamos la respuesta y dejamos visible solo el botón "Comprobar"
  respuesta.innerHTML = "";
  botonComprobar.hidden = false;
  botonContinuar.hidden = true;
  botonReintentar.hidden = true;
  mostrarVidas();
  mostrarEstado("pendiente", "Respuesta pendiente: toca las palabras para armar la traducción y luego presiona «Comprobar respuesta».");
};

// ---------------------------------------------------------------------------
// Lo que pasa cuando la persona toca algo
// ---------------------------------------------------------------------------

// Mueve una palabra al lugar contrario: del banco a la respuesta, o de la respuesta al banco
const moverPalabra = (evento, destino) => {
  // closest busca el botón de palabra que se tocó (si se tocó otra cosa, da null)
  const palabra = evento.target.closest(".palabra");
  if (palabra && !palabra.disabled) {
    destino.appendChild(palabra);
    // Desde que mueve la primera palabra, hay actividad sin terminar
    actividadPendiente = true;
  }
};

// Tocar una palabra del banco la pasa a la respuesta, y tocarla en la respuesta la devuelve al banco
bancoPalabras.addEventListener("click", (evento) => moverPalabra(evento, respuesta));
respuesta.addEventListener("click", (evento) => moverPalabra(evento, bancoPalabras));

// Si quiere salir a mitad de la lección, le avisamos que el avance NO se va a guardar
enlaceVolverCurso.addEventListener("click", (evento) => {
  // confirm muestra una ventana con "Aceptar" y "Cancelar"; si elige "Cancelar", frenamos la salida
  if (actividadPendiente && !window.confirm("La lección todavía no está terminada y este intento no se guardará. ¿Quieres salir igual?")) {
    evento.preventDefault();
  }
});

// "Comprobar respuesta": revisa si las palabras elegidas son las correctas
botonComprobar.addEventListener("click", () => {
  // Armamos la lista con el texto de cada palabra que está en la respuesta
  const palabrasElegidas = [...respuesta.querySelectorAll(".palabra")].map((boton) => boton.textContent);

  // Si no eligió ninguna, se lo pedimos
  if (palabrasElegidas.length === 0) {
    mostrarEstado("pendiente", "Respuesta pendiente: primero elige al menos una palabra.");
    return;
  }

  // La capa lógica decide si es correcta
  const ejercicio = ejercicios[indiceEjercicio];
  const esCorrecta = evaluarRespuesta(palabrasElegidas, ejercicio.respuesta);

  // Correcta: bloqueamos las palabras y habilitamos "Continuar"
  if (esCorrecta) {
    mostrarEstado("correcta", "¡Correcto! Presiona «Continuar» para seguir.");
    botonComprobar.hidden = true;
    botonContinuar.hidden = false;
    bloquearPalabras(true);
    return;
  }

  // Incorrecta: suma un error y resta una vida
  errores = errores + 1;
  vidasRestantes = vidasRestantes - 1;
  mostrarVidas();

  // Si no quedan vidas, la lección se corta y hay que reiniciarla
  if (vidasRestantes === 0) {
    mostrarEstado("incorrecta", "Incorrecto. Te quedaste sin vidas: reinicia la lección para intentarlo de nuevo.");
    botonComprobar.hidden = true;
    botonReintentar.hidden = false;
    bloquearPalabras(true);
    return;
  }

  // Si quedan vidas, puede corregir y volver a comprobar ("vida" o "vidas" según cuántas queden)
  const palabraVidas = vidasRestantes === 1 ? "vida" : "vidas";
  mostrarEstado("incorrecta", `Incorrecto. Te queda${vidasRestantes === 1 ? "" : "n"} ${vidasRestantes} ${palabraVidas}: quita o cambia palabras e inténtalo otra vez.`);
});

// "Reiniciar lección": vuelve al primer ejercicio con todas las vidas
botonReintentar.addEventListener("click", () => {
  indiceEjercicio = 0;
  errores = 0;
  vidasRestantes = VIDAS_POR_LECCION;
  actividadPendiente = false;
  mostrarEjercicio();
});

// "Continuar": pasa al ejercicio siguiente, o termina la lección si era el último
botonContinuar.addEventListener("click", () => {
  indiceEjercicio = indiceEjercicio + 1;
  if (indiceEjercicio < ejercicios.length) {
    mostrarEjercicio();
  } else {
    terminarLeccion();
  }
});

// ---------------------------------------------------------------------------
// Final de la lección
// ---------------------------------------------------------------------------

// Guarda el resultado y muestra el resumen
const terminarLeccion = () => {
  // La capa lógica calcula la experiencia según los errores, y progreso.js la guarda en la cuenta
  const xp = calcularXpLeccion(errores);
  const resultado = registrarLeccionCompletada(curso.id, leccionId, xp, errores);
  // Ya no hay actividad sin terminar: salir no pierde nada
  actividadPendiente = false;

  // Si no se pudo guardar (por ejemplo, se cerró la sesión en otra pestaña), lo avisamos
  if (!resultado.ok) {
    mostrarCierre("No se pudo guardar la lección", resultado.mensaje, false);
    return;
  }

  // "error" o "errores" según la cantidad
  const palabraErrores = errores === 1 ? "error" : "errores";
  const resumen = `Respondiste los ${ejercicios.length} ejercicios con ${errores} ${palabraErrores}.`;

  // Primera vez que la completa: ganó experiencia y se actualizó su progreso
  if (resultado.nueva) {
    mostrarCierre(
      "¡Lección terminada!",
      `${resumen} Ganaste ${xp} XP y ahora tienes ${resultado.usuario.xp} XP en total. Tu avance quedó guardado.`,
      true
    );
  } else {
    // Ya la había completado antes: se mantiene su resultado anterior y no suma XP otra vez
    mostrarCierre(
      "¡Lección repasada!",
      `${resumen} Como ya habías completado esta lección, se mantiene tu resultado anterior y no se suman XP.`,
      true
    );
  }
};

// ---------------------------------------------------------------------------
// Arranque de la página
// ---------------------------------------------------------------------------

const iniciarLeccion = () => {
  // El ✕ de arriba vuelve al mapa del curso, en esta misma lección
  enlaceVolverCurso.href = urlMapa;

  // Si el curso o la lección no existen (por ejemplo, alguien cambió la dirección a mano), lo avisamos
  if (!curso || !leccion || ejercicios.length === 0) {
    mostrarCierre("Lección no disponible", "Esta lección no existe o todavía no tiene ejercicios.", false);
    return;
  }

  // Si la lección está bloqueada, explicamos por qué no se puede empezar (igual que en el mapa)
  if (obtenerEstadoLeccion(usuario, curso, leccion) === "bloqueada") {
    const actual = obtenerLeccionActual(usuario, curso);
    mostrarCierre("Lección bloqueada", `Para desbloquearla, primero completa «${actual.titulo}».`, false);
    return;
  }

  // Todo bien: completamos los textos con el curso y la lección, y mostramos el primer ejercicio
  document.title = `${curso.titulo}: ${leccion.titulo} | LingoWeb`;
  document.querySelector("#idioma-leccion").textContent = `${curso.titulo.toUpperCase()} · ${leccion.titulo.toUpperCase()}`;
  audio.setAttribute("aria-label", `Escuchar la frase en ${curso.titulo.toLowerCase()}`);
  mostrarEjercicio();
};

// Solo arrancamos si hay alguien conectado (si no, el portero ya nos mandó al login)
if (usuario) {
  iniciarLeccion();
}
