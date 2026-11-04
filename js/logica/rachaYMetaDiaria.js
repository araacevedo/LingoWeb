// Convierte una fecha al formato AAAA-MM-DD usando el horario local.
const obtenerFechaLocal = (fecha) => {
  const anio = fecha.getFullYear();

  // Los meses empiezan en 0. padStart completa con cero: 3 → "03".
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};

// Actualiza la racha y la XP ganada durante el día en la cuenta recibida.
// progreso.js se encargará de guardar los cambios.
// fecha tiene un valor predeterminado y permite simular otros días en pruebas.
export const actualizarRachaYXpDiaria = (
  usuario,
  xpGanada,
  fecha = new Date(),
) => {
  const hoy = obtenerFechaLocal(fecha);

  // Copiamos la fecha para calcular ayer sin modificar la original.
  const fechaAyer = new Date(fecha);
  fechaAyer.setDate(fechaAyer.getDate() - 1);
  const ayer = obtenerFechaLocal(fechaAyer);

  // Si ya practicó hoy, suma XP diaria y conserva la racha.
  if (usuario.ultimaActividad === hoy) {
    // ?? usa 0 si el campo es null o todavía no existe.
    usuario.xpDiaria = (usuario.xpDiaria ?? 0) + xpGanada;
    return; // Finaliza la función sin aumentar otra vez la racha.
  }

  // Operador ternario: si practicó ayer, suma un día; si no, empieza en 1.
  usuario.racha =
    usuario.ultimaActividad === ayer ? (usuario.racha ?? 0) + 1 : 1;

  // Primer registro de actividad del día: inicia su XP y guarda la fecha.
  usuario.xpDiaria = xpGanada;
  usuario.ultimaActividad = hoy;
};

// Devuelve los valores que corresponden mostrar en la fecha consultada.
// No modifica ni guarda la cuenta.
export const obtenerRachaYXpDiaria = (usuario, fecha = new Date()) => {
  const hoy = obtenerFechaLocal(fecha);

  const fechaAyer = new Date(fecha);
  fechaAyer.setDate(fechaAyer.getDate() - 1);
  const ayer = obtenerFechaLocal(fechaAyer);

  const practicoHoy = usuario.ultimaActividad === hoy;
  const practicoAyer = usuario.ultimaActividad === ayer;

  // La racha sigue vigente si practicó hoy o ayer.
  const rachaVigente = practicoHoy || practicoAyer;

  // Devuelve un objeto con los datos para mostrar en pantalla.
  return {
    racha: rachaVigente ? (usuario.racha ?? 0) : 0,
    xpDiaria: practicoHoy ? (usuario.xpDiaria ?? 0) : 0,
  };
};
