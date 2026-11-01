# LingoWeb

Trabajo práctico de HTML y CSS: plataforma de aprendizaje de idiomas.
TP1: maquetado con HTML y CSS. TP2: interactividad y persistencia con JavaScript.

## Tecnologías

- HTML5
- CSS3
- JavaScript con módulos ES (`import`/`export`), sin librerías
- localStorage para conservar cuentas, progreso y sesión

## Cuentas de demostración

| Usuario | Contraseña |
|---------|------------|
| pedro   | demo123    |
| ana     | demo123    |

## Estructura del JavaScript (TP2)

El código está separado en tres capas. Cada capa solo importa de la anterior:

```
js/
├── datos/            ← QUÉ información existe y DÓNDE se guarda
│   ├── usuarios.js       forma de una cuenta (crearUsuario) y cuentas demo
│   ├── almacenamiento.js único archivo que usa localStorage (usuarios y sesión)
│   └── cursos.js         catálogo de cursos
├── logica/           ← REGLAS: valida y decide, nunca toca el DOM
│   ├── validaciones.js   funciones puras de validación de formularios
│   └── autenticacion.js  iniciar sesión, registrarse, recuperar, cerrar sesión
└── presentacion/     ← PANTALLA: lee formularios y muestra resultados
    ├── ui.js             mostrar mensajes y marcar campos con error
    ├── navegacion.js     páginas públicas/privadas y enlace "Salir"
    ├── login.js          controlador de login.html
    ├── registro.js       controlador de registro.html
    ├── recuperar.js      controlador de recuperar.html
    └── dashboard.js      controlador de dashboard.html
```

Flujo de un formulario: **presentación** lee los campos → **lógica** valida y decide →
**datos** guarda/lee → la lógica devuelve `{ ok, campo, mensaje }` → **presentación** muestra el resultado.

Cada HTML carga un único `<script type="module">` (el controlador de la vista);
ese módulo importa lo que necesita de las otras capas. Detalle de los cambios: ver `CAMBIOS.md`.

### Datos guardados en localStorage

- `lingoweb_usuarios`: array con todas las cuentas (si no existe, se cargan las de demostración).
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
