//Este archivo actúa como "Coordinador", conectando la UI con los datos y los cálculos
// Llamamos a la función para expulsar al usuario si ya tiene una sesión iniciada.
redirigirSiLogueado();

const formRegistro = document.getElementById("form-registro");
// Estructura de bloque condicional: evitamos errores asegurándonos de que el formulario exista en esta página antes de manipularlo 
if (formRegistro) {
  // Capturamos el evento 'submit', que es el método estándar para interceptar envíos de formularios en JavaScript 
  formRegistro.addEventListener("submit", (e) => {
    // e.preventDefault() detiene la recarga automática de la página y el envío HTTP, permitiéndonos controlar el flujo con JS
    e.preventDefault();

    // Extraemos el atributo .value de los inputs para leer el dato. Usamos .trim() para limpiar espacios en blanco innecesarios 
    const nombre = document.getElementById("nombre").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmarPassword = document.getElementById("confirmar-password").value;

    const usuarios = obtenerUsuarios();

    // Invocamos la función de la capa lógica enviándole los argumentos correspondientes
    const error = validarRegistro(usuarios, nombre, usuario, email, password, confirmarPassword);

    // Evaluamos la decisión: si hay error, mostramos el mensaje rojo; sino, creamos la cuenta 
    if (error) {
      mostrarMensaje("mensaje-registro", "✕ " + error, false);
    } else {
      // Creamos un nuevo Objeto para agrupar los datos del estudiante
      const nuevoUsuario = {
        nombre,
        usuario,
        email,
        password,
        // Inicializamos los valores por defecto
        xp: 0,
        racha: 0,
        liga: "Bronce",
        idiomaInterfaz: "es",
        cursosActivos: [],
        cursosArchivados: []
      };

      // push() es un método mutador de Array que añade el objeto al final de la colección
      usuarios.push(nuevoUsuario);

      // Llamamos al módulo storage para persistir los cambios en LocalStorage
      guardarUsuarios(usuarios);
      mostrarMensaje("mensaje-registro", "✓ ¡Cuenta creada con éxito! Redirigiendo...", true);

      // setTimeout() retrasa la redirección, dando tiempo (1500ms) a que el usuario lea el cartel verde 
      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1500);
    }
  });
}

const formLogin = document.getElementById("form-login");
if (formLogin) {
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const identificador = document.getElementById("identificador").value.trim();
    const password = document.getElementById("password").value;

    const usuarios = obtenerUsuarios();
    // Reutilizamos la función de cálculo sin duplicar la lógica de comparación en este archivo
    const usuarioValido = verificarCredenciales(usuarios, identificador, password);

    if (usuarioValido) {
      guardarUsuarioActivo(usuarioValido);
      mostrarMensaje("mensaje-login", "✓ Acceso correcto. Cargando tus cursos...", true);
      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 1000);
    } else {
      mostrarMensaje("mensaje-login", "✕ Usuario o contraseña incorrectos.", false);
    }
  });
}

const formRecuperar = document.getElementById("form-recuperar");
if (formRecuperar) {
  formRecuperar.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const usuarios = obtenerUsuarios();

    // Método find() para localizar si el correo coincide con un registro existente
    const existe = usuarios.find(u => u.email === email);

    if (existe) {
      mostrarMensaje("mensaje-recuperar", "✓ Instrucciones enviadas a tu correo.", true);
    } else {
      mostrarMensaje("mensaje-recuperar", "✕ No encontramos ninguna cuenta con ese correo.", false);
    }
  });
}