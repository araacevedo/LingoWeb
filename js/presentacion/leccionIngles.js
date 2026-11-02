// Importa los ejercicios y la regla que comprueba las respuestas.
import { ejerciciosPorLeccion } from "../datos/lecciones.js";
import { evaluarRespuesta } from "../logica/leccion.js";

// Importa la acción de guardar avance y otorgar XP.
import { registrarLeccionCompletada } from "../logica/progreso.js";

// Busca en el HTML los elementos que vamos a actualizar.
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

const contenedorLeccion = document.querySelector(".contenedor-leccion");
const enlaceVolverCurso = document.querySelector("#volver-curso");

// Lee del enlace qué curso y qué lección se seleccionaron en el mapa.
const parametros = new URLSearchParams(window.location.search);
const cursoId = parametros.get("curso") ?? contenedorLeccion.dataset.curso;
const leccionId =
  parametros.get("leccion") ?? contenedorLeccion.dataset.leccion;
const ejercicios = ejerciciosPorLeccion[leccionId] ?? [];

// Al salir, vuelve al curso y conserva el foco en la lección elegida.
const parametrosCurso = new URLSearchParams({ curso: cursoId });
enlaceVolverCurso.href = `curso.html?${parametrosCurso}#leccion-${leccionId}`;

// Guarda cuál ejercicio de la lista se está mostrando; los arrays empiezan en 0.
let indiceEjercicio = 0;

// Cuenta las respuestas incorrectas de toda la lección.
let errores = 0;
let vidasRestantes = 3;
let actividadPendiente = false;
let leccionCompletada = false;

// Actualiza los corazones visibles y el nombre accesible de las vidas.
const mostrarVidas = () => {
  vidas.textContent = "❤️".repeat(vidasRestantes) + "🤍".repeat(3 - vidasRestantes);
  vidas.setAttribute("aria-label", `Vidas restantes: ${vidasRestantes} de 3`);
};

// Bloquea las palabras cuando la respuesta ya fue aceptada o no quedan vidas.
const bloquearPalabras = (bloquear) => {
  document.querySelectorAll(".palabra").forEach((boton) => {
    boton.disabled = bloquear;
  });
};

// Si se sale a mitad de la lección, se explica que el resultado no se guardará.
enlaceVolverCurso.addEventListener("click", (evento) => {
  if (
    actividadPendiente &&
    !window.confirm(
      "La lección todavía no está completa y este intento no se guardará. ¿Querés salir?",
    )
  ) {
    evento.preventDefault();
  }
});

// Muestra en pantalla los datos del ejercicio activo.
const mostrarEjercicio = () => {
  const ejercicio = ejercicios[indiceEjercicio];

  frase.textContent = ejercicio.frase;
  // Solo mostramos controles cuando el ejercicio tiene un audio propio.
  audio.hidden = !ejercicio.audio;
  audio.pause();
  if (ejercicio.audio) {
    audio.src = ejercicio.audio;
  } else {
    audio.removeAttribute("src");
  }
  audio.load();

  numeroEjercicio.textContent = `Ejercicio ${indiceEjercicio + 1} de ${ejercicios.length}`;
  progresoTexto.textContent = `${indiceEjercicio + 1} / ${ejercicios.length}`;
  barraProgreso.value = indiceEjercicio + 1;

  // Crea un botón por cada opción del ejercicio.
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

  respuesta.innerHTML = "";
  mensajeResultado.textContent = "";
  botonComprobar.hidden = false;
  botonContinuar.hidden = true;
  botonReintentar.hidden = true;
  mostrarVidas();
};

// Mueve una palabra seleccionada a la respuesta o de vuelta al banco.
const moverPalabra = (evento, destino) => {
  const palabra = evento.target.closest(".palabra");

  if (palabra && !leccionCompletada) {
    destino.appendChild(palabra);
    actividadPendiente = true;
    mensajeResultado.textContent = "";
  }
};

// Escucha los clics en ambas zonas para elegir o quitar palabras.
bancoPalabras.addEventListener("click", (evento) =>
  moverPalabra(evento, respuesta),
);
respuesta.addEventListener("click", (evento) =>
  moverPalabra(evento, bancoPalabras),
);

// Comprueba la selección usando la regla de la capa lógica.
botonComprobar.addEventListener("click", () => {
  const palabrasElegidas = [...respuesta.querySelectorAll(".palabra")].map(
    (boton) => boton.textContent,
  );

  if (palabrasElegidas.length === 0) {
    mensajeResultado.textContent =
      "Elegí las palabras para armar tu respuesta.";
    return;
  }

  const ejercicio = ejercicios[indiceEjercicio];
  const esCorrecta = evaluarRespuesta(palabrasElegidas, ejercicio.respuesta);

  if (!esCorrecta) {
    errores += 1;
    vidasRestantes -= 1;
    mostrarVidas();

    if (vidasRestantes === 0) {
      mensajeResultado.textContent =
        "Te quedaste sin vidas. Reiniciá la lección para intentarlo de nuevo.";
      botonComprobar.hidden = true;
      botonContinuar.hidden = true;
      botonReintentar.hidden = false;
      bloquearPalabras(true);
      return;
    }
  }

  mensajeResultado.textContent = esCorrecta
    ? "¡Correcto!"
    : "No es correcto todavía. Podés quitar palabras e intentar otra vez.";

  botonContinuar.hidden = !esCorrecta;
  botonComprobar.hidden = esCorrecta;
  bloquearPalabras(esCorrecta);
});

// Reinicia la secuencia y devuelve las tres vidas para volver a intentarlo.
botonReintentar.addEventListener("click", () => {
  indiceEjercicio = 0;
  errores = 0;
  vidasRestantes = 3;
  actividadPendiente = false;
  mostrarEjercicio();
});

// Avanza al ejercicio siguiente o muestra el final de la lección.
botonContinuar.addEventListener("click", () => {
  indiceEjercicio += 1;

  if (indiceEjercicio < ejercicios.length) {
    mostrarEjercicio();
  } else {
    // Registra el curso y la lección identificados en el HTML.
    const resultado = registrarLeccionCompletada(
      cursoId,
      leccionId,
      10,
      errores,
    );

    botonContinuar.hidden = true;
    botonComprobar.hidden = true;
    botonReintentar.hidden = true;

    // Informa si se guardó por primera vez o ya estaba completada.
    if (!resultado.ok) {
      mensajeResultado.textContent = resultado.mensaje;
    } else if (resultado.nueva) {
      actividadPendiente = false;
      leccionCompletada = true;
      bloquearPalabras(true);
      mensajeResultado.textContent = `¡Terminaste la lección! Sumaste 10 XP. Total: ${resultado.usuario.xp} XP.`;
    } else {
      actividadPendiente = false;
      leccionCompletada = true;
      bloquearPalabras(true);
      mensajeResultado.textContent =
        "Ya habías completado esta lección; no se volvieron a sumar XP.";
    }
  }
});

// Carga el primer ejercicio al iniciar la página.
if (ejercicios.length > 0) {
  mostrarEjercicio();
} else {
  // Evita mostrar por error las preguntas de otra lección no implementada.
  document.querySelector("#ejercicio .contenido-ejercicio").hidden = true;
  document.querySelector(".progreso-leccion").hidden = true;
  document.querySelector(".vidas").hidden = true;
  botonComprobar.hidden = true;
  botonReintentar.hidden = true;
  mensajeResultado.textContent = "Esta lección todavía no está disponible.";
}
