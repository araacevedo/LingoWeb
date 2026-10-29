const protegerRutaPrivada = () => {
  const usuario = obtenerUsuarioActivo();
  // Si no hay usuario activo, evalúa a true
  if (!usuario) {
    // Modificamos location.href para forzar un redireccionamiento 
    window.location.href = "./login.html";
  }
};

const redirigirSiLogueado = () => {
  const usuario = obtenerUsuarioActivo();
  if (usuario) {
    window.location.href = "./dashboard.html";
  }
};

const inicializarCierreSesion = () => {
  const btnSalir = document.getElementById("enlace-salir");
  if (btnSalir) {
    // Adjuntamos un manejador de eventos para escuchar el clic del usuario
    btnSalir.addEventListener("click", (e) => {
      // Prevenimos el comportamiento por defecto de la etiqueta <a>
      e.preventDefault();
      cerrarSesion();
      window.location.href = "./login.html";
    });
  }
};