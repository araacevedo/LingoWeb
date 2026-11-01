// =============================================================================
// ui.js  ·  CAPA DE PRESENTACIÓN
// Rol en el TP: la consigna pide que la interfaz "indique si la operación fue
// aceptada o qué dato debe revisarse" y que los mensajes "no dependan
// únicamente del color". Estas funciones reutilizables muestran esos mensajes
// y marcan el campo con error.
// =============================================================================

// Muestra el cartel de resultado: esExito = true → verde con "✓"; false → rojo con "✕".
// Parámetro con valor predeterminado (= false): si no se envía, se asume error.
export const mostrarMensaje = (idContenedor, mensaje, esExito = false) => { // recibe el id del cartel, el texto y si fue éxito
  const contenedor = document.getElementById(idContenedor);         // buscamos en el DOM el <div> del mensaje por su id
  if (!contenedor) return;                                          // si no existe en esta página, salimos para no provocar un error en consola

  contenedor.textContent = (esExito ? "✓ " : "✕ ") + mensaje;       // textContent (no innerHTML): se muestra como texto, nunca como HTML; el símbolo hace que no dependa solo del color

  contenedor.classList.remove("oculto", "resultado-correcto", "resultado-incorrecto"); // quitamos estados anteriores (y la clase que lo escondía)
  contenedor.classList.add(esExito ? "resultado-correcto" : "resultado-incorrecto");   // aplicamos el estilo verde o rojo definido en forms-buttons.css
};                                                                  // fin de mostrarMensaje

// Esconde un cartel de resultado (queda disponible para vistas siguientes).
export const ocultarMensaje = (idContenedor) => {                   // recibe el id del cartel
  const contenedor = document.getElementById(idContenedor);         // lo buscamos en el DOM
  if (contenedor) contenedor.classList.add("oculto");               // si existe, la clase "oculto" (base.css) le aplica display: none
};                                                                  

// Marca el campo con error: aria-invalid lo anuncia el lector de pantalla y el CSS le pone borde rojo; focus lleva el cursor ahí.
export const marcarCampoInvalido = (formulario, idCampo) => {       // recibe el <form> y el id del input a marcar
  limpiarCamposInvalidos(formulario);                               // primero quitamos marcas de intentos anteriores
  const campo = formulario.querySelector("#" + idCampo);            // querySelector con "#id" busca el input dentro del formulario
  if (campo) {                                                      // si lo encontró...
    campo.setAttribute("aria-invalid", "true");                     // ...lo marca como inválido (accesibilidad + estilo)
    campo.focus();                                                  // ...y le da el foco para que la persona lo corrija directamente
  }                                                                 
};                                                                 

// Quita la marca de error de todos los campos del formulario.
export const limpiarCamposInvalidos = (formulario) => {             // recibe el <form>
  formulario.querySelectorAll("[aria-invalid]")                     // querySelectorAll devuelve TODOS los elementos que tengan ese atributo
    .forEach((campo) => campo.removeAttribute("aria-invalid"));     // forEach los recorre uno por uno y les quita el atributo
};                                                                  

// Atajo para leer el valor de un input sin espacios al principio ni al final.
export const leerCampo = (id) => document.getElementById(id).value.trim(); // .value es lo escrito en el input; .trim() limpia los espacios de los extremos
