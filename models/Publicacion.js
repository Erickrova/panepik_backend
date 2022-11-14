import mongoose from "mongoose";

const publicacionSchema = mongoose.Schema({
    titulo:{
        type: String,
        required: true,
        trim: true
    },
    descripcion:{
        type: String
    },
    destellos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }],
    media:{
        type: String,
        trim: true
    },
    creador:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
   
},{ timestamps: true})

const Publicacion = mongoose.model("Publicacion",publicacionSchema)
export default Publicacion