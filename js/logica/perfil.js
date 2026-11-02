// =============================================================================
// logica/perfil.js  ·  CAPA LÓGICA
// Valida los datos editados por el usuario en la Vista 5 y los guarda.
// =============================================================================

import { obtenerUsuarios, guardarUsuarios, buscarUsuarioPorId } from "../datos/almacenamiento.js";
import { normalizar } from "./validaciones.js";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_USUARIO = /^[a-zA-Z0-9_.]{3,20}$/;

export const actualizarDatosPerfil = (idUsuario, datos) => {
  const usuarioActual = buscarUsuarioPorId(idUsuario);
  if (!usuarioActual) return { ok: false, campo: "", mensaje: "Error de sesión." };

  // 1. Validar campos vacíos
  if (!datos.nombre) return { ok: false, campo: "nombre", mensaje: "El nombre no puede estar vacío." };
  if (!datos.usuario) return { ok: false, campo: "usuario", mensaje: "El usuario no puede estar vacío." };
  if (!datos.email) return { ok: false, campo: "email", mensaje: "El email no puede estar vacío." };

  // 2. Validar formatos (mismas reglas que en registro)
  if (!REGEX_USUARIO.test(datos.usuario)) {
    return { campo: "usuario", ok: false, mensaje: "El usuario debe tener entre 3 y 20 caracteres, sin espacios (letras, números, _ o .)." };
  }
  if (!REGEX_EMAIL.test(datos.email)) {
    return { campo: "email", ok: false, mensaje: "El email no tiene un formato válido (ejemplo: nombre@correo.com)." };
  }

  // 3. Validar la contraseña actual (obligatoria para autorizar cambios)
  if (!datos.passwordActual) {
    return { ok: false, campo: "password-actual", mensaje: "Ingresa tu contraseña actual para confirmar los cambios." };
  }
  if (datos.passwordActual !== usuarioActual.contraseña) {
    return { ok: false, campo: "password-actual", mensaje: "La contraseña actual es incorrecta." };
  }

  // 4. Validar que el nuevo usuario o email no estén ocupados por OTRA cuenta
  const usuarios = obtenerUsuarios();

  const usuarioOcupado = usuarios.some((u) => u.id !== idUsuario && normalizar(u.usuario) === normalizar(datos.usuario));
  if (usuarioOcupado) return { ok: false, campo: "usuario", mensaje: "Ese nombre de usuario ya está en uso." };

  const emailOcupado = usuarios.some((u) => u.id !== idUsuario && normalizar(u.email) === normalizar(datos.email));
  if (emailOcupado) return { ok: false, campo: "email", mensaje: "Ese email ya está registrado en otra cuenta." };

  // 5. Si escribió una contraseña nueva, validarla
  if (datos.passwordNueva || datos.passwordConfirmacion) {
    if (datos.passwordNueva.length < 6) {
      return { ok: false, campo: "password-nueva", mensaje: "La nueva contraseña debe tener al menos 6 caracteres." };
    }
    if (datos.passwordNueva !== datos.passwordConfirmacion) {
      return { ok: false, campo: "password-confirmacion", mensaje: "Las contraseñas nuevas no coinciden." };
    }
    usuarioActual.contraseña = datos.passwordNueva;
  }

  // 6. Actualizar datos y guardar en localStorage
  usuarioActual.nombre = datos.nombre;
  usuarioActual.usuario = datos.usuario;
  usuarioActual.email = datos.email;
  usuarioActual.idiomaInterfaz = datos.idiomaInterfaz;

  const indice = usuarios.findIndex((u) => u.id === idUsuario);
  usuarios[indice] = usuarioActual;
  guardarUsuarios(usuarios);

  return { ok: true };
};