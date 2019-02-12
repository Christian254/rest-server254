require('./config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//rutas
app.use(require('./routes/usuario'));

mongoose.connect(process.env.urlDB, (err, res)=>{
  if(err) throw err;
  console.log('Base de Datos online');
});

app.listen(process.env.PORT, () =>{
  console.log(`Ejecutandose en el puerto ${process.env.PORT}`);
})