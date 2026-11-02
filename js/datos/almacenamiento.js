/* =============================================================================
almacenamiento.js: el único que interactua con localStorage.
Es el archivo que guarda y lee datos del navegador. Maneja dos cosas:
-La lista de todas las cuentas. La primera vez que alguien entra al sitio, carga las de demostración.
-La sesión, guardando solo el id de la persona activa.
La consigna pide que "la cuenta y sus avances se conserven entre visitas" y que "el cierre de
sesión quite la identificación activa": eso se resuelve acá.
El resto del programa pide o entrega datos llamando a estas funciones, sin
saber cómo ni dónde se guardan.
- "lingoweb_usuarios" → arreglo con TODAS las cuentas (demo + registradas)
- "lingoweb_sesion"   → SOLO el id de la cuenta activa
- "lingoweb_opiniones" → las opiniones de todos los cursos (vista 3)
 =============================================================================*/

// import trae del módulo usuarios.js la constante exportada; la ruta es relativa a ESTE archivo y lleva la extensión .js
import { USUARIOS_DEMO, OPINIONES_DEMO } from "./usuarios.js"; // traemos las cuentas y las opiniones de demostración para cargarlas en la primera visita



const CLAVES = { // Objeto con los nombres de las claves de localStorage. No lleva export porque solo se utiliza aca.       
  usuarios: "lingoweb_usuarios",      // clave donde se guarda la lista de cuentas
  sesion: "lingoweb_sesion",           // clave donde se guarda el id de la cuenta activa
  opiniones: "lingoweb_opiniones"     // clave donde se guardan las opiniones de los cursos
};                                    

// --- Funciones genéricas (internas, sin export) ------------------------------

// Lee una clave y devuelve su contenido ya convertido a objeto/array de JS, o valorPorDefecto si no existe
const leerDato = (clave, valorPorDefecto) => {                     // recibe la clave a leer y qué devolver si no hay dato
  try {                                                            // try: intentamos leer; si algo falla saltamos al catch en vez de romper la página
    const texto = localStorage.getItem(clave);                     // getItem devuelve el texto guardado, o null si la clave no existe
    return texto === null ? valorPorDefecto : JSON.parse(texto);   // operador ternario: si no hay texto → por defecto; si hay → JSON.parse convierte el array con usuarios guaradados de texto a objeto
  } catch (error) {                                                // catch: se ejecuta si JSON.parse falla (texto dañado) o si el navegador bloquea localStorage
    return valorPorDefecto;                                        
  }                                                                
};                                                                 

// Guarda cualquier valor en una clave. localStorage SOLO guarda texto, por eso se utiliza JSON.stringify.
const guardarDato = (clave, valor) => {                            // recibe la clave y el valor (objeto, arreglo, string...)
  localStorage.setItem(clave, JSON.stringify(valor));              
};                                                                 

// --- Usuarios (exportadas: las usa la capa lógica) ---------------------------

// Devuelve el array con todas las cuentas. Si es la primera visita, carga las de demostración.
export const obtenerUsuarios = () => {                             // sin parámetros: siempre lee la lista completa
  const usuarios = leerDato(CLAVES.usuarios, null);                // pedimos la lista; null significa "nunca se guardó nada"
  if (usuarios === null) {                                         // primera visita al sitio (o datos borrados)
    guardarUsuarios(USUARIOS_DEMO);                                // guardamos las cuentas demo para que pedro y ana puedan iniciar sesión
    return leerDato(CLAVES.usuarios, []);                          // devolvemos una COPIA leída del almacenamiento (no el arreglo original del módulo, así nadie lo modifica por error)
  }                                                                // fin del if
  return usuarios;                                                 // caso normal: devolvemos lo que ya estaba guardado
};                                                                 

// Reemplaza la lista completa de cuentas por la actualizada.
export const guardarUsuarios = (usuarios) => {                     // recibe el array de cuentas actualizado
  guardarDato(CLAVES.usuarios, usuarios);                          
};                                                                 

// Busca una cuenta por su id (lo usa la sesión para saber quién está activo)(requisito de usuario activo mostrado en vista 2 de las consignas).
export const buscarUsuarioPorId = (id) => {                        // recibe el id a buscar
  return obtenerUsuarios().find((u) => u.id === id) || null;       // find devuelve la primera cuenta cuyo id coincide (=== estricto) o undefined; con || lo convertimos en null
};                                                                

// Agrega una cuenta nueva a la lista guardada (la usa el registro).
export const agregarUsuario = (usuario) => {                       // recibe el objeto de la cuenta nueva
  const usuarios = obtenerUsuarios();                              // leemos la lista actual
  usuarios.push(usuario);                                          // push agrega la cuenta al final del arreglo
  guardarUsuarios(usuarios);                                       // guardamos para actualizar
};                                                                 

// --- Sesión (exportadas: las usa la capa lógica) -----------------------------
// Guardamos SOLO el id, no una copia de la cuenta: los datos viven en un único lugar (la lista de usuarios),
// así cualquier cambio de progreso o de perfil se refleja en todas las vistas sin copias desactualizadas.

export const obtenerIdSesion = () => leerDato(CLAVES.sesion, null); // devuelve el id de la cuenta activa, o null si nadie inició sesión

export const guardarIdSesion = (id) => {                           // recibe el id de la cuenta que acaba de iniciar sesión
  guardarDato(CLAVES.sesion, id);                                  // lo guarda: desde ahora esa cuenta es la "persona activa"
};                                                                 

export const borrarSesion = () => {                                // se usa al cerrar sesión
  localStorage.removeItem(CLAVES.sesion);                          // removeItem borra SOLO la clave de sesión; las cuentas y su progreso siguen guardados
};                                                                 

// --- Opiniones (vista 3) -----------------------------------------------------
 
// Devuelve todas las opiniones de todos los cursos.
export const obtenerOpiniones = () => {
  // Pedimos la lista; null significa que nunca se guardó nada
  const opiniones = leerDato(CLAVES.opiniones, null);
  // Primera visita: guardamos las opiniones de demostración y las devolvemos
  if (opiniones === null) {
    guardarDato(CLAVES.opiniones, OPINIONES_DEMO);
    return leerDato(CLAVES.opiniones, []);
  }
  // Si ya había opiniones guardadas, las devolvemos tal cual
  return opiniones;
};
 
// Agrega una opinión nueva a la lista guardada.
export const agregarOpinion = (opinion) => {
  // Sacamos la lista, le agregamos la opinión al final y la volvemos a guardar
  const opiniones = obtenerOpiniones();
  opiniones.push(opinion);
  guardarDato(CLAVES.opiniones, opiniones);
};
