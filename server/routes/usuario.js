const express = require('express')
const app = express()
const _ = require('underscore')
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {
    let desde = Number.parseInt(req.query.desde) || 0
    let limite = Number.parseInt(req.query.limite) || 5
    Usuario.find({'estado':true},'nombre email estado google')
        .skip(desde)
        .limit(limite)
        .exec((err,usuarios) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Ocurrió un error :(',
                    err
                })
            };
            Usuario.count({'estado':true},(err,conteo)=>{
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })                
            })
    })
})
   
app.post('/usuario', function (req, res) {
    let body = _.pick(req.body, ['nombre','google','correo','role','img','estado','password']);  
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.correo,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });
    usuario.save((err,usuarioDB)=>{
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Ocurrió un error :(',
                err
            })
        };
        res.json({
            ok: true,
            usuario: usuarioDB
        })
        console.log(usuarioDB);
    })
})
  
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = req.body; 
    Usuario.findOneAndUpdate(id, body,{new:true, runValidators:true},(err,usuarioDB)=>{
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Ocurrió un error :(',
                err
            })
        };
        res.json({
            ok: true,
            usuario: usuarioDB
        });      
    });
  })
  
app.delete('/usuario/:id', function (req, res) {
   let id = req.params.id
   Usuario.findById(id, (err, usuario)=>{
    if(err) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Ocurrió un error :(',
            err
        })
    };
    usuario.estado = false;
    usuario.save((err,usuarioDB)=>{
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Ocurrió un error :(',
                err
            })
        };
        res.json({
            ok: true,
            usuarioDB
        })
    })
   })
})

  module.exports = app;