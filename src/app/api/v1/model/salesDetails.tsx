import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const salesDetailsSchema=new Schema({

    pharmacy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    salesDetails:{
        type:Array,
        required:true,
    },
    
},{
    timestamps:true
})

salesDetailsSchema.index({salesDetails:1,pharmacy:1})


const SaleDetails=models.SaleDetails || model("SaleDetails",salesDetailsSchema)
export default SaleDetails
