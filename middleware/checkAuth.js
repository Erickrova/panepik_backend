import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"


const checkAuth = async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = await jwt.verify(token,process.env.JWT_SECRET)
            req.usuario = await Usuario.findById(decoded.id).select("-password -token -createdAt -updatedAt -__v -publicaciones -seguidores -seguidos")
            return next()

        } catch (error) {
            return res.status(404).json({msg:"Hubo un error"})
        }

    }
    if(!token){
        const error = new Error("Token no valido")
        return res.status(404).json({msg:error.message})
    }

}

export default checkAuth