import mongoose from "mongoose";
import bcrypt from "bcrypt"

const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    codigo:{
        type: String,
        required: true,
        trim: true
    },
    seguidores:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }],
    seguidos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }],
    publicaciones:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publicacion"
    }],
    cuenta:{
        type:String,
        enum:["Privada","Publica"],
        default: "Publica"
    },
    genero:{
        type:String,
        enum:["Masculino","Femenino","Otro"]
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    token:{
        type: String
    },

},{ timestamps: true})

usuarioSchema.pre("save",async function (next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
})

usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario,this.password)
}

const Usuario = mongoose.model("Usuario",usuarioSchema)
export default Usuario