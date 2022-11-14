import express from "express"
import {crearPublicacion,eliminarPublicacion,obtenerPublicaciones,destello} from "../controller/publicacionController.js"
import checkAuth from "../middleware/checkAuth.js"

const router = express.Router()

router.post("/crear-publicacion",checkAuth,crearPublicacion)
router.delete("/eliminar-publicacion/:id",checkAuth,eliminarPublicacion)
router.get("/obtener-publicaciones",checkAuth,obtenerPublicaciones)
router.get("/destello/:id",checkAuth,destello)



export default router
