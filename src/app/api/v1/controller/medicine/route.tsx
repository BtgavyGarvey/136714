import { NextRequest, NextResponse } from "next/server";
import DbConnect, { MiddleWare, generateCode, generateId, newMedicineValidation, newPharmacyValidation, sanitizeMessage, sendEmail } from "../../utils";
import NewMedicine from "../../model/medicine";
import Sales from "../../model/sales";
import Token from "../../model/token";
import bcrypt from 'bcryptjs'
import Morgan from 'morgan'
import mongoose from "mongoose";
import Pharmacy from "../../model/pharmacy";
import { Today } from "../../../../../../components/sc/layout/topNav";


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
    else if (params==='newSale') {
      MiddleWare(request,NextResponse,morgan)
      responseData=await newSale(body)
    }
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
        drugs:[]
    }

    const {searchParams}=new URL(request.url)
    const action=searchParams.get('action')
    const id=searchParams.get('id')
    const morgan=Morgan('dev')

    if (action==='getMedicineData') {
        
      MiddleWare(request,NextResponse,morgan)
      responseData=await getMedicineData(id)
    }
    else if (action==='getDashboardData') {
        
        MiddleWare(request,NextResponse,morgan)
        responseData=await getDashboardData(id)
    }
    else if (action==='getStatisticReport') {
        
        MiddleWare(request,NextResponse,morgan)
        responseData=await getReportData(id)
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

export const newSale=async(value:any)=>{

    let responseData={
        message:'',
        success:false
    }

    try {
        
        const body=value

        let isToday=await Sales.findOne({pharmacy:body[0].pharmacy})

        const pharmacy = body[0].pharmacy;
        const date = body[0].sellingTime.date;
        const hour = body[0].sellingTime.hour;

        const moreHourDetails=async()=>{
            await Sales.updateOne(
                {
                pharmacy: pharmacy,
                'details.date': date,
                'details.moreDateDetails.hour': hour,
                },
                {
                $push: {
                    'details.$[outer].moreDateDetails.$[hour].moreHourDetails': {
                    $each: body.map((result:any) => ({
                        batchNumber: result.batchNumber.toUpperCase(),
                        medicineName: result.medicineName,
                        saleAmount: result.totalPrice,
                        medicineCategory: result.medicineCategory,
                        quantitySold: result.quantitySold,
                    })),
                    },
                },
                },
                {
                arrayFilters: [
                    { 'outer.date': date },
                    { 'hour.hour': hour },
                ],
                }
            )
        }

        const moreDateDetails=async()=>{
                await Sales.updateOne(
                    {
                    pharmacy: pharmacy,
                    'details.date': date,
                    // 'details.moreDateDetails': hour,
                    },
                    {
                        hour:body[0].sellingTime.hour,
                        $push: {
                          'details.$[outer].moreDateDetails': {
                            hour:body[0].sellingTime.hour,
                            moreHourDetails:[],
                            }
                        },
                      },
                      {
                        arrayFilters: [
                          { 'outer.date': date },
                        ],
                      }
                )
        }

        const Details=async()=>{
            await Sales.updateOne(
                    {
                    pharmacy: pharmacy,
                    },
                    {
                        date:body[0].sellingTime.date,
                        $push: {
                          'details': {
                                date:body[0].sellingTime.date,
                                moreDateDetails:[]
                            }
                        },
                    },
                      
                )
        }

        if (isToday) {

            if (isToday.date === body[0].sellingTime.date) {

                if (isToday.hour === body[0].sellingTime.hour) {
                    moreHourDetails()
                } else {
                    await moreDateDetails()
                    moreHourDetails()
                }
                
            } else {
                await Details()
                await moreDateDetails()
                await moreHourDetails()
            }
        }
        else{

            await Sales.create({
                pharmacy:body[0].pharmacy,
                date:body[0].sellingTime.date,
                hour:body[0].sellingTime.hour,
                details:[]
            })

            await Details()
            await moreDateDetails()
            await moreHourDetails()

        }

        let promises: any[]=[]

        promises.push(
            await body.map(async(result:any)=>{

                let medicine=await NewMedicine.findOne({batchNumber:result.batchNumber})
    
                const newQuantity= (medicine.availableQuantity-result.quantitySold)
                medicine.availableQuantity=newQuantity
    
                await medicine.save()
            })
        )

        await Promise.allSettled(promises)

        responseData.success=true
    
        return responseData

    } catch (error) {
        
        console.log(error);
        responseData.message='Server error has ocurred.'      
    
        return responseData
    }
    
}

//GET DASHBOARD DATA
export const getDashboardData = async (id:any) => {

    let responseData={
        message:'',
        success:false,
        totalData:{}
    }
    try {
      let totalData = {};

      const pipeline = [
        {
          $match: {pharmacy:new mongoose.Types.ObjectId(id), __v: { $not: { $eq: -1 } }},
        },
        {
          $group: {
            _id: '$medicineCategory',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            medicineCategory: '$_id',
            count: 1,
          },
        },
      ];

    let dateHour= Today()

    let todaySales=0
    let weekSales=0
    let monthSales=0
    let hourSales=0

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const salesPipeline = [
    {
        $match: { pharmacy:new mongoose.Types.ObjectId(id), __v: 0 },
    },
    {
        $unwind: "$details",
    },
    {
        $unwind: "$details.moreDateDetails",
    },
    {
        $unwind: "$details.moreDateDetails.moreHourDetails",
    },
    {
        $group: {
        _id: null,
        hourSales: {
            $sum: {
            $cond: [
                { $eq: ["$details.moreDateDetails.hour", dateHour.hour] },
                "$details.moreDateDetails.moreHourDetails.saleAmount",
                0,
            ],
            },
        },
        todaySales: {
            $sum: {
            $cond: [
                { $gte: ["$details.date", dateHour.date] },
                "$details.moreDateDetails.moreHourDetails.saleAmount",
                0,
            ],
            },
        },
        weekSales: {
            $sum: {
            $cond: [
                { $gte: ["$details.date", dateHour.thisWeek] },
                "$details.moreDateDetails.moreHourDetails.saleAmount",
                0,
            ],
            },
        },
        monthSales: {
            $sum: {
            $cond: [
                { $gte: ["$details.date", dateHour.thisMonth] },
                "$details.moreDateDetails.moreHourDetails.saleAmount",
                0,
            ],
            },
        },
        },
    },
    ];

    const salesData = await Sales.aggregate(salesPipeline);

    if (salesData.length > 0) {
        todaySales = salesData[0].todaySales;
        weekSales = salesData[0].weekSales;
        monthSales = salesData[0].monthSales;
        hourSales = salesData[0].hourSales;
    }


      const results = await NewMedicine.aggregate(pipeline);
      const expiredDrugs = await NewMedicine.find({
        pharmacy:id, 
        $or: [
          { expiresAt: { $eq: today } },
          { expiresAt: { $lt: today } },
        ],
      });

      totalData.overal = results.reduce((sum, result) => sum + result.count, 0);
      totalData.M01AB = getCountByCategory(results, 'M01AB');
      totalData.M01AE = getCountByCategory(results, 'M01AE');
      totalData.N05C = getCountByCategory(results, 'N05C');
      totalData.N05B = getCountByCategory(results, 'N05B');
      totalData.R03 = getCountByCategory(results, 'R03');
      totalData.R06 = getCountByCategory(results, 'R06');
      totalData.N02BEB = getCountByCategory(results, 'N02BE/B');
      totalData.todaySales = todaySales;
      totalData.hourSales = hourSales;
      totalData.weekSales = weekSales;
      totalData.monthSales = monthSales;
      totalData.expiredDrugs = expiredDrugs.length;
  
        responseData.success=true
        responseData.totalData=totalData
    
        return responseData

    } catch (error) {
        console.log(error);
        responseData.message='Server error has ocurred.'      
        return responseData
    }
};

  // Helper function to get count by category
const getCountByCategory = (results: any[], category: string) => {
    const categoryResult = results.find((result: { medicineCategory: any; }) => result.medicineCategory === category);
    return categoryResult ? categoryResult.count : 0;
};

//GET DASHBOARD DATA
export const getReportData = async (id:any) => {

    let responseData={
        message:'',
        success:false,
        reports:[]
    }

    try {

    let dateHour= Today()

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearsAgo = new Date();
    yearsAgo.setFullYear(today.getFullYear() - 5); // 5 years ago
    
    const salesPipeline = [
    {
        $match: { pharmacy: new mongoose.Types.ObjectId(id), __v: 0 },
    },
    {
        $unwind: "$details",
    },
    {
        $unwind: "$details.moreDateDetails",
    },
    {
        $unwind: "$details.moreDateDetails.moreHourDetails",
    },
    {
        $match: {
            "details.date": { $gte: dateHour.yearsAgo}
        },
    },
    {
        $group: {
        _id: {
            hour: "$details.moreDateDetails.hour",
            date: "$details.date",
            thisWeek: { $gte: ["$details.date", dateHour.thisWeek] },
            thisMonth: { $gte: ["$details.date", dateHour.thisMonth] },
        },
        documents: {
            $push: "$$ROOT", // Store the original documents
        },
        },
    },
    {
        $project: {
        _id: 0, 
        documents: 1,
        },
    },
    ];

    const groupedDocuments = await Sales.aggregate(salesPipeline);

    responseData.success=true
    responseData.reports=groupedDocuments
    return responseData

    } catch (error) {
        console.log(error);
        responseData.message='Server error has ocurred.'      
        return responseData
    }
};