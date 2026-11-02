# LingoWeb

Trabajo práctico de HTML y CSS: plataforma de aprendizaje de idiomas.
TP1: maquetado con HTML y CSS. TP2: interactividad y persistencia con JavaScript.

## Tecnologías

- HTML5
- CSS3
- JavaScript con módulos ES (`import`/`export`), sin librerías
- localStorage para conservar cuentas, progreso y sesión

## Vistas con JavaScript

- [x] Vista 1: inicio de sesión, registro y recuperación de acceso
- [x] Vista 2: dashboard de cursos y resumen de actividad
- [x] Vista 3: mapa del curso, unidades, lecciones y opiniones
- [x] Vista 4: lección interactiva y resultados
- [ ] Vista 5: perfil, preferencias y cierre de sesión
- [ ] Vista 6: tabla de clasificación
- [ ] Vista 7: rachas, tienda y opiniones

## Estructura del JavaScript (TP2)

El código está separado en tres capas. Cada capa solo importa de la anterior:

```
js/
├── datos/              ← QUÉ información existe y DÓNDE se guarda
│   ├── usuarios.js         forma de una cuenta (crearUsuario), cuentas y opiniones de demostración
│   ├── almacenamiento.js   único archivo que usa localStorage (usuarios, sesión y opiniones)
│   ├── catalogo.js         los 3 cursos con sus unidades y lecciones; buscarCurso(id)
│   └── lecciones.js        los ejercicios de cada lección, por curso; buscarEjercicios(curso, leccion)
├── logica/             ← REGLAS: valida, calcula y decide; nunca toca la pantalla
│   ├── validaciones.js     revisa los datos de los formularios
│   ├── autenticacion.js    iniciar sesión, registrarse, recuperar acceso, cerrar sesión, cuenta activa
│   ├── progreso.js         porcentaje de avance, lección actual, estado de cada lección y guardar una lección terminada
│   ├── leccion.js          reglas de la lección: vidas, comprobar una respuesta y XP ganada
│   └── opiniones.js        opiniones de un curso, promedio y publicar una nueva
└── presentacion/       ← PANTALLA: lee lo que escribe la persona y arma lo que se ve
    ├── ui.js               mostrar mensajes y marcar campos con error
    ├── navegacion.js       páginas públicas/privadas y enlace "Salir"
    ├── login.js            controlador de login.html
    ├── registro.js         controlador de registro.html
    ├── recuperar.js        controlador de recuperar.html
    ├── dashboard.js        controlador de dashboard.html: saludo, tarjetas de cursos, resumen y estado inicial
    ├── curso.js            controlador de curso.html: mapa de unidades y lecciones, y opiniones
    └── leccion.js          controlador de leccion.html: ejercicios, vidas, resultado y resumen final
```

Cada HTML carga un único `<script type="module">` (el controlador de la vista);
ese módulo importa lo que necesita de las otras capas. Detalle de los cambios: ver `CAMBIOS.md`.

### Cómo se conectan las capas

**Formularios (vista 1):** presentación lee los campos → lógica valida y decide →
datos guarda o lee → la lógica devuelve `{ ok, campo, mensaje }` → presentación muestra el resultado.

**Dashboard (vista 2):** `navegacion.js` devuelve la cuenta activa → `dashboard.js` recorre
`catalogo.js` y, por cada curso, le pide a `progreso.js` el porcentaje de esa cuenta → arma la tarjeta
y la agrega al contenedor vacío `#lista-cursos` del HTML. El resumen (racha, XP, liga y meta diaria)
se completa con los datos de la misma cuenta.

**Mapa del curso (vista 3):** una sola página, `curso.html`, sirve para los tres cursos.
El curso se elige con la dirección (`curso.html?curso=ingles`), así se mantiene al recargar o usar atrás/adelante.
`curso.js` busca el curso en `catalogo.js`, le pide a `progreso.js` el estado de cada lección
(completada, en curso o bloqueada) y a `opiniones.js` las opiniones del curso.
Cada lección tiene un id en la página (`#leccion-l2`) para poder volver a esa posición del mapa.

**Lección (vista 4):** una sola página, `leccion.html`, sirve para todas las lecciones de los tres cursos
(`leccion.html?curso=ingles&leccion=l3`). `leccion.js` busca los ejercicios en `lecciones.js`, le pide a
`logica/leccion.js` que compruebe cada respuesta y, al terminar, calcula la experiencia
(50 XP sin errores, 40 con 1 error, 30 con 2) y la guarda con `registrarLeccionCompletada` (`progreso.js`).
Eso actualiza el mapa del curso, el dashboard, el perfil y el ranking, que leen la misma cuenta.
Si se repite una lección ya completada, se mantiene el resultado anterior y no se suma XP.

### Datos guardados en localStorage

- `lingoweb_usuarios`: arreglo con todas las cuentas (si no existe, se cargan las de demostración).
  Cada cuenta guarda su avance en `progreso`: por curso, el resultado de cada lección terminada.
  Ejemplo: `{ ingles: { l1: { xp: 40, errores: 1, fecha: "12/03/2026" } } }`.
- `lingoweb_sesion`: solo el `id` de la cuenta activa. Cerrar sesión borra esta clave; las cuentas y su progreso se conservan.
- `lingoweb_opiniones`: opiniones de todos los cursos. Cada una guarda `cursoId`, `usuarioId`, estrellas, comentario y fecha.

## Integrantes

- Acevedo, Araceli
- Lavin, Felipe
- Herrera, Christian
- Mereles, Abel

## Estado

Proyecto en etapa inicial.

## Trabajo colaborativo

La rama main contiene la versión estable.
Cada tarea se desarrolla en una rama y se integra mediante un pull request.
