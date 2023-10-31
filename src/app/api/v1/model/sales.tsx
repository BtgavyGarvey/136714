import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const salesSchema=new Schema({

    pharmacy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    date:{
        type:String,
        required:true
        
    },
    hour:{
        type:String,
        required:true
        
    },
    details:{
        type:Array,
        required:true
    },
    
},{
    timestamps:true
})

salesSchema.index({pharmacy:1})


const NewSale=models.Sales || model("Sales",salesSchema)
export default NewSale
