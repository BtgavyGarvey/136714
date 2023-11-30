import mongoose, { Schema, model, models } from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema=new Schema({

    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    pharmacy:{
        type:mongoose.Schema.Types.ObjectId,
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
},{timestamps:true})

userSchema.index({id:1,pharmacy:1,email:1,username:1})

userSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        return next()
    }

    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(this.password,salt)
    this.password=hashedPassword

    next()

})

const User=models.User || model("User",userSchema)
export default User