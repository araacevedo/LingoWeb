// =============================================================================
// presentacion/dashboard.js  ·  CONTROLADOR de dashboard.html (Vista 2)
// Arma el panel principal con los datos de la persona que inició sesión:
//   - el saludo con su nombre
//   - una tarjeta por cada curso, con su avance y el botón para entrar
//   - el resumen de racha, experiencia, liga y meta diaria
//   - un mensaje de bienvenida si la cuenta todavía no tiene actividad
// =============================================================================

// Traemos lo que necesitamos de cada capa
import { iniciarPaginaPrivada } from "./navegacion.js";                     // revisa que haya sesión iniciada
import { catalogoCursos } from "../datos/cursos.js";                         // la lista de cursos (Inglés, Alemán, Chino)
import { calcularPorcentaje, tieneActividad } from "../logica/progreso.js";  // las cuentas sobre el avance

// Si no hay sesión, desde el navegacion.js manda al login y  devuelve null.
// Si hay sesión, nos devuelve la cuenta de quien está conectado.
const usuario = iniciarPaginaPrivada();

// Cambia el texto debajo del título por un saludo con el nombre de la persona
const mostrarSaludo = () => {
  document.getElementById("saludo").textContent = `¡Hola, ${usuario.nombre}! Continúa aprendiendo y alcanza tus objetivos.`;
};

// Completa el cuadro de estadísticas de la derecha con los datos de la cuenta
const mostrarResumen = () => {
  // Si la racha es de 1 escribimos "día"; si no, "días"
  const palabraDias = usuario.racha === 1 ? "día" : "días";
  // Ponemos cada dato en su lugar, buscando cada casillero por su id
  document.getElementById("dato-racha").textContent = `${usuario.racha} ${palabraDias}`;
  document.getElementById("dato-xp").textContent = `${usuario.xp} XP`;
  document.getElementById("dato-liga").textContent = `Liga ${usuario.liga}`;
  document.getElementById("dato-meta").textContent = `${usuario.metaDiaria} XP`;
};

// Si la cuenta es nueva, mostramos el cartel de bienvenida que está escondido en el HTML
const mostrarEstadoInicial = () => {
  if (!tieneActividad(usuario)) {
    // Le sacamos la clase "oculto" para que se vea
    document.getElementById("estado-inicial").classList.remove("oculto");
  }
};

// Arma la tarjeta de UN curso y la devuelve lista para agregar a la página
const crearTarjeta = (curso) => {
  // Calculamos cuánto avanzó la persona en este curso
  const porcentaje = calcularPorcentaje(usuario, curso);
  // Si todavía no empezó el curso el botón dice "Empezar"; si ya empezó, "Continuar"
  const textoBoton = porcentaje === 0 ? "Empezar" : "Continuar";

  // Creamos la caja de la tarjeta y le ponemos la clase que ya tiene su diseño en el CSS
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta-curso";

  // Llenamos la tarjeta con la misma estructura que tenía en el TP1, pero con los datos del curso y de la persona.
  //innerHTML le escribe adentro todo ese HTML: bandera, título, barra de progreso y botón, con los datos del curso. La caja sigue sin verse, porque todavía no está en la página..
  tarjeta.innerHTML = `
    <div class="bandera">${curso.bandera}</div>
    <div class="informacion-curso">
      <h2>${curso.titulo}</h2>
      <p>${curso.descripcion}</p>
      <div class="progreso-info">
        <span>Progreso</span>
        <strong>${porcentaje}%</strong>
      </div>
      <progress class="barra-progreso" value="${porcentaje}" max="100" aria-label="Progreso del curso de ${curso.titulo}">${porcentaje}%</progress>
      <p class="nivel">Nivel: ${curso.nivel}</p>
    </div>
    <div class="acciones-tarjeta-curso">
      <a href="${curso.pagina}" class="boton boton-principal">${textoBoton}</a>
    </div>
  `;

  // Devolvemos la tarjeta terminada
  return tarjeta;
};

// Recorre la lista de cursos y agrega una tarjeta por cada uno
const mostrarCursos = () => {
  // Buscamos el lugar vacío del HTML donde van las tarjetas
  const lista = document.getElementById("lista-cursos");
  // Por cada curso de la lista, armamos su tarjeta y la agregamos
  catalogoCursos.forEach((curso) => lista.append(crearTarjeta(curso)));
};

// Solo armamos el panel si hay alguien con la sesion iniciada 
if (usuario) {
  mostrarSaludo();
  mostrarEstadoInicial();
  mostrarCursos();
  mostrarResumen();
}