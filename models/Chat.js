import mongoose from "mongoose"

const chatSchema = mongoose.Schema({
    participantes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario" 
        }
    ],
    mensajes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mensaje" 
        }
    ]

},{timestamps:true})


const Chat = mongoose.model("Chat",chatSchema)
export default Chat

