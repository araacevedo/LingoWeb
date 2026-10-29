// 1. Seguridad: Si alguien intenta entrar a dashboard.html copiando la URL pero sin iniciar sesión, 
// esta función lo expulsa automáticamente al login.
protegerRutaPrivada();

// 2. Activamos el botón "Salir" que está en el menú superior.
// Esto lee el id="enlace-salir", borra el localStorage y nos redirige al login.
inicializarCierreSesion();