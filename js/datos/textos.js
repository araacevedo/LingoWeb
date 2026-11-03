// =============================================================================
// textos.js  ·  CAPA DE DATOS
// Traducciones de los textos fijos de la interfaz (Vista 5: idioma de interfaz).
// El HTML ya está escrito en español, así que solo guardamos los textos en inglés.
//
// Cada entrada es:  "dónde está el texto en la página" : "texto traducido"
// El "dónde" es un selector de CSS, igual que los que usamos con querySelector.
// navegacion.js recorre esta lista y cambia cada texto si la persona eligió inglés.
// Si un selector no existe en la página actual, simplemente no se usa.
// =============================================================================

export const TEXTOS = {
  en: {
    // Menú de navegación (está en todas las páginas privadas)
    'nav a[href="dashboard.html"]': "Courses",
    'nav a[href="perfil.html"]': "Profile",
    'nav a[href="ranking.html"]': "Leaderboard",
    'nav a[href="tienda.html"]': "Streaks / Shop",
    "nav .enlace-salir": "Log out",

    // Dashboard
    ".titulo-seccion h1": "My Language Courses",
    ".estadisticas h2": "Statistics",

    // Mapa del curso
    ".cabecera-curso .volver": "← Back to courses",
    "#opiniones h2": "Course reviews",

    // Clasificación
    ".ranking-header h1": "🏆 Leaderboard",

    // Perfil
    ".ajustes h2": "Account settings",
    'label[for="nombre"]': "Full name",
    'label[for="usuario"]': "Username",
    'label[for="email"]': "Email",
    'label[for="password-actual"]': "Current password (required to save changes)",
    'label[for="password-nueva"]': "New password (optional)",
    'label[for="password-confirmacion"]': "Confirm new password",
    'label[for="idioma"]': "Interface language",
    '#form-perfil button[type="submit"]': "Save changes",
    ".acciones-perfil .enlace-salir": "Log out",
    ".logros h2": "My achievements",
    // nth-of-type(1) = el primer bloque de logros, (2) el segundo, y así
    ".logros .estadistica:nth-of-type(1) span": "⚡ Total XP",
    ".logros .estadistica:nth-of-type(2) span": "🔥 Current streak",
    ".logros .estadistica:nth-of-type(3) span": "🏆 League",
    ".logros .estadistica:nth-of-type(4) span": "📘 Lessons completed",
  },
};
