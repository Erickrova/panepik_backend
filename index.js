import express from "express"
import {Server} from "socket.io"
import dotenv from "dotenv"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import publicacionRoutes from "./routes/publicacionRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import conectarDB from "./config/db.js"
import cors from "cors"

const app = express()
dotenv.config()
conectarDB()
app.use(express.json())
const whiteList = [process.env.FRONTEND_URL]
var corsOptions = {
    origin: function(origin,callback){
        if(whiteList.includes(origin)){
            callback(null,true)
        }else{
            callback(new Error("Error de cors"))
        }
    }

  }
app.use(cors(corsOptions))

const port = process.env.PORT || 4000




app.use("/api/usuarios",usuarioRoutes)
app.use("/api/publicaciones",publicacionRoutes)
app.use("/api/chat",chatRoutes)

const servidor = app.listen(port,()=>{
    console.log("server on port ",port,` http://localhost:${port}`)
})


/*
  ? SOCKET.IO
*/


const io = new Server(servidor,{
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
})

io.on("connection",socket =>{

    socket.on("abrir chat",data =>{
        socket.join(data)
        socket.emit("conectado a sala")
    })
    socket.on("dejar seguir",data =>{
        socket.emit("dejando seguir",data)
    })
    socket.on("seguir",data =>{
        socket.emit("siguiendo",data)
    })
    socket.on("on perfil",data =>{
        socket.join(data)
    })

    socket.on("enviar mensaje",data =>{
        socket.to(data.chat).emit("enviando mensaje",data.mensaje)
    })


})











