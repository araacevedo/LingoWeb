// =============================================================================
// validaciones.js  ·  CAPA LÓGICA
// Rol en el TP: la consigna pide que "los formularios validen la información
// ingresada" e "indiquen qué dato debe revisarse". Revisa si los datos son válidos: 
// campos vacíos, formato del email, largo de la contraseña, si coinciden las dos contraseñas, si el usuario o el email ya están ocupados.
// Son funciones PURAS: reciben datos y devuelven un resultado; no leen el DOM
// ni localStorage. Por eso se pueden reutilizar (por ejemplo, en el perfil).
//
// Todas devuelven:
//   - null si los datos son válidos
//   - { campo, mensaje } si hay un error
//     (campo = id del <input> a marcar; mensaje = texto que verá la persona)
// =============================================================================

const LARGO_MINIMO_CONTRASENA = 6;                    // constante interna: largo mínimo de contraseña; si cambia la regla, se cambia solo acá

//La expresion regular REGEX es una secuencia de caracteres que define un patron de busqueda. Son utiles para validacion de datos que siguen estructuras especificas como  direcciones de correo electrónico, números de teléfono, etc. Se crea entre barras 
//Método test(): Es el método más común para la validación. Devuelve true si la cadena de texto coincide con el patrón y false en caso contrario.
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;     // algo@algo.algo: ^ inicio, [^\s@]+ uno o más caracteres que no sean espacio ni @, $ fin
const REGEX_USUARIO = /^[a-zA-Z0-9_.]{3,20}$/;        // de 3 a 20 caracteres, solo letras, números, guion bajo o punto (sin espacios)

const esEmailValido = (email) => REGEX_EMAIL.test(email); // función interna: true si el email tiene formato válido

// Se exporta porque autenticacion.js también la usa para comparar usuario/email al iniciar sesión.
export const normalizar = (texto) => texto.trim().toLowerCase(); // trim quita espacios de los extremos y toLowerCase pasa a minúsculas: "Pedro " y "pedro" quedan iguales

// ---------------------------------------------------------------------------
// Validación del formulario de inicio de sesión: solo controla que no falte información.
export const validarLogin = (identificador, contraseña) => {       // recibe lo escrito en "Usuario / Email" y en "Contraseña"
  if (!identificador) {                                             // ! niega: un string vacío "" es false, así que entra a la condicion si el campo está vacío
    return { campo: "identificador", mensaje: "Ingresa tu usuario o email." }; // devuelve qué input marcar y qué decir
  }                                                                 
  if (!contraseña) {                                               //Si la contraseña esta vacía
    return { campo: "contraseña", mensaje: "Ingresa tu contraseña." }; // error asociado al input de contraseña
  }                                                                 
  return null;                                                      // null = no hay errores 
};                                                                 

// ---------------------------------------------------------------------------
// Validación del registro. Recibe la lista de usuarios para controlar que el identificador elegido no esté ocupado (lo pide la consigna).
export const validarRegistro = (usuarios, datos) => {               // usuarios = cuentas existentes; datos = objeto armado con el formulario
  const { nombre, usuario, email, contraseña, confirmarContraseña } = datos; // crea 5 constantes a partir de las propiedades del objeto

  // Objeto "id del input → valor escrito".
  const obligatorios = { nombre, usuario, email, contraseña, confirmarContraseña }; // nombre, usuario... es la forma abreviada de nombre: nombre
  for (const campo in obligatorios) {                               // for...in recorre las CLAVES del objeto, en orden: nombre, usuario, email...
    if (!obligatorios[campo]) {                                     // obligatorios[campo] lee el valor de esa clave; si está vacío...
      return { campo, mensaje: "Todos los campos son obligatorios: completa el campo marcado." }; // ...cortamos en el PRIMER campo vacío y lo informamos
    }                                                               
  }                                                                 

  if (!REGEX_USUARIO.test(usuario)) {                               // el usuario no cumple el patrón (muy corto, largo o con espacios)
    return { campo: "usuario", mensaje: "El usuario debe tener entre 3 y 20 caracteres, sin espacios (letras, números, _ o .)." }; // error asociado al input de usuario
  }                                                                 

  if (!esEmailValido(email)) {                                      // el email no tiene formato algo@algo.algo
    return { campo: "email", mensaje: "El email no tiene un formato válido (ejemplo: nombre@correo.com)." }; // error de formato asociado al input de email
  }                                                                

  if (contraseña.length < LARGO_MINIMO_CONTRASENA) {               // .length da la cantidad de caracteres del string
    return { campo: "contraseña", mensaje: `La contraseña debe tener al menos ${LARGO_MINIMO_CONTRASENA} caracteres.` }; // template literal: ${...} inserta el valor de la constante
  }                                                                 

  if (contraseña !== confirmarContraseña) {                         // desigualdad estricta (!==): compara valor y tipo sin conversiones automáticas
    return { campo: "confirmarContraseña", mensaje: "Las contraseñas no coinciden." }; // se marca el campo de confirmación
  }                                                                

  if (usuarios.some((u) => normalizar(u.usuario) === normalizar(usuario))) { // .some devuelve true si AL MENOS una cuenta ya tiene ese usuario (sin importar mayúsculas)
    return { campo: "usuario", mensaje: "Ese nombre de usuario ya está en uso. Elige otro." }; // identificador ocupado (lo pide la consigna)
  }                                                                

  if (usuarios.some((u) => normalizar(u.email) === normalizar(email))) { // mismo control para el email: no puede haber dos cuentas con el mismo correo
    return { campo: "email", mensaje: "Ya existe una cuenta con ese email." }; // email ocupado
  }                                                                 

  return null;                                                      // pasó todas las reglas: datos válidos
};                                                                  

// ---------------------------------------------------------------------------
// Validación del formulario de recuperación de contraseña.
export const validarEmailRecuperacion = (email) => {                // recibe el email escrito
  if (!email) {                                                     // campo vacío
    return { campo: "email", mensaje: "Ingresa el email asociado a tu cuenta." }; // falta información
  }                                                                 
  if (!esEmailValido(email)) {                                      // formato inválido
    return { campo: "email", mensaje: "El email no tiene un formato válido (ejemplo: nombre@correo.com)." }; // error de formato asociado al input de email
  }                                                                 
  return null;                                                      // email con formato correcto (si existe o no lo decide autenticacion.js)
};                                                                  

// ---------------------------------------------------------------------------
// Vista 3: validación del formulario de opiniones del curso.
// La consigna pide "elegir y guardar una calificación y comentarios no vacíos".
export const LARGO_MAXIMO_COMENTARIO = 300;
 
export const validarOpinion = (estrellas, comentario) => {
  // Si no se eligió ninguna estrella, marcamos la primera opción para que la persona vea dónde elegir
  if (!estrellas) {
    return { campo: "estrella-1", mensaje: "Elige una calificación de 1 a 5 estrellas." };
  }
  // El comentario no puede quedar vacío
  if (!comentario) {
    return { campo: "comentario", mensaje: "Escribe un comentario antes de publicar." };
  }
  // Ni ser demasiado largo
  if (comentario.length > LARGO_MAXIMO_COMENTARIO) {
    return { campo: "comentario", mensaje: `El comentario puede tener hasta ${LARGO_MAXIMO_COMENTARIO} caracteres.` };
  }
  // Todo bien
  return null;
};
