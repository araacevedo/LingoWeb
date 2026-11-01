// =============================================================================
// recuperar.js  ·  CONTROLADOR de recuperar.html (Vista 1: recuperación)
// Rol en el TP: "el enlace ¿Olvidaste tu contraseña? debe abrir una vista de
// recuperación. Tras ingresar el correo asociado, se informará el resultado
// del proceso simulado". El regreso al login es el enlace del HTML.
// =============================================================================

import { iniciarPaginaPublica } from "./navegacion.js";               // control de sesión
import { recuperarAcceso } from "../logica/autenticacion.js";         // caso de uso de recuperación simulada
import { mostrarMensaje, marcarCampoInvalido, limpiarCamposInvalidos, leerCampo } from "./ui.js"; // utilidades de pantalla

// Prepara el formulario de recuperación.
const iniciarRecuperar = () => { // función flecha sin parámetros; agrupa todo lo que necesita el formulario
  const formulario = document.getElementById("form-recuperar");     // referencia al <form>

  formulario.addEventListener("submit", (evento) => {               // escuchamos el envío
    evento.preventDefault();                                        // sin recarga de página

    const email = leerCampo("email");                               // email escrito, sin espacios en los extremos
    const resultado = recuperarAcceso(email);                       // la lógica valida el formato y busca si existe la cuenta

    if (!resultado.ok) {                                            // vacío, formato inválido o email inexistente
      marcarCampoInvalido(formulario, resultado.campo);             // marcamos el campo email
      mostrarMensaje("mensaje-recuperar", resultado.mensaje, false); // informamos el motivo
      return;                                                       // no seguimos
    }                                                               

    limpiarCamposInvalidos(formulario);                             // éxito: quitamos marcas de error
    mostrarMensaje(                                                 // informamos el resultado del proceso SIMULADO
      "mensaje-recuperar",                                          // id del cartel
      `Simulación: enviamos las instrucciones para restablecer tu contraseña a ${email}.`, // el template literal inserta el email ingresado
      true                                                          // cartel verde
    );                                                              // fin de mostrarMensaje
    formulario.reset();                                             // reset() vacía todos los campos del formulario
  });                                                               
};                                                                  

if (iniciarPaginaPublica()) {                                       
  iniciarRecuperar();                                               
}                                                                   
