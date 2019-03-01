const express = require('express')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

//Google 
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const cors = require('cors')
const app = express()

app.use(cors())
app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({
        email: body.email
    }, (err, usuarioDB) => {
        if (err) {
            return res
                .status(500)
                .json({ok: true, err, mensaje: 'Ocurrió un error :C'})
        }
        if (!usuarioDB) {
            return res
                .status(400)
                .json({
                    ok: true,
                    err: {
                        message: 'El (usuario) o contraseña es incorrecto'
                    }
                })
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res
                .status(400)
                .json({
                    ok: true,
                    err: {
                        message: 'El usuario o (contraseña) es incorrecto'
                    }
                })
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})

        res.json({ok: true, usuario: usuarioDB, token})

    })
})


//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre : payload.name,
        email : payload.email,
        img : payload.picture,
        google : true
    }
  }

app.post('/google', async(req, res) => {
    let token = req.body.idtoken
    let googleUser = await verify(token)
        .catch((e)=>{
            return res.status(403).json({
                ok: false,
                err: e
            })
        })
    Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{
        if (err) {
            return res
                .status(500)
                .json({ok: true, err, mensaje: 'Ocurrió un error :C'})
        }
        if(usuarioDB){
            if(usuarioDB ===false){
                if (err) {
                    return res
                        .status(400)
                        .json({ok: true, err, mensaje: 'Debe usar su autenticacion normal'})
                }
            }
            else{
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})
                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        }
        else{
            //Si el usuario no existe
            let usuario = new Usuario()
            usuario.nombre = googleUser.nombre
            usuario.email = googleUser.email
            usuario.password = ':)'
            usuario.google = true
            usuario.img = googleUser.img
            usuario.save((err,usuarioDB)=>{
                if (err) {
                    return res
                        .status(500)
                        .json({ok: true, err, mensaje: 'Ocurrió un error :C'})
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN})
                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    })    
    
})


module.exports = app;