// =============================================================================
// presentacion/registro.js  ·  CONTROLADOR de registro.html (Vista 1: registro)
// Rol en el TP: "el enlace Registrarse debe abrir un formulario para crear
// una cuenta de demostración. Se validará que los campos obligatorios estén
// completos y que el identificador elegido no esté ocupado". El regreso al
// inicio de sesión es el enlace "Volver al inicio de sesión" del HTML.
// =============================================================================

import { iniciarPaginaPublica, irA } from "./navegacion.js";          // control de sesión y navegación
import { registrarUsuario } from "../logica/autenticacion.js";        // caso de uso que valida y crea la cuenta
import { mostrarMensaje, marcarCampoInvalido, limpiarCamposInvalidos, leerCampo } from "./ui.js"; // utilidades de pantalla

// Prepara el formulario de registro.
const iniciarRegistro = () => { // función flecha sin parámetros; agrupa todo lo que necesita el formulario
  const formulario = document.getElementById("form-registro");      // referencia al <form>

  formulario.addEventListener("submit", (evento) => {               // escuchamos el envío del formulario
    evento.preventDefault();                                        // sin recarga de página

    const datos = {                                                 // agrupamos los valores en un objeto para pasarlos a la lógica de una sola vez
      nombre: leerCampo("nombre"),                                  // nombre completo
      usuario: leerCampo("usuario"),                                // nombre de usuario elegido
      email: leerCampo("email"),                                    // correo
      contraseña: document.getElementById("contraseña").value,       // contraseña, sin trim (los espacios son parte de ella)
      confirmarContraseña: document.getElementById("confirmarContraseña").value // repetición de la contraseña
    };                                                              

    const resultado = registrarUsuario(datos);                      // la lógica valida y, si todo está bien, guarda la cuenta

    if (!resultado.ok) {                                            // hay un dato a revisar
      marcarCampoInvalido(formulario, resultado.campo);             // marcamos y enfocamos ese campo
      mostrarMensaje("mensaje-registro", resultado.mensaje, false); // explicamos qué corregir
      return;                                                       // no seguimos
    }                                                               

    limpiarCamposInvalidos(formulario);                             // cuenta creada: quitamos marcas de error
    mostrarMensaje("mensaje-registro", "¡Cuenta creada con éxito! Ya puedes iniciar sesión. Redirigiendo...", true); // confirmación en verde
    formulario.querySelector("button[type=submit]").disabled = true; // evitamos crear la cuenta dos veces
    setTimeout(() => irA("login.html"), 1500);                      // tras 1,5 s volvemos al login para que la persona ingrese con su cuenta nueva
  });                                                               
};                                                                  // fin de iniciarRegistro

if (iniciarPaginaPublica()) {                                       // solo si no hay sesión abierta
  iniciarRegistro();                                                // armamos el formulario
}                                                                   
