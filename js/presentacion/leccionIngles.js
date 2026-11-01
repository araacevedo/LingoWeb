// Importa los ejercicios y la regla que comprueba las respuestas.
import { ejerciciosIngles } from "../datos/lecciones.js";
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

const contenedorLeccion = document.querySelector(".contenedor-leccion");

// Guarda cuál ejercicio de la lista se está mostrando; los arrays empiezan en 0.
let indiceEjercicio = 0;

// Muestra en pantalla los datos del ejercicio activo.
const mostrarEjercicio = () => {
  const ejercicio = ejerciciosIngles[indiceEjercicio];

  frase.textContent = ejercicio.frase;
  audio.src = ejercicio.audio;
  audio.parentElement.load();

  numeroEjercicio.textContent = `Ejercicio ${indiceEjercicio + 1} de ${ejerciciosIngles.length}`;
  progresoTexto.textContent = `${indiceEjercicio + 1} / ${ejerciciosIngles.length}`;
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
};

// Mueve una palabra seleccionada a la respuesta o de vuelta al banco.
const moverPalabra = (evento, destino) => {
  const palabra = evento.target.closest(".palabra");

  if (palabra) {
    destino.appendChild(palabra);
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

  const ejercicio = ejerciciosIngles[indiceEjercicio];
  const esCorrecta = evaluarRespuesta(palabrasElegidas, ejercicio.respuesta);

  mensajeResultado.textContent = esCorrecta
    ? "¡Correcto!"
    : "No es correcto todavía. Podés quitar palabras e intentar otra vez.";

  botonContinuar.hidden = !esCorrecta;
  botonComprobar.hidden = esCorrecta;
});

// Avanza al ejercicio siguiente o muestra el final de la lección.
botonContinuar.addEventListener("click", () => {
  indiceEjercicio += 1;

  if (indiceEjercicio < ejerciciosIngles.length) {
    mostrarEjercicio();
  } else {
    // Registra el curso y la lección identificados en el HTML.
    const resultado = registrarLeccionCompletada(
      contenedorLeccion.dataset.curso,
      contenedorLeccion.dataset.leccion,
    );

    botonContinuar.hidden = true;

    // Informa si se guardó por primera vez o ya estaba completada.
    if (!resultado.ok) {
      mensajeResultado.textContent = resultado.mensaje;
    } else if (resultado.nueva) {
      mensajeResultado.textContent = `¡Terminaste la lección! Sumaste 10 XP. Total: ${resultado.usuario.xp} XP.`;
    } else {
      mensajeResultado.textContent =
        "Ya habías completado esta lección; no se volvieron a sumar XP.";
    }
  }
});

// Carga el primer ejercicio al iniciar la página.
mostrarEjercicio();
