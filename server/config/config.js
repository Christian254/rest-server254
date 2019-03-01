//puerto
process.env.PORT = process.env.PORT || 3000;


//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//Vencimiento del Token
//60 s * 60m * 24 h * 30d
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED de autenticacion
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


// Base de Datos
let urlDB
if(process.env.NODE_ENV === 'dev')
{
    urlDB = 'mongodb://localhost:27017/cafe'
}
else{
urlDB = process.env.mongoURI
}

process.env.urlDB = urlDB

//Google Client 
process.env.CLIENT_ID = process.env.CLIENT_ID || '492963866156-5ddi1bmu7jv47t8221si0j390m2m09gu.apps.googleusercontent.com'