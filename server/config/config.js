//puerto
process.env.PORT = process.env.PORT || 3000;


//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// Base de Datos
let urlDB
// if(process.env.NODE_ENV === 'dev')
// {
//     urlDB = 'mongodb://localhost:27017/cafe'
// }
// else{
urlDB = 'mongodb+srv://chris:holahola14@cluster0-eoksm.mongodb.net/test?retryWrites=true'
// }

process.env.urlDB = urlDB
