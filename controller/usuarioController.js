import Usuario from "../models/Usuario.js"
import generarToken from "../helpers/generarToken.js"
import generarJWT from "../helpers/generarJWT.js"
/*
    ? REGISTRO Y LOGIN DEL USUARIO
 */
const registrar = async (req,res) => {
    const { email,codigo } = req.body
    const usuario = await Usuario.findOne({email})
    if(usuario){
        const error = new Error("Este usuario ya existe")
        return res.status(400).json({msg:error.message})
    }
    const usuariosConElCodigo = await Usuario.find({codigo})
    if(usuariosConElCodigo.some(user => user.nombre === req.body.nombre)){
        const error = new Error("Ya existe un usuario con ese codigo")
        return res.status(400).json({msg:error.message})
    }
    try {
        const nuevoUsuario = await Usuario.create(req.body)
        nuevoUsuario.nombre = nuevoUsuario.nombre.toLowerCase()
        nuevoUsuario.token = generarToken()
        await nuevoUsuario.save()
        res.json({msg:"Usuario Registrado Correctamente, ya puedes iniciar sesion"})
    } catch (error) {
        console.log(error)
    }
}

const login = async (req,res) => {
    const {email,password} = req.body
    try {
        const usuario = await Usuario.findOne({email})
    
        if(!usuario){
            const error = new Error("Este usuario no existe")
            return res.status(404).json({msg:error.message})
        }
        if(await usuario.comprobarPassword(password)){
            return res.json({
                _id:usuario._id,
                nombre:usuario.nombre,
                email:usuario.email,
                codigo: usuario.codigo,
                token: generarJWT(usuario._id)
            })
        }else{
            const error = new Error("Contraseña incorrecta")
            return res.status(401).json({msg:error.message})
        }
    } catch (error) {
            
    }
}
/*
    ? CAMBIO DE PASSWORD DEL USUARIO
 */
const olvidePassword = async (req,res) => {}
const confirmarTokenPassword = async (req,res) => {}
const cambiarPassword = async (req,res) => {}

/*
? PERFIL DEL USUARIO
*/
const perfil = async (req,res) => {
    const {usuario} = req
    return res.json(usuario)
    
}
const obtenerPerfil = async (req,res) => {
    const {id,codigo} = req.params
    const usuario = await Usuario.findOne({_id:id,codigo}).select("-password -token -__v ")
    .populate("publicaciones")
    .populate("seguidores")
    .populate("seguidos")
    if(!usuario){
        const error = new Error("Perfil no encontrado")
        return res.json({msg:error.message})
    }
    return res.json(usuario)
    
}
/*
? SEGUIR O DEJAR DE SEGUIR UN USUARIO
*/
const actualizarPerfil = async (req,res) => {
    const {nombre,email,codigo,genero,cuenta} = req.body
    const usuarios = await Usuario.find()
    const usuario = await Usuario.findById(req.usuario._id)
    if(!usuario){
        const error = new Error("Accion no valida")
        return res.status(404).json({msg:error.message})
    }
    if(usuarios.some(usuario => usuario.codigo === codigo && usuario.nombre === nombre)){
        const error = new Error("2 usuarios no pueden tener el mismo nombre y codigo")
        return res.status(404).json({msg:error.message})
    }
    try {
        usuario.nombre = nombre.toLowerCase() || usuario.nombre
        usuario.email = email || usuario.email
        usuario.genero = genero || usuario.genero
        usuario.cuenta = cuenta || usuario.cuenta
        usuario.codigo = codigo || usuario.codigo
        await usuario.save()
        return res.json({msg:"Perfil actualizado correctamente"})
    } catch (error) {
        console.log(error)
    }
    


}
/*
? BÚSQUEDA DE UN USUARIO
*/
const buscarUsuario = async (req,res) => {
    const {nombre} = req.params
    try {
        const usuarios = await Usuario.find({nombre})
        if(usuarios?.length > 0){
            res.json(usuarios)
        }else{
            return res.json({msg:"No se han encontrado usuarios con ese nombre"})
        }
    } catch (error) {
        console.log(error)
    }
    
}
const buscarPerfil = async (req,res) =>{
    const {nombre,codigo} = req.params
    try {
        const usuario = await Usuario.findOne({nombre,codigo}).select("-password -token -__v ")
        .populate("publicaciones")
        .populate("seguidores")
        .populate("seguidos")
        if(usuario){
            res.json(usuario)
        }else{
            return res.json({msg:"No se han encontrado usuarios con ese nombre y codigo"})
        }
    } catch (error) {
        console.log(error)
    }
}
/*
? SEGUIR O DEJAR DE SEGUIR UN USUARIO
*/
const seguirUsuario = async (req,res) =>{
    const {id} = req.params
    const usuario = await Usuario.findById(id).select("seguidores").populate("seguidores")
    const usuarioAuth = await Usuario.findById(req.usuario._id).select("seguidos").populate("seguidos")
    if(!usuario){
        const error = new Error("Usuario no encontrado")
        return res.status(404).json({msg:error.message})
    }
    if(usuario._id.toString() === req.usuario._id.toString()){
        const error = new Error("No te puedes seguir a ti mismo")
        return res.status(400).json({msg:error.message})
    }
    if(usuario.seguidores.some(seguidor => seguidor._id.toString() === req.usuario._id.toString())){
        const error = new Error("Ya eres seguidor")
        return res.status(400).json({msg:error.message})
    }else{
        try {
            usuario.seguidores.push(usuarioAuth._id)
            usuarioAuth.seguidos.push(usuario._id)
            await Promise.all([await usuario.save(),await usuarioAuth.save()])
            return res.json({msg:"Haz empezado a seguir este perfil"})
        } catch (error) {
            console.log(error)
        }
    }
}
const dejarDeSeguirUsuario = async (req,res) =>{
    const {id} = req.params
    const usuario = await Usuario.findById(id).select("seguidores").populate("seguidores")
    const usuarioAuth = await Usuario.findById(req.usuario._id).select("seguidos").populate("seguidos")
    if(!usuario){
        const error = new Error("Usuario no encontrado")
        return res.status(404).json({msg:error.message})
    }
    if(usuario._id.toString() === req.usuario._id.toString()){
        const error = new Error("No te puedes dejar de seguir a ti mismo")
        return res.status(400).json({msg:error.message})
    }
    if(usuario.seguidores.some(seguidor => seguidor._id.toString() === req.usuario._id.toString())){     
        try {
            usuario.seguidores.pull(usuarioAuth._id)
            usuarioAuth.seguidos.pull(usuario._id)
            await Promise.all([await usuario.save(),await usuarioAuth.save()])
            return res.json({msg:"Haz dejado de seguir este perfil"})
        } catch (error) {
            console.log(error)
        }
    }else{
        return res.status(400).json({msg:"no se pudo realizar esta accion"})
    }
}



export{
    registrar,
    login,
    olvidePassword,
    confirmarTokenPassword,
    cambiarPassword,
    perfil,
    obtenerPerfil,
    buscarUsuario,
    buscarPerfil,
    seguirUsuario,
    dejarDeSeguirUsuario,
    actualizarPerfil
}