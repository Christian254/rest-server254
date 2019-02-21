const express = require('express')
const app = express()
app.use(require('./usuario')); // llamando las rutas del usuario
app.use(require('./login'));
module.exports = app;