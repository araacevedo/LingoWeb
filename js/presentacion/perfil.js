// =============================================================================
// presentacion/perfil.js  ·  CONTROLADOR de perfil.html (Vista 5)
// =============================================================================

import { iniciarPaginaPrivada } from "./navegacion.js";
import { mostrarMensaje, marcarCampoInvalido, limpiarCamposInvalidos, leerCampo } from "./ui.js";
import { actualizarDatosPerfil } from "../logica/perfil.js";
import { contarLeccionesCompletadas } from "../logica/progreso.js";


const usuario = iniciarPaginaPrivada();

// Extrae hasta 2 iniciales del nombre de forma simple
const calcularIniciales = (nombreCompleto) => {
  const palabras = nombreCompleto.split(" ");
  let iniciales = "";
  if (palabras.length > 0) iniciales = iniciales + palabras[0][0];
  if (palabras.length > 1) iniciales = iniciales + palabras[1][0];
  return iniciales.toUpperCase();
};

if (usuario) {
  // 1. Cargar datos en la cabecera
  document.querySelector(".cabecera-perfil h1").textContent = usuario.nombre;
  document.querySelector(".cabecera-perfil p:nth-of-type(1)").textContent = `@${usuario.usuario}`;
  document.querySelector(".cabecera-perfil p:nth-of-type(2)").textContent = usuario.email;
  document.querySelector(".fecha-alta").textContent = `Miembro desde: ${usuario.fechaAlta}`;
  document.querySelector(".avatar").textContent = calcularIniciales(usuario.nombre);

  // 2. Cargar sección Mis logros
  const estadisticas = document.querySelectorAll(".logros .estadistica strong");
  if (estadisticas.length >= 3) {
    const palabraDias = usuario.racha === 1 ? "día" : "días";
    estadisticas[0].textContent = `${usuario.xp} XP`;
    estadisticas[1].textContent = `${usuario.racha} ${palabraDias}`;
    estadisticas[2].textContent = usuario.liga;
  }
  // Cuarto logro: lecciones terminadas en todos los cursos (lo calcula la capa lógica)
  if (estadisticas.length >= 4) {
    estadisticas[3].textContent = contarLeccionesCompletadas(usuario);
  }

  // 3. Pre-llenar el formulario con los valores actuales
  document.getElementById("nombre").value = usuario.nombre;
  document.getElementById("usuario").value = usuario.usuario;
  document.getElementById("email").value = usuario.email;
  document.getElementById("idioma").value = usuario.idiomaInterfaz;

  // 4. Escuchar el envío del formulario
  const formulario = document.getElementById("form-perfil");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const datos = {
      nombre: leerCampo("nombre"),
      usuario: leerCampo("usuario"),
      email: leerCampo("email"),
      passwordActual: document.getElementById("password-actual").value,
      passwordNueva: document.getElementById("password-nueva").value,
      passwordConfirmacion: document.getElementById("password-confirmacion").value,
      idiomaInterfaz: document.getElementById("idioma").value
    };

    const resultado = actualizarDatosPerfil(usuario.id, datos);

    if (!resultado.ok) {
      marcarCampoInvalido(formulario, resultado.campo);
      mostrarMensaje("mensaje-perfil", resultado.mensaje, false);
      return;
    }

    limpiarCamposInvalidos(formulario);
    document.getElementById("password-actual").value = "";
    document.getElementById("password-nueva").value = "";
    document.getElementById("password-confirmacion").value = "";

    mostrarMensaje("mensaje-perfil", "¡Cambios guardados con éxito!", true);
    setTimeout(() => window.location.reload(), 1200);
  });
}
