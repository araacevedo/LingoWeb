// =============================================================================
// curso.js  ·  CONTROLADOR de curso.html (Vista 3)
// Arma el mapa del curso elegido con los datos de la persona conectada:
//   - el encabezado con el nombre del curso, su avance y la unidad actual
//   - una sección por unidad, con sus lecciones y el estado de cada una
//   - las opiniones del curso y el formulario para dejar una nueva
// El curso se elige con la dirección de la página: curso.html?curso=ingles
// Así, al recargar o usar atrás/adelante, se vuelve a mostrar el mismo curso.
// =============================================================================

// Traemos lo que necesitamos de cada capa
import { iniciarPaginaPrivada, irA } from "./navegacion.js";
import {
  mostrarMensaje,
  marcarCampoInvalido,
  limpiarCamposInvalidos,
  leerCampo,
} from "./ui.js";
import { buscarCurso } from "../datos/catalogo.js";
import {
  calcularPorcentaje,
  obtenerLecciones,
  obtenerResultados,
  obtenerLeccionActual,
  obtenerEstadoLeccion,
} from "../logica/progreso.js";
import {
  obtenerOpinionesDelCurso,
  calcularPromedio,
  publicarOpinion,
} from "../logica/opiniones.js";

// El portero: nos da la cuenta de quien está conectado, o null si lo mandó al login
const usuario = iniciarPaginaPrivada();

// Leemos el curso que viene en la dirección. Por ejemplo, en "curso.html?curso=aleman" esto da "aleman"
const parametros = new URLSearchParams(window.location.search);
// Buscamos ese curso en la lista de cursos (si no existe, nos da null)
const curso = buscarCurso(parametros.get("curso"));

// Arma la dirección de la lección con el curso y su ID.
const crearUrlLeccion = (leccionId) => {
  const parametros = new URLSearchParams({
    //prepara los parámetros de la dirección
    curso: curso.id,
    leccion: leccionId,
  });

  return `${curso.paginaLeccion}?${parametros}`;
};

// Textos que se muestran según el estado de cada lección (no dependemos solo del color)
const ICONOS = { completada: "🟢", "en-progreso": "🟡", bloqueada: "🔒" };
const NOMBRES_ESTADO = {
  completada: "Completada",
  "en-progreso": "En curso",
  bloqueada: "Bloqueada",
};

// Completa el encabezado: nombre del curso, porcentaje de avance y unidad actual
const mostrarCabecera = () => {
  // El título de la pestaña del navegador
  document.title = `LingoWeb - Curso de ${curso.titulo}`;
  document.getElementById("titulo-curso").textContent =
    `${curso.bandera} ${curso.descripcion}`;

  const porcentaje = calcularPorcentaje(usuario, curso);
  const actual = obtenerLeccionActual(usuario, curso);
  let texto = `Progreso: ${porcentaje}%`;

  // Si queda alguna lección por hacer, buscamos en qué unidad está para mostrarla como "unidad actual"
  if (actual) {
    const unidadActual = curso.unidades.find((unidad) =>
      unidad.lecciones.includes(actual),
    );
    texto = texto + ` · Unidad actual: ${unidadActual.titulo}`;
  } else {
    texto = texto + " · ¡Completaste todas las lecciones!";
  }
  document.getElementById("resumen-curso").textContent = texto;
};

// Arma la tarjeta de UNA lección según su estado. "numero" es su número dentro del curso (1, 2, 3...)
const crearLeccion = (leccion, numero) => {
  const estado = obtenerEstadoLeccion(usuario, curso, leccion);

  // Creamos la caja con las clases del CSS del TP1: "leccion completada", "leccion en-progreso" o "leccion bloqueada".
  // El id (por ejemplo "leccion-l2") permite volver a esta lección exacta desde la dirección: curso.html?curso=ingles#leccion-l2
  const tarjeta = document.createElement("article");
  tarjeta.className = `leccion ${estado}`;
  tarjeta.id = `leccion-${leccion.id}`;

  // Lo que cambia según el estado: un texto extra y el botón
  let detalle = "";
  let boton = "";

  if (estado === "completada") {
    // Mostramos el resultado que obtuvo y la opción de repetirla
    const resultado = obtenerResultados(usuario, curso.id)[leccion.id];
    const palabraErrores = resultado.errores === 1 ? "error" : "errores";
    detalle = `<p>Resultado: ${resultado.xp} XP · ${resultado.errores} ${palabraErrores} · terminada el ${resultado.fecha}</p>`;
    boton = `<a href="${crearUrlLeccion(leccion.id)}" class="boton boton-secundario">Repetir</a>`;
  } else if (estado === "en-progreso") {
    // Es la que le toca: botón para empezarla
    boton = `<a href="${crearUrlLeccion(leccion.id)}" class="boton boton-principal">Empezar</a>`;
  } else {
    // Bloqueada: explicamos por qué todavía no se puede hacer
    const actual = obtenerLeccionActual(usuario, curso);
    detalle = `<p class="motivo">Para desbloquearla, primero completa «${actual.titulo}».</p>`;
  }

  // Llenamos la tarjeta. Usamos innerHTML porque todos los textos salen de nuestra lista de cursos.
  tarjeta.innerHTML = `
    <div class="estado" aria-hidden="true">${ICONOS[estado]}</div>
    <div class="contenido-leccion">
      <h3>Lección ${numero} — ${leccion.titulo}</h3>
      <p>${leccion.descripcion}</p>
      <p><strong>Estado: ${NOMBRES_ESTADO[estado]}</strong></p>
      ${detalle}
    </div>
    ${boton}
  `;
  return tarjeta;
};

// Arma una sección por cada unidad, con sus lecciones adentro, y las pone antes de las opiniones
const mostrarUnidades = () => {
  const seccionOpiniones = document.getElementById("opiniones");
  // Contador para numerar las lecciones de corrido (1, 2, 3, 4) aunque estén en unidades distintas
  let numero = 1;

  // forEach nos da cada unidad y su posición (0, 1...), que usamos para escribir "UNIDAD 01", "UNIDAD 02"
  curso.unidades.forEach((unidad, posicion) => {
    const seccion = document.createElement("section");
    seccion.className = "unidad";
    // padStart agrega un 0 adelante si hace falta: 1 → "01"
    seccion.innerHTML = `
      <header class="unidad-cabecera">
        <span class="numero-unidad">UNIDAD ${String(posicion + 1).padStart(2, "0")}</span>
        <h2>${unidad.titulo}</h2>
      </header>
      <div class="lista-lecciones"></div>
    `;

    // Agregamos cada lección de la unidad a su lista
    const lista = seccion.querySelector(".lista-lecciones");
    unidad.lecciones.forEach((leccion) => {
      lista.append(crearLeccion(leccion, numero));
      numero = numero + 1;
    });

    // before pone la unidad justo antes de la sección de opiniones
    seccionOpiniones.before(seccion);
  });
};

// Muestra el promedio y la lista de opiniones de este curso
const mostrarOpiniones = () => {
  const opiniones = obtenerOpinionesDelCurso(curso.id);
  const lista = document.getElementById("lista-opiniones");
  const promedio = document.getElementById("promedio-opiniones");

  // Vaciamos la lista por si ya tenía opiniones (pasa cuando se publica una nueva y la volvemos a armar)
  lista.innerHTML = "";

  // Si no hay opiniones, lo decimos en vez de dejar la lista vacía
  if (opiniones.length === 0) {
    promedio.textContent =
      "Todavía no hay opiniones. ¡Sé la primera persona en opinar!";
    return;
  }

  // "opinión" o "opiniones" según la cantidad
  const palabraOpiniones = opiniones.length === 1 ? "opinión" : "opiniones";
  promedio.textContent = `Calificación promedio: ${calcularPromedio(opiniones)} de 5 (${opiniones.length} ${palabraOpiniones})`;

  opiniones.forEach((opinion) => {
    // Las estrellas en dibujo: ★ por cada estrella elegida y ☆ por las que faltan hasta 5
    const dibujo =
      "★".repeat(opinion.estrellas) + "☆".repeat(5 - opinion.estrellas);
    // Si la escribió la persona conectada, lo aclaramos
    const marcaPropia = opinion.usuarioId === usuario.id ? " (tú)" : "";

    // Acá NO usamos innerHTML: el comentario lo escribió una persona, y con textContent
    // nos aseguramos de que se muestre como texto común aunque escriba algo raro.
    const item = document.createElement("li");
    item.className = "opinion";
    const cabecera = document.createElement("p");
    cabecera.textContent = `${opinion.autor}${marcaPropia} · ${dibujo} (${opinion.estrellas} de 5) · ${opinion.fecha}`;
    const texto = document.createElement("p");
    texto.textContent = opinion.comentario;

    item.append(cabecera, texto);
    lista.append(item);
  });
};

// Prepara el formulario para dejar una opinión
const iniciarFormularioOpinion = () => {
  const formulario = document.getElementById("form-opinion");

  formulario.addEventListener("submit", (evento) => {
    // Evitamos que la página se recargue
    evento.preventDefault();

    // Buscamos qué estrella está marcada. Si no se marcó ninguna, usamos 0
    const elegida = formulario.querySelector('input[name="estrellas"]:checked');
    const estrellas = elegida ? Number(elegida.value) : 0;

    // Le pasamos todo a la lógica, que valida y guarda
    const resultado = publicarOpinion(
      usuario,
      curso.id,
      estrellas,
      leerCampo("comentario"),
    );

    // Si algo está mal, marcamos el campo y explicamos qué corregir
    if (!resultado.ok) {
      marcarCampoInvalido(formulario, resultado.campo);
      mostrarMensaje("mensaje-opinion", resultado.mensaje, false);
      return;
    }

    // Salió bien: limpiamos, avisamos y volvemos a armar la lista para que aparezca la opinión nueva
    limpiarCamposInvalidos(formulario);
    formulario.reset();
    mostrarMensaje("mensaje-opinion", "¡Gracias! Tu opinión se publicó.", true);
    mostrarOpiniones();
  });
};

// Si la dirección pide una lección en particular (por ejemplo #leccion-l2), bajamos hasta ella.
// Sirve para que al volver de una lección se conserve la posición en el mapa.
const irALeccionPedida = () => {
  if (window.location.hash) {
    const destino = document.querySelector(window.location.hash);
    if (destino) destino.scrollIntoView();
  }
};

// Si hay alguien conectado pero el curso de la dirección no existe (o falta), volvemos al dashboard
if (usuario && !curso) {
  irA("dashboard.html");
}

// Si está todo bien, armamos la página
if (usuario && curso) {
  mostrarCabecera();
  mostrarUnidades();
  mostrarOpiniones();
  iniciarFormularioOpinion();
  irALeccionPedida();
}
