import mongoose from "mongoose";

const whatsappSchema= new mongoose.Schema({
    message: String,
    name: String,
    timestamp: {
        type: String,
        default: new Date().toUTCString()
    },
    received: Boolean
})

export default mongoose.model('messages', whatsappSchema)
