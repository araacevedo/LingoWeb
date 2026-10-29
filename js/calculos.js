// Este módulo respeta la Separación de Responsabilidades: son "Funciones Puras" que procesan la lógica y devuelven un resultado sin tocar el DOM
const validarRegistro = (usuariosRegistrados, nombre, usuario, email, password, confirmarPassword) => {
  if (!nombre || !usuario || !email || !password) {
    return "Todos los campos son obligatorios.";
  }
  
  // Accedemos a la propiedad .length del String para validar la cantidad de caracteres
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  
  // Usamos Desigualdad Estricta (!==) para comparar valor y tipo sin coerción automática
  if (password !== confirmarPassword) {
    return "Las contraseñas no coinciden.";
  }
  
  // .find() es un método de array que devuelve el primer elemento que satisface la función de prueba proporcionada 
  const existeUsuario = usuariosRegistrados.find(u => u.usuario === usuario || u.email === email);
  
  // Si .find() encontró un objeto, existeUsuario es 'true' y el flujo ingresa al if
  if (existeUsuario) {
    return "El nombre de usuario o correo electrónico ya está en uso.";
  }

  // Si todas las validaciones pasan, retornamos null indicando la ausencia intencional de un error
  return null; 
};

const verificarCredenciales = (usuariosRegistrados, identificador, password) => {
  // Agrupamos la condición lógica con paréntesis para asegurar que se evalúe primero el usuario o email, y luego se exija el AND (&&) de la contraseña
  const usuarioValido = usuariosRegistrados.find(
    (u) => (u.usuario === identificador || u.email === identificador) && u.password === password
  );
  
  // Retornamos el objeto del usuario si se encontró, o null como valor por defecto 
  return usuarioValido || null;
};