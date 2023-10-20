import { NextRequest, NextResponse } from "next/server";
import DbConnect, { MiddleWare, generateCode, generateId, newMedicineValidation, newPharmacyValidation, sanitizeMessage, sendEmail } from "../../utils";
import NewMedicine from "../../model/medicine";
import Pharmacy from "../../model/pharmacy";
import Token from "../../model/token";
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import Morgan from 'morgan'


// DB CONNECTION

DbConnect()

// HTTP REQUEST METHODS

export async function POST(request:NextRequest) {

    let responseData:any

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')
    const morgan=Morgan('dev')

    if (params==='newMedicine') {
      MiddleWare(request,NextResponse,morgan)
      responseData=await newMedicine(body)
    }
    // else if (params==='forgotpassword') {
    //   MiddleWare(request,NextResponse,morgan)
    //   responseData=await forgotPassword(body)
    // }
    // else if (params==='checkcode') {
    //   MiddleWare(request,NextResponse,morgan)
    //   responseData=await checkResetPasswordCode(body)
    // }
    return NextResponse.json(responseData)
    
}

export async function GET(request:NextRequest) {

    let responseData={
        message:'',
        success:false,
        drugs:null
    }

    const {searchParams}=new URL(request.url)
    const action=searchParams.get('action')
    const pharmacy=searchParams.get('pharmacy')
    const morgan=Morgan('dev')

    if (action==='getMedicineData') {
        
      MiddleWare(request,NextResponse,morgan)
      responseData=await getMedicineData(pharmacy)
    }
    return NextResponse.json(responseData)
    
}

export async function PATCH(request:NextRequest) {

    let responseData:any

    const {searchParams}=new URL(request.url)
    const action=searchParams.get('action')
    const token=searchParams.get('token')
    const morgan=Morgan('dev')

    if (action==='verifyemail') {
      
      MiddleWare(request,NextResponse,morgan)
        
    //   responseData=await verifyEmail(token)
    }
    return NextResponse.json(responseData)
    
}

export async function PUT(request:NextRequest) {

    let responseData:any

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='resetPassword') {
        
    //   responseData=await resetPassword(body)
    }
    return NextResponse.json(responseData)
    
}

export async function DELETE(request:NextRequest) {

    let responseData={
        message:'',
        success:false
    }

    // const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='newPharmacy') {
        
        // await newPharmacy(body)
    }
    return NextResponse.json(responseData)
    
}

//NEW MEDICINE

export const newMedicine=async(value:any)=>{

    let responseData={
        message:'',
        success:false
    }
  

    try {
        
        const validate=await newMedicineValidation(value)
      
        if (validate.error) {
            console.log(validate.error);
            responseData.message='Fill in all fields.'      
      
            return responseData
        }
      
        const body=validate.value
        
      
        const promises=[
          NewMedicine.findOne({batchNumber:body.batchNumber.toUpperCase()}),
        ]
      
        const promise=await Promise.allSettled(promises)
      
        const data=promise.filter((res)=> res.status==='fulfilled') as PromiseFulfilledResult<any>[]
      
        const batchNumberExist=data[0].value
    
        if (batchNumberExist) {
            responseData.message='Batch Number has already been registered'
            return responseData
        }

        console.log(body);
        
    
        const insertMedicine=await NewMedicine.create({
            pharmacy:body.pharmacy,
            medicineName:body.medicineName,
            costPerUnit:body.costPerUnit,
            dosageForm:body.dosageForm,
            batchNumber:body.batchNumber.toUpperCase(),
            expiresAt:body.expiresAt,
            medicineCategory:body.medicineCategory,
            availableQuantity:body.availableQuantity,
            __v:0,
        })
    
        if (!insertMedicine) {
            responseData.message='Invalid data'
            return responseData
        }
    
        responseData.success=true
    
        return responseData

    } catch (error) {
        
        console.log(error);
        responseData.message='Server error has ocurred.'      
    
        return responseData
    }


    
}

export const getMedicineData=async(value:any)=>{

    let responseData={
        message:'',
        success:false,
        drugs:[]
    }

    try {
        
        let drugs=await NewMedicine.find()

        if (drugs.length>0) {
            responseData.success=true
            responseData.drugs=drugs
        }
        else{
            responseData.message='No medicine data found'
        }

        return responseData

    } catch (error) {
        console.log(error);
        responseData.message='Server error has ocurred.'      
    
        return responseData
        
    }
}