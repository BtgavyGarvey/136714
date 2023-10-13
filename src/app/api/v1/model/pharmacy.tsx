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
    password:{
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
})

pharmacySchema.index({id:1,pharmacy:1,email:1,code:1})


pharmacySchema.pre('save', async function(next){

    if(!this.isModified('password')){
        return next()
    }

    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(this.password,salt)
    this.password=hashedPassword

    next()

})

const Pharmacy=models.Pharmacy || model("Pharmacy",pharmacySchema)
export default Pharmacy