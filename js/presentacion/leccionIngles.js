import { evaluarRespuesta } from "../logica/leccion.js";

// Busco las zonas donde se arma y se guardan las palabras
const respuesta = document.querySelector("#respuesta");
const bancoPalabras = document.querySelector("#banco-palabras");
const mensajeResultado = document.querySelector("#mensaje-resultado");
const botonComprobar = document.querySelector("#comprobar-respuesta");
const botonContinuar = document.querySelector("#continuar-leccion");

// Al hacer click en una palabra del banco, se mueve a la zona de respuesta
bancoPalabras.addEventListener("click", (event) => {
  // Agrego un event listener al banco de palabras para detectar clicks en sus elementos
  const palabra = event.target.closest(".palabra"); // Busco la palabra más cercana al elemento clickeado

  if (palabra) {
    respuesta.appendChild(palabra); // Muevo la palabra a la zona de respuesta
  }
});

// Al hacer click en una palabra de la zona de respuesta, se mueve de vuelta al banco
respuesta.addEventListener("click", (event) => {
  const palabra = event.target.closest(".palabra"); // Busco la palabra más cercana al elemento clickeado

  if (palabra) {
    bancoPalabras.appendChild(palabra); // Muevo la palabra de vuelta al banco
  }
});

botonComprobar.addEventListener("click", () => {
  const palabrasElegidas = [...respuesta.querySelectorAll(".palabra")].map(
    // Tomo todas las palabras que están en la zona de respuesta y las guardo en un array
    (boton) => boton.textContent,
  );

  if (palabrasElegidas.length === 0) {
    mensajeResultado.textContent =
      "Elegí las palabras para armar tu respuesta.";
    return;
  }

  const esCorrecta = evaluarRespuesta(palabrasElegidas);
  // Continuar solo aparece cuando la respuesta es correcta.
  botonContinuar.hidden = !esCorrecta;

  mensajeResultado.textContent = esCorrecta
    ? "¡Correcto! La traducción es: Buenos días, ¿cómo estás?"
    : "Todavía no es correcto. Podés quitar palabras y volver a intentar.";
});
