// Usamos funciones flecha (=>) por su sintaxis concisa, priorizada en el estilo moderno de JavaScript
const obtenerUsuarios = () => {
  // Declaramos con 'const' porque el valor extraído no cambiará dentro de este bloque de ejecución
  //getItem() recupera el valor asociado a la clave, devolviendo null si no existe
  const usuarios = localStorage.getItem("usuarios");
  // Si existe, JSON.parse() convierte la cadena de texto JSON a un objeto o array de JavaScript, vital para leer el LocalStorage
  return usuarios ? JSON.parse(usuarios) : [];
};

// La función recibe el parámetro 'usuarios' que contiene los datos concretos a guardar
const guardarUsuarios = (usuarios) => {
  // stringify() serializa el objeto/array a una cadena de texto, ya que LocalStorage solo acepta strings 
  // setItem() guarda el par clave-valor de forma persistente en el navegador
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
};

const obtenerUsuarioActivo = () => {
  const usuario = localStorage.getItem("usuarioActivo");
  return usuario ? JSON.parse(usuario) : null;
};

const guardarUsuarioActivo = (usuario) => {
  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
};

const cerrarSesion = () => {
  // removeItem() elimina únicamente el par clave-valor asociado a la sesión, sin borrar toda la base de datos
  localStorage.removeItem("usuarioActivo");
};