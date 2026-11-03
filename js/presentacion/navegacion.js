// =============================================================================
// navegacion.js  ·  CAPA DE PRESENTACIÓN
// Este archivo decide quién puede ver cada página:
//   - Las páginas PRIVADAS (dashboard, perfil, cursos...) solo se ven con la
//     sesión iniciada. Si no hay sesión, mandamos a la persona al login.
//   - Las páginas PÚBLICAS (login, registro, recuperar) son para quien todavía
//     no entró. Si alguien ya inició sesión, lo mandamos al dashboard.
// También hace funcionar el botón "Salir" del menú y aplica el idioma de interfaz
// que la persona eligió en su perfil (Vista 5).
// =============================================================================

// Traemos dos funciones de logica/autenticacion.js. La ruta empieza con "../" porque tenemos que salir de la carpeta "presentacion" y entrar en la carpeta "logica".
import { obtenerUsuarioActivo, cerrarSesion } from "../logica/autenticacion.js"; // obtenerUsuarioActivo = "¿quién está conectado?"; cerrarSesion = "desconectar"

// Traemos las traducciones de los textos fijos de la interfaz
import { TEXTOS } from "../datos/textos.js";

// Lleva a la persona a otra página del sitio.
export const irA = (pagina) => {                                    // "pagina" es el nombre del archivo al que queremos ir, por ejemplo "dashboard.html"
  window.location.replace(pagina);                                  // window.location es la dirección que se ve en la barra del navegador; replace() la cambia por otra y la página nueva reemplaza a la actual en el historial, así el botón "atrás" no vuelve a una página que ya no corresponde (por ejemplo, al login después de entrar)
};                                                                  

// Se usa al principio de cada página PRIVADA.
// Devuelve la cuenta de quien está conectado, o null si no hay nadie (y en ese caso lo manda al login).
export const iniciarPaginaPrivada = () => {                         // no recibe nada
  const usuario = obtenerUsuarioActivo();                           // preguntamos quién está conectado: nos da su cuenta, o null si nadie inició sesión
  if (!usuario) {                                                   // si NO hay nadie conectado (por ejemplo, alguien escribió "dashboard.html" en la barra sin loguearse)...
    irA("login.html");                                              // ...lo mandamos al login
    return null;                                                    // ...y devolvemos null para avisarle a la página que no siga cargando nada
  }                                                                

  activarEnlacesSalir();                                            // si llegamos acá, hay alguien conectado: hacemos funcionar el botón "Salir" del menú
  aplicarIdioma(usuario.idiomaInterfaz);                            // mostramos la página en el idioma que la persona eligió en su perfil

  
  // Caso especial del botón "atrás": algunos navegadores, al volver atrás, muestran una "foto" guardada
  // de la página en vez de cargarla de nuevo, y entonces este código no se vuelve a ejecutar.
  // Ejemplo: entro al dashboard → toco "Salir" → toco "atrás": sin esto, vería otra vez el dashboard.
  window.addEventListener("pageshow", (evento) => {                 // "pageshow" ocurre cada vez que la página aparece en pantalla, también al volver atrás
    if (evento.persisted) window.location.reload();                 // persisted vale true cuando lo que se ve es esa "foto" guardada; en ese caso recargamos la página para que este código vuelva a revisar si hay sesión
  });                                                               

  return usuario;                                                   // devolvemos la cuenta de quien está conectado, para que la página muestre SUS datos
};                                                                  

// Se usa al principio de cada página PÚBLICA (login, registro, recuperar).
// Devuelve true si la página se puede mostrar, o false si mandó a la persona al dashboard.
export const iniciarPaginaPublica = () => {                         // no recibe nada
  if (obtenerUsuarioActivo()) {                                     // si YA hay alguien conectado, no tiene sentido que vea el login o el registro...
    irA("dashboard.html");                                          // ...así que lo mandamos directo a su panel
    return false;                                                   // false = "no armes el formulario"
  }                                                                 // fin del if
  return true;                                                      // true = no hay nadie conectado, se puede mostrar el formulario
};                                                                  // fin de iniciarPaginaPublica

// Hace funcionar todos los enlaces "Salir" de la página.
// No lleva export porque solo se usa dentro de este archivo (la llama iniciarPaginaPrivada).
const activarEnlacesSalir = () => {                                 // no recibe nada
  document.querySelectorAll(".enlace-salir").forEach((enlace) => {  // buscamos todos los elementos con la clase "enlace-salir" y repetimos lo siguiente con cada uno
    enlace.addEventListener("click", (evento) => {                  // cuando se hace clic en "Salir"...
      evento.preventDefault();                                      // ...frenamos lo que el enlace haría solo (ir directo al login), porque antes hay que desconectar
      cerrarSesion();                                               // ...desconectamos a la persona (se borra la sesión, pero su cuenta y progreso quedan guardados)
      irA("login.html");                                            // ...y recién ahora la llevamos al login
    });                                                             
  });                                                               
};                                                                  

// Cambia los textos fijos de la página al idioma elegido en el perfil.
// Como se llama desde iniciarPaginaPrivada, se aplica en TODAS las páginas privadas,
// y como el idioma está guardado en la cuenta, se conserva al volver a ingresar.
const aplicarIdioma = (idioma) => {
  // Le avisamos al navegador (y a los lectores de pantalla) en qué idioma está la página
  document.documentElement.lang = idioma; //cambia el lang="es" de la etiqueta <html> por "en"
  // Buscamos las traducciones de ese idioma. Para español no hay: el HTML ya está en español
  const textos = TEXTOS[idioma];
  if (!textos) return;
  // Recorremos cada selector de la lista y le ponemos el texto traducido a lo que encuentre en la página
  for (const selector in textos) {
    document.querySelectorAll(selector).forEach((elemento) => {
      elemento.textContent = textos[selector];
    });
  }
};
