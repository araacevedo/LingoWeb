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
    racha: 5,                     
    metaDiaria: 50,               
    liga: "Bronce",               
    idiomaInterfaz: "es",         
    progreso: {                   // lecciones que ya terminó en cada curso (el dashboard calcula el porcentaje con esto)
      ingles: ["l1", "l2"],       // terminó 2 de las 3 lecciones de inglés
      aleman: ["l1"]              // terminó 1 lección de alemán; chino no aparece porque todavía no lo empezó
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
    racha: 9,                     
    metaDiaria: 80,               
    liga: "Plata",                // otra liga (permite probar el selector de la vista 6)
    idiomaInterfaz: "es",         
    progreso: {                   // lecciones que ya terminó en cada curso
      ingles: ["l1", "l2", "l3"], // terminó todo el curso de inglés
      aleman: ["l1", "l2"],       // terminó 2 lecciones de alemán
      chino: ["l1"]               // terminó 1 lección de chino
    }                  // progreso por curso, a definir en la vista 2/3
  }                               
];                                
