// Este módulo centraliza la Presentación. Es el único encargado de modificar la página interactuando con el DOM 
// Utilizamos un parámetro con valor predeterminado (esExito = false) por si no se especifica el argumento al llamar la función 
const mostrarMensaje = (idContenedor, mensaje, esExito = false) => {
  // document.getElementById() busca en el árbol de nodos (DOM) el elemento exacto mediante su atributo ID 
  const contenedor = document.getElementById(idContenedor);
  
  // Si el nodo no existe (null), detenemos la ejecución para evitar un "Error de ejecución" en consola
  if (!contenedor) return;

  // Modificamos el contenido visible usando .textContent de forma segura, en lugar de innerHTML 
  contenedor.textContent = mensaje;
  
  // classList.remove() elimina clases sin sobrescribir todas las demás, manteniendo el código CSS modular 
  contenedor.classList.remove("oculto", "resultado-correcto", "resultado-incorrecto");
  
  // Controlamos la apariencia a través de clases CSS en lugar de modificar .style directamente
  if (esExito) {
    // classList.add() aplica el estilo definido en el archivo forms-buttons.css 
    contenedor.classList.add("resultado-correcto");
  } else {
    contenedor.classList.add("resultado-incorrecto");
  }
};

const ocultarMensaje = (idContenedor) => {
  const contenedor = document.getElementById(idContenedor);
  if (contenedor) {
    contenedor.classList.add("oculto");
  }
};