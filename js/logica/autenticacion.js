// =============================================================================
// autenticacion.js  ·  CAPA LÓGICA
// Rol en el TP: resuelve la vista 1 ("reconocer a una persona usuaria y abrir
// su espacio de aprendizaje") y el cierre de sesión de la vista 5.
// Casos de uso: iniciar sesión, registrarse, recuperar acceso, saber quién es
// la persona activa y cerrar sesión.
// Combina validaciones (lógica) + almacenamiento (datos). NUNCA toca el DOM:
// devuelve un resultado y la capa de presentación decide qué mostrar.
//
// Formato de respuesta:
//   { ok: true, ... }               → la operación se realizó
//   { ok: false, campo, mensaje }   → qué dato hay que revisar
// =============================================================================

// Importamos de la capa de DATOS solo las funciones que este módulo necesita
import { // apertura de la lista de funciones a importar (una por línea para comentarlas)
  obtenerUsuarios,      // lista completa de cuentas
  agregarUsuario,       // guardar una cuenta nueva
  buscarUsuarioPorId,   // encontrar la cuenta activa a partir del id de sesión
  obtenerIdSesion,      // leer el id de la sesión
  guardarIdSesion,      // abrir sesión
  borrarSesion          // cerrar sesión
} from "../datos/almacenamiento.js"; // "../" sube de la carpeta logica/ a js/ y entra en datos/
import { crearUsuario } from "../datos/usuarios.js"; // molde de cuenta nueva
import { validarLogin, validarRegistro, validarEmailRecuperacion, normalizar } from "./validaciones.js"; // reglas de validación (misma carpeta: "./")

// -----------------------------------------------------------------------------
// Inicio de sesión: la consigna pide validar los campos y avisar si "falta información o no se reconoce la cuenta".
export const iniciarSesion = (identificador, contraseña) => {      // recibe usuario/email y contraseña escritos
  const error = validarLogin(identificador, contraseña);           // 1) ¿falta información?
  if (error) return { ok: false, ...error };                        // si falta, devolvemos el error; ...error copia campo y mensaje dentro del resultado

  const usuario = obtenerUsuarios().find(                           // 2) ¿se reconoce la cuenta? find devuelve la primera cuenta que cumpla la condición
    (u) => (normalizar(u.usuario) === normalizar(identificador) ||  // coincide el usuario (|| = "o")...
            normalizar(u.email) === normalizar(identificador)) &&   // ...o coincide el email; los paréntesis agrupan el "o" antes de evaluar el "y" (&&)
           u.contraseña === contraseña                             // y además la contraseña es exactamente igual (no se normaliza: distingue mayúsculas)
  );                                                                // fin del find

  if (!usuario) {                                                   // no hubo coincidencia: la cuenta no se reconoce
    return { ok: false, campo: "identificador", mensaje: "Usuario/email o contraseña incorrectos." }; // no se aclara cuál falló: práctica habitual de seguridad
  }                                                                 

  guardarIdSesion(usuario.id);                                      // 3) se identifica a la persona activa guardando SOLO su id
  return { ok: true, usuario };                                     // éxito: devolvemos la cuenta para que la presentación pueda saludar por el nombre
};                                                                  

// -----------------------------------------------------------------------------
// Registro: la consigna pide validar como obligatorio y que el identificador elegido no esté ocupado.
export const registrarUsuario = (datos) => {                        // recibe el objeto con los datos del formulario
  const error = validarRegistro(obtenerUsuarios(), datos);          // validamos contra la lista actual de cuentas
  if (error) return { ok: false, ...error };                        // algún dato debe revisarse

  const nuevoUsuario = crearUsuario(datos);                         
  agregarUsuario(nuevoUsuario);                                     
  return { ok: true, usuario: nuevoUsuario };                       
};                                                                  

// -----------------------------------------------------------------------------
// Recuperación SIMULADA: la consigna pide "informar el resultado del proceso simulado"; no se envía ningún correo real.
export const recuperarAcceso = (email) => {                         // recibe el email escrito
  const error = validarEmailRecuperacion(email);                    // ¿vacío o con formato inválido?
  if (error) return { ok: false, ...error };                        // devolvemos el error

  const existe = obtenerUsuarios().some((u) => normalizar(u.email) === normalizar(email)); // some: true si alguna cuenta tiene ese email
  if (!existe) {                                                    // ninguna cuenta lo usa
    return { ok: false, campo: "email", mensaje: "No encontramos ninguna cuenta con ese email." }; // resultado negativo que verá la persona
  }                                                                 
  return { ok: true };                                              // existe: la presentación mostrará la confirmación simulada
};                                                                  

// -----------------------------------------------------------------------------
// Persona activa: todas las vistas privadas la usan para mostrar "sus propios datos y avances".
export const obtenerUsuarioActivo = () => {                         // sin parámetros
  const id = obtenerIdSesion();                                     // leemos el id guardado al iniciar sesión
  if (!id) return null;                                             // no hay sesión abierta

  const usuario = buscarUsuarioPorId(id);                           // buscamos la cuenta COMPLETA y actualizada en la lista de usuarios
  if (!usuario) borrarSesion();                                     // el id ya no corresponde a ninguna cuenta (datos borrados): limpiamos la sesión inválida
  return usuario;                                                   // la cuenta, o null
};                                                                  

// Cierre de sesión (vista 5): quita la identificación activa sin borrar cuentas ni progreso.
export const cerrarSesion = () => {                                 // sin parámetros
  borrarSesion();                                                   // delega en la capa de datos
};                                                                  
