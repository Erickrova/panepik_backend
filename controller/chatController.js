import Chat from "../models/Chat.js"
import Mensaje from "../models/Mensaje.js"
import Usuario from "../models/Usuario.js" 

const crearChat = async (req,res) =>{
    const {idu,ida} = req.params
    const usuario = await Usuario.findById(idu).select("nombre").populate("seguidos","nombre").populate("seguidores","nombre")
    const chats = await Chat.find().populate("participantes","nombre codigo")
    if(!usuario){
        const error = new Error("accion no valida")
        return res.status(403).json({msg:error.message})
    }
    if(chats.some(chat => chat?.participantes.some(participante => participante?._id.toString() === idu) && chat?.participantes.some(participante => participante?._id.toString() === ida) )){
        const chat = chats.filter(chat => chat?.participantes.some(participante => participante?._id.toString() === idu) && chat?.participantes.some(participante => participante?._id.toString() === ida) )
        return res.json(chat)
    }
    if(usuario?.seguidores?.some(seguidor => seguidor?._id.toString() === ida) && usuario?.seguidos?.some(seguidor => seguidor?._id.toString() === ida)){
        try {
            const chatCreado = await Chat.create({})
            chatCreado?.participantes.push(usuario?._id)
            chatCreado?.participantes.push(ida)
            await chatCreado.save()
            const chats2 = await Chat.find().populate("participantes","nombre codigo")
            const chat = chats2.filter(chat => chat?.participantes.some(participante => participante?._id.toString() === idu) && chat?.participantes.some(participante => participante?._id.toString() === ida) )
            return res.json(chat)

        } catch (error) {
            console.log(error)
        }
    
    }else{
        const error = new Error("No puedes iniciar un chat con este usuario porque no son amigos")
        return res.status(403).json({msg:error.message})
    }
}
const enviarMensaje = async (req,res) =>{
    const {id} = req.params
    const {mensaje} = req.body
    const chat = await Chat.findById(id)
    if(!mensaje){
        return res.json({})
    }
    if(mensaje?.length){
        try {
            const mensajeAlmacenado = await Mensaje.create({})
            mensajeAlmacenado.mensaje = mensaje
            mensajeAlmacenado.enviadopor = req.usuario._id
            await mensajeAlmacenado.save()
            chat.mensajes.push(mensajeAlmacenado?._id)
            await chat.save()
            const mensajeEntregar = await Mensaje.findById(mensajeAlmacenado._id).populate("enviadopor","nombre codigo")
            return res.json(mensajeEntregar)
        } catch (error) {
            console.log(error)
        }
    }

}
const obtenerChats = async (req,res) =>{
    const chats = await Chat.find().populate("participantes","nombre codigo")
    if(chats.some(chat => chat.participantes.some(participante => participante._id.toString() === req.usuario._id.toString()))){
        const chat = chats.filter(chat => chat.participantes.some(participante => participante._id.toString() === req.usuario._id.toString()))
        return res.json(chat)
    }
}
const obtenerMensajes = async (req,res)=>{
    try{
        const {id} = req.params
        const chat = await Chat.findById(id).populate({path:"mensajes",populate : {path:"enviadopor",select:"nombre codigo"}})
        return res.json(chat.mensajes)
    }catch(error){
        console.log(error)
    }
}

export{
    crearChat,
    enviarMensaje,
    obtenerChats,
    obtenerMensajes
}