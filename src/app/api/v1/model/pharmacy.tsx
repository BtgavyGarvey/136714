import mongoose, { Schema, model, models } from 'mongoose'
import bcrypt from 'bcryptjs'

const pharmacySchema=new Schema({

    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    pharmacy:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ],
    },
    mobile:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        default:false,
        required:true,
    },
    __v:{
        type: Number,
        default:0,
    }
},{timestamps:true})

pharmacySchema.index({id:1,pharmacy:1,email:1,code:1})


const Pharmacy=models.Pharmacy || model("Pharmacy",pharmacySchema)
export default Pharmacy