import crypto from 'crypto'
import mongoose, { Schema, model, models } from 'mongoose'

const medicineSchema=new Schema({

    pharmacy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    batchNumber:{
        type:String,
        required:true,
    },
    medicineName:{
        type:String,
        required:true,
    },
    dosageForm:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,
    },
    costPerUnit:{
        type:Number,
        required:true,
    },
    medicineCategory:{
        type:String,
        required:true,
    },
    availableQuantity:{
        type:Number,
        required:true,
    },
    __v:{
        type: Number,
        default:0,
    }
},{
    timestamps:true
})

medicineSchema.index({batchNumber:1,pharmacy:1,medicineName:1})


const NewMedicine=models.Medicine || model("Medicine",medicineSchema)
export default NewMedicine
