const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const app = express();
dotenv.config();

const KEY = process.env.KEY;
const ACCESS_PAGE_URL = process.env.ACCESS_PAGE_URL || '/hidden';

// Middleware para parsear application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

// Variable de estado para verificar el estado de inicio de sesión
let isLoggedIn = false;

// Middleware para proteger la página de acceso permitido
const checkAuth = (req, res, next) => {
  if (isLoggedIn) {
    next(); // Permite el acceso si el usuario está autenticado
  } else {
    res.redirect('/'); // Redirige a la página inicial si no está autenticado
  }
};

// Ruta para la página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta para procesar el formulario de clave
app.post('/login', (req, res) => {
  const claveIngresada = req.body.clave;

  if (claveIngresada === KEY) {
    isLoggedIn = true;
    res.redirect('/hidden'); // Redirigir a la página de acceso permitido
  } else {
    res.send('Invalid key. <a href="/">Back</a>'); // Mostrar mensaje de clave incorrecta
  }
});

// Ruta para la página de acceso permitido
app.get('/hidden', checkAuth, (req, res) => {
  res.send(`
    <p>User logged in successfully.</p>
    <form action="/logout" method="POST">
      <button type="submit">Log out</button>
    </form>
  `);
});

// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
  isLoggedIn = false;
  res.redirect('/'); // Redirigir a la página inicial después de cerrar sesión
});

// Middleware para redirigir al usuario si intenta acceder directamente a la página de acceso permitido
app.get('/hidden.html', (req, res) => {
  res.redirect('/'); // Redirigir de vuelta a la página inicial
});

// Puerto en el que va a correr el servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});