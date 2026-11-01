// =============================================================================
// login.js  ·  CONTROLADOR de login.html (Vista 1: acceso)
// Rol en el TP: "el formulario debe solicitar usuario o correo y contraseña.
// Al enviar, debe validar los campos y mostrar un mensaje claro [...]. Cuando
// el acceso sea válido, se debe identificar a la persona activa y conducirla
// al panel principal".
// Patrón: lee el formulario → la lógica decide → se muestra el resultado.
// =============================================================================

import { iniciarPaginaPublica, irA } from "./navegacion.js";          // control de sesión y navegación
import { iniciarSesion } from "../logica/autenticacion.js";           // caso de uso que decide si el acceso es válido
import { mostrarMensaje, marcarCampoInvalido, limpiarCamposInvalidos, leerCampo } from "./ui.js"; // utilidades de pantalla

// Prepara el formulario de login. Se llama solo si no hay sesión abierta (ver el final del archivo).
const iniciarLogin = () => { // función flecha sin parámetros; agrupa todo lo que necesita el formulario
  const formulario = document.getElementById("form-login");         // referencia al <form> del HTML

  formulario.addEventListener("submit", (evento) => {               // "submit" se dispara al presionar el botón o Enter dentro del formulario
    evento.preventDefault();                                        // evita que la página se recargue: el flujo lo controla JavaScript

    const resultado = iniciarSesion(                                // le pasamos los datos a la capa lógica y recibimos { ok, ... }
      leerCampo("identificador"),                                   // usuario o email, sin espacios en los extremos
      document.getElementById("contraseña").value                   
    );                                                              

    if (!resultado.ok) {                                            // la lógica rechazó el acceso
      marcarCampoInvalido(formulario, resultado.campo);             // marcamos y enfocamos el campo a revisar
      mostrarMensaje("mensaje-login", resultado.mensaje, false);    // mostramos el motivo en el cartel rojo
      return;                                                       // cortamos acá: no se ejecuta el caso exitoso
    }                                                               

    limpiarCamposInvalidos(formulario);                             // acceso válido: quitamos marcas de error anteriores
    mostrarMensaje("mensaje-login", `¡Hola, ${resultado.usuario.nombre}! Cargando tus cursos...`, true); // saludo personalizado con template literal
    formulario.querySelector("button[type=submit]").disabled = true; // deshabilitamos el botón para evitar un doble envío durante la espera

    setTimeout(() => irA("dashboard.html"), 1000);                  // esperamos 1000 ms para que se lea el mensaje y vamos al panel principal
  });                                                               // fin del listener de submit
};                                                                  // fin de iniciarLogin

if (iniciarPaginaPublica()) {                                       // si ya hay sesión, iniciarPaginaPublica redirige al dashboard y devuelve false
  iniciarLogin();                                                   // si no hay sesión, armamos el formulario
}                                                                   
