import express from "express"
import checkAuth from "../middleware/checkAuth.js"
import {
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
} from "../controller/usuarioController.js"


const router = express.Router()

router.post("/registrar",registrar)
router.post("/login",login)
router.get("/buscar-usuario/:nombre",buscarUsuario)

router.get("/perfil",checkAuth,perfil)
router.put("/actualizar-perfil",checkAuth,actualizarPerfil)
router.get("/obtener-perfil/:id/:codigo",checkAuth,obtenerPerfil)
router.get("/buscar-perfil/:nombre/:codigo",buscarPerfil)

router.get("/seguir-usuario/:id",checkAuth,seguirUsuario)
router.get("/dejar-de-seguir-usuario/:id",checkAuth,dejarDeSeguirUsuario)

export default router

