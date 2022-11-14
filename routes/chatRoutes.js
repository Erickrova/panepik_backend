import express from "express"
import {crearChat,enviarMensaje,obtenerChats,obtenerMensajes} from "../controller/chatController.js"
import checkAuth from "../middleware/checkAuth.js"

const router = express.Router()

router.get("/:idu/:ida",checkAuth,crearChat)
router.get("/obtener-chats",checkAuth,obtenerChats)
router.get("/obtener/mensajes/:id",checkAuth,obtenerMensajes)
router.post("/:id",checkAuth,enviarMensaje)

export default router

