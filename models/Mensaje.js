import mongoose from "mongoose"

const mensajeSchema = mongoose.Schema({
    mensaje:{
        type: String,
        trim: true,
    },
    enviadopor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }
},{timestamps:true})


const Mensaje = mongoose.model("Mensaje",mensajeSchema)
export default Mensaje

