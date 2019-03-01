require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

// Cors para permitir consumir en el frontend
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

//rutas
app.use(require('./routes/index')); // llamando las rutas

mongoose.connect(process.env.urlDB, (err, res) => {
    if (err) 
        throw err;
    console.log('Base de Datos online');
});

app.listen(process.env.PORT, () => {
    console.log(`Ejecutandose en el puerto ${process.env.PORT}`);
})