import Publicacion from "../models/Publicacion.js";
import Usuario from "../models/Usuario.js";

const crearPublicacion = async (req,res)=>{
    
    const usuario = await Usuario.findById(req.usuario._id)
    if(!usuario || !req.usuario ){
        const error = new Error("Acción invalida")
        return res.status(403).json({msg:error.message})
    }
    try {
        const publicacion = await Publicacion.create(req.body)
        publicacion.creador = usuario._id
        publicacion.createdAt = Date.now()
        usuario.publicaciones.push(publicacion._id)
        await Promise.all([
            await publicacion.save(),
            await usuario.save()
        ])
        return res.json(publicacion)

    } catch (error) {
        console.log(error)
        return res.status(400).json("Ocurrió un error Creando la publicación")
    }

}
const eliminarPublicacion = async (req,res) =>{
    const {id} = req.params
    const publicacion = await Publicacion.findById(id)
    if(!publicacion){
        const error = new Error("Acción invalida, es posible que ya haya eliminado esta publicación")
        return res.status(403).json({msg:error.message})
    }
    if(publicacion?.creador.toString() !== req?.usuario._id.toString()){
        const error = new Error("Acción invalida")
        return res.status(403).json({msg:error.message})
    }
    const usuario = await Usuario.findById(req.usuario._id).select("-password -token -__v ")
    try {
        usuario.publicaciones.pull(publicacion)
        await Promise.all([
            await usuario.save(),
            await publicacion.deleteOne()
        ])
        return res.json({id:publicacion._id})
    } catch (error) {
        console.log(error.response.data.msg)
    }
}
const obtenerPublicaciones = async (req,res) =>{
    const publicaciones = await Publicacion.find().select("-__v")
    .populate("creador","cuenta seguidores nombre codigo")
    const usuario = await Usuario.findById(req?.usuario?._id).select("-password -token -__v ")
    .populate("publicaciones")
    .populate("seguidores")
    .populate("seguidos")
    const amigopublicacion = publicaciones.map(publicacion => {
        if(!publicacion?.creador?.seguidores.includes(usuario?._id) || publicacion?.creador?.cuenta !== "Publica"){
           return false
           
        }else{
            return publicacion
        }
    })
    const publicacionesfinal = amigopublicacion.filter(Boolean)
    return res.json(publicacionesfinal)
}
const destello = async (req,res) =>{
    const {id} = req.params
    const publicacion = await Publicacion.findById(id)
    const usuario = await Usuario.findById(req.usuario._id).select("_id")
    if(!usuario || !publicacion){
        const error = new Error("Accion no valida, es posible que ya no este disponible esta publicación")
        return res.status(403).json({msg:error.message})
    }
    if(publicacion.destellos.includes(usuario._id)){
        publicacion.destellos.pull(usuario._id)
        try {
            await publicacion.save()
            return res.json({msg:false,destellos:publicacion.destellos.length})
        } catch (error) {
            console.log(error)
        }
    }else{
        publicacion.destellos.push(usuario._id)
        try {
            await publicacion.save()
            return res.json({msg:true,destellos:publicacion.destellos.length})
        } catch (error) {
            console.log(error)
        }
    }
    
}


export{
    crearPublicacion,
    eliminarPublicacion,
    obtenerPublicaciones,
    destello
}