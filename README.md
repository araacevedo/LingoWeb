# LingoWeb

Trabajo práctico de HTML y CSS: plataforma de aprendizaje de idiomas.
TP1: maquetado con HTML y CSS. TP2: interactividad y persistencia con JavaScript.

## Tecnologías

- HTML5
- CSS3
- JavaScript con módulos ES (`import`/`export`), sin librerías
- localStorage para conservar cuentas, progreso y sesión

## Estructura del JavaScript (TP2)

El código está separado en tres capas. Cada capa solo importa de la anterior:

```
js/
├── datos/              ← QUÉ información existe y DÓNDE se guarda
│   ├── usuarios.js         forma de una cuenta (crearUsuario) y cuentas de demostración con su progreso
│   ├── almacenamiento.js   único archivo que usa localStorage (usuarios y sesión)
│   └── cursos.js           los 3 cursos: bandera, nivel, página del mapa y cantidad de lecciones
├── logica/             ← REGLAS: valida, calcula y decide; nunca toca la pantalla
│   ├── validaciones.js     revisa los datos de los formularios
│   ├── autenticacion.js    iniciar sesión, registrarse, recuperar acceso, cerrar sesión, cuenta activa
│   └── progreso.js         porcentaje de avance de cada curso y si la cuenta ya tiene actividad
└── presentacion/       ← PANTALLA: lee lo que escribe la persona y arma lo que se ve
    ├── ui.js               mostrar mensajes y marcar campos con error
    ├── navegacion.js       el "portero": páginas públicas/privadas y enlace "Salir"
    ├── login.js            controlador de login.html
    ├── registro.js         controlador de registro.html
    ├── recuperar.js        controlador de recuperar.html
    └── dashboard.js        controlador de dashboard.html: saludo, tarjetas de cursos, resumen y estado inicial
```

Cada HTML carga un único `<script type="module">` (el controlador de la vista);
ese módulo importa lo que necesita de las otras capas. Detalle de los cambios: ver `CAMBIOS.md`.

### Cómo se conectan las capas

**Formularios (vista 1):** presentación lee los campos → lógica valida y decide →
datos guarda o lee → la lógica devuelve `{ ok, campo, mensaje }` → presentación muestra el resultado.

**Dashboard (vista 2):** `navegacion.js` devuelve la cuenta activa → `dashboard.js` recorre
`cursos.js` y, por cada curso, le pide a `progreso.js` el porcentaje de esa cuenta → arma la tarjeta
y la agrega al contenedor vacío `#lista-cursos` del HTML. El resumen (racha, XP, liga y meta diaria)
se completa con los datos de la misma cuenta.

### Datos guardados en localStorage

- `lingoweb_usuarios`: arreglo con todas las cuentas (si no existe, se cargan las de demostración).
  Cada cuenta guarda su avance en `progreso`, con las lecciones terminadas por curso.
  Ejemplo: `{ ingles: ["l1", "l2"], aleman: ["l1"] }`.
- `lingoweb_sesion`: solo el `id` de la cuenta activa. Cerrar sesión borra esta clave; las cuentas y su progreso se conservan.

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
