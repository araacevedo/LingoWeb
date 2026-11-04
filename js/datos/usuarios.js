// =======================================================================================================================================================================
//usuarios.js: el molde de una cuenta.
//Define cómo es una cuenta de LingoWeb. 
//La función crearUsuario arma una cuenta nueva con los datos del registro y le completa los valores iniciales: 
// 0 de experiencia, 0 de racha, liga Bronce, etc. También trae las dos cuentas de demostración (pedro y ana), que cubren el pedido de la consigna de tener “más de una cuenta”.
// =================================================================================================================================================================

// crearUsuario la usa autenticacion.js al registrar
// Es una función flecha que recibe UN objeto y, con desestructuración ({ ... }), extrae solo los 4 datos que vienen del formulario.
export const crearUsuario = ({ nombre, usuario, email, contraseña }) => ({ // los paréntesis alrededor de { } indican que la funcion flecha DEVUELVE un objeto literal
  id: "u-" + Date.now(),          // id único e inmutable: Date.now() da los milisegundos actuales, distintos en cada registro; la sesión guarda este id
  nombre,                         
  usuario,                        
  email,                          
  contraseña,                      // contraseña: SOLO para la demo; un sistema real nunca la guarda en texto plano (la consigna pide no usar credenciales reales)
  fechaAlta: new Date().toISOString().slice(0, 10), // fecha de incorporación (pedida en la vista 5) "AAAA-MM-DD" (toISOString da fecha+hora, slice se queda con los primeros 10 caracteres); la muestra el perfil
  xp: 0,                          // experiencia acumulada: empieza en 0; la suman las lecciones (vista 4) y la muestran dashboard y perfil
  xpSemanal: 0,                   // experiencia ganada esta semana: es el puntaje de la tabla de clasificación (vista 6)
  racha: 0,                       // días seguidos con actividad: 0 en una cuenta nueva (sirve para el "estado inicial" del dashboard)
  metaDiaria: 50,                 // meta de XP por día que muestra el resumen del dashboard y la sección de rachas
  liga: "Bronce",                 // liga inicial para la tabla de clasificación (vista 6)
  idiomaInterfaz: "es",           // idioma de la interfaz que se elegirá en el perfil (vista 5)
  progreso: {}                    // objeto vacío: se completará por curso a medida que la persona haga lecciones (vistas 3 y 4)
});                               

// Cuentas de demostración que se cargan la primera vez que se abre el sitio (exportada para ser utilizada en almacenamiento.js).

export const USUARIOS_DEMO = [    // array (lista) de objetos: cada objeto es una cuenta con la misma forma que crearUsuario
  {                               // --- primera cuenta demo: pedro / demo123 ---
    id: "u-pedro",                // id fijo (no usa Date.now) para que sea siempre el mismo
    nombre: "Pedro Ramírez",      
    usuario: "pedro",             
    email: "pedro@lingoweb.com",  
    contraseña: "demo123",          
    fechaAlta: "2026-03-10",      
    xp: 720,                      
    xpSemanal: 180,               // puntaje de esta semana en la clasificación
    racha: 5,                     
    metaDiaria: 50,               
    liga: "Bronce",               
    idiomaInterfaz: "es",         
    progreso: {                   // por cada curso, las lecciones que terminó y el resultado que obtuvo en cada una
      ingles: {                   // inglés: terminó 2 de 4 lecciones (50%)
        l1: { xp: 40, errores: 1, fecha: "12/03/2026" },   // xp = experiencia ganada, errores = respuestas incorrectas, fecha = cuándo la terminó
        l2: { xp: 50, errores: 0, fecha: "14/03/2026" }
      },
      aleman: {                   // alemán: terminó 1 de 4 lecciones (25%); chino no aparece porque todavía no lo empezó
        l1: { xp: 30, errores: 2, fecha: "02/04/2026" }
      }
    }                  
  },                              
  {                               // --- segunda cuenta demo: ana / demo123, con datos DISTINTOS para comprobar que no se mezclan ---
    id: "u-ana",                  
    nombre: "Ana Martínez",       
    usuario: "ana",               
    email: "ana@lingoweb.com",    
    contraseña: "demo123",          
    fechaAlta: "2026-06-21",      
    xp: 1450,                     
    xpSemanal: 310,               // puntaje de esta semana en la clasificación
    racha: 9,                     
    metaDiaria: 80,               
    liga: "Plata",                // otra liga (permite probar el selector de la vista 6)
    idiomaInterfaz: "es",         
    progreso: {                   // por cada curso, las lecciones que terminó y su resultado
      ingles: {                   // inglés: terminó las 4 lecciones (100%)
        l1: { xp: 50, errores: 0, fecha: "22/06/2026" },
        l2: { xp: 40, errores: 1, fecha: "24/06/2026" },
        l3: { xp: 50, errores: 0, fecha: "01/07/2026" },
        l4: { xp: 50, errores: 0, fecha: "03/07/2026" }
      },
      aleman: {                   // alemán: terminó 3 de 4 lecciones (75%)
        l1: { xp: 50, errores: 0, fecha: "01/08/2026" },
        l2: { xp: 40, errores: 1, fecha: "04/08/2026" },
        l3: { xp: 30, errores: 2, fecha: "06/08/2026" }
      },
      chino: {                    // chino: terminó 1 de 4 lecciones (25%)
        l1: { xp: 30, errores: 2, fecha: "10/09/2026" }
      }
    }                  // progreso por curso, a definir en la vista 2/3                  // progreso por curso, a definir en la vista 2/3
  },

  // --- Participantes de demostración para la tabla de clasificación (vista 6) ---
  // Así cada liga tiene varias personas para comparar puestos, ascensos y permanencias.
  // También se puede iniciar sesión con ellas (contraseña demo123). Empiezan sin lecciones hechas.
  { id: "u-lucia", nombre: "Lucía Fernández", usuario: "lucia", email: "lucia@lingoweb.com", contraseña: "demo123", fechaAlta: "2026-04-02", xp: 640, xpSemanal: 240, racha: 3, metaDiaria: 50, liga: "Bronce", idiomaInterfaz: "es", progreso: {} },
  { id: "u-martin", nombre: "Martín López", usuario: "martin", email: "martin@lingoweb.com", contraseña: "demo123", fechaAlta: "2026-05-15", xp: 310, xpSemanal: 95, racha: 1, metaDiaria: 50, liga: "Bronce", idiomaInterfaz: "es", progreso: {} },
  { id: "u-sofia", nombre: "Sofía Gómez", usuario: "sofia", email: "sofia@lingoweb.com", contraseña: "demo123", fechaAlta: "2026-07-20", xp: 480, xpSemanal: 150, racha: 2, metaDiaria: 50, liga: "Bronce", idiomaInterfaz: "es", progreso: {} },
];

// Opiniones de demostración: así la sección de opiniones del mapa del curso no arranca vacía.
// Cada opinión queda asociada a un curso (cursoId) y a quien la publicó (usuarioId).
// Se cargan la primera vez que se abre el sitio, igual que las cuentas (ver datos/almacenamiento.js).
export const OPINIONES_DEMO = [
  { id: "o-1", cursoId: "ingles", usuarioId: "u-pedro", estrellas: 5, comentario: "Muy claro y entretenido, ideal para empezar.", fecha: "15/03/2026" },
  { id: "o-2", cursoId: "ingles", usuarioId: "u-ana", estrellas: 4, comentario: "Me sirvió mucho para los saludos. Ojalá sumen más unidades.", fecha: "05/07/2026" },
  { id: "o-3", cursoId: "aleman", usuarioId: "u-ana", estrellas: 5, comentario: "Las frases de ejemplo ayudan a practicar la pronunciación.", fecha: "07/08/2026" }
];
