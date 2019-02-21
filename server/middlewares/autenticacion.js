var jwt = require('jsonwebtoken');

//==========
//Verificar token
//==========

let verificarToken = (req,res,next) =>{    
    let token = req.get('token')
    
    jwt.verify(token,process.env.SEED,(err,decoded) => {
        if(err){
            return res.status(401).json({
                ok:false,
                err
            })
        }
        
        req.usuario = decoded.usuario
        next()
    })
}
//==========
//Verificar ADMIN_ROLE
//==========

let verificarAdmin_Role = (req,res,next)=>{
    console.log(req.usuario);
    let usuario = req.usuario
    if(usuario.role === 'ADMIN_ROLE'){
        next()
    }
    else{
        return res.json({
            ok: false,
            message:'No es admin'
        })
    }
}



module.exports = {verificarToken,verificarAdmin_Role}