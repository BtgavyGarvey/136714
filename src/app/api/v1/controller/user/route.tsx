import { NextRequest, NextResponse } from "next/server";
import DbConnect, { newPharmacyValidation } from "../../utils";
import Pharmacy from "../../model/pharmacy";
import bcrypt from 'bcryptjs'
import { Country} from 'country-state-city'


// DB CONNECTION

DbConnect()

// HTTP REQUEST METHODS

export async function POST(request:NextRequest) {

    let responseData={
        message:'',
        success:false
    }

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='newPharmacy') {
        
        await newPharmacy(body)
    }
    return NextResponse.json(responseData)
    
}

export async function GET(request:NextRequest) {

    let responseData={
        message:'',
        success:false
    }

    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='newPharmacy') {
        
        // await newPharmacy()
    }
    return NextResponse.json(responseData)
    
}

export async function PATCH(request:NextRequest) {

    let responseData={
        message:'',
        success:false
    }

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='newPharmacy') {
        
        await newPharmacy(body)
    }
    return NextResponse.json(responseData)
    
}

export async function PUT(request:NextRequest) {

    let responseData={
        message:'',
        success:false
    }

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='newPharmacy') {
        
        await newPharmacy(body)
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

// EXTENSION FUNCTIONS OF HTTP METHODS

export const newPharmacy=async(value: undefined)=>{

    let responseData={
        message:'',
        success:false
    }

    const validate=await newPharmacyValidation(value)

    if (validate.error) {
        console.log(validate.error);
        responseData.message='Fill in all fields.'

        return responseData
        
    }

    const body=validate.value
}

// PHARMACY LOGIN

export const loginUser = async (email: string, password: any, req: any) => {
    try {
      if (!email || !password) {
        return {
          message: 'Please enter username and password',
          success: false,
        };
      }
  
      const pharmacy = await Pharmacy.findOne({ email }).select('-password -_id');
  
      if (!pharmacy) {
        return {
          message: 'Invalid username or password',
          success: false,
        };
      }
  
      if (pharmacy.__v === -1) {
        return {
          message: 'Invalid username or password',
          success: false,
        };
      }
  
      const validPassword = await bcrypt.compare(password, pharmacy.password);
  
      if (validPassword) {
        if (!pharmacy.verified) {
          return {
            message: 'Email not verified. Please verify your email address',
            success: false,
          };
        }
  
        if (process.env.NODE_ENV === 'production') {
          // loginDetails(req, pharmacy.id, pharmacy.email, pharmacy.pharmacy);
        }
  
        let access = true;
  
        return {
          success: true,
          pharmacy,
          access,
        };
      } else {
        return {
          message: 'Invalid username or password',
          success: false,
        };
      }
    } catch (error) {
      console.log('Error =>' + error);
      return {
        message: 'Unknown server error has occurred',
        success: false,
      };
    }
  };
  
  // LOGIN DETAILS - EXTENSION OF loginUser() FUNCTION
  
  // export const loginDetails = async (req: { headers: any; connection: any; }, id: any, email: any, name: any) => {
  //   try {
  //     const { headers, connection } = req;
  
  //     const device = headers['user-agent'];
  //     const ipAddress = headers['x-real-ip'] || headers._remoteAddress;
  //     const location = {
  //       country: headers['x-vercel-ip-country'],
  //       city: headers['x-vercel-ip-city'],
  //       latitude: headers['x-vercel-ip-latitude'],
  //       longitude: headers['x-vercel-ip-longitude'],
  //       timeZone: headers['x-vercel-ip-timezone'],
  //     };
  
  //     if (!device || !ipAddress || !location.country || !location.city) {
  //       return; 
  //     }
  
  //     const rootDomain = headers.host;
  //     const protocol = headers['x-forwarded-proto'] || (connection.encrypted ? 'https' : 'http');
  
  //     const country = await Country.getCountryByCode(location.country);
  //     location.country = country.name;
  
  //     const options = {
  //       timeZone: location.timeZone,
  //       dateStyle: 'full',
  //       timeStyle: 'medium',
  //     };
  //     const d = new Date();
  //     const date = new Intl.DateTimeFormat('en-US', options).format(d);
  
  //     // const login = await LoginStatus.findOneAndUpdate(
  //     //   { userId: id },
  //     //   { isLoggedIn: true, updatedAt: new Date() },
  //     //   { upsert: true, new: true },
        
  //     // );
  
  //     const logindetails = await LoginDetails.findOne({ userId: id });
  
  //     if (logindetails) {
  //       if (logindetails.device !== device) {
  //         const message = `
  //           <h4>Hello ${name}</h4>
  //           <p>Your Legio Mariae Management System account was just signed in to from a new device.</p><br />
  //           <p><b>When:</b> ${date}</P>
  //           <p><b>Time Zone:</b> ${location.timeZone}</P>
  //           <p><b>Device:</b> ${device}</P>
  //           <p><b>IP Address:</b> ${ipAddress}</P>
  //           <p><b>Location:</b> ${location.city}/${location.country}</P><br />
  //           <p>If this was you, then you don't need to do anything.</P>
  //           <p>If you don't recognize this activity, please <a href="${protocol}://${rootDomain}/sections/forgotpassword">change your password</a>.</P>
  //         `;
  //         const subject = 'New Sign in to your Legio Mariae Management System account';
  //         const send_to = email;
  //         const sent_from = process.env.EMAIL_USER;
  
  //         // Sanitize the message before sending it via email
  //         const sanitizedMessage = await sanitizeMessage(message);
  
  //         sendEmail(subject, sanitizedMessage, send_to, sent_from);
  //       }
  
  //       logindetails.device = device;
  //       logindetails.location = location;
  //       logindetails.ipAddress = ipAddress;
  //       await logindetails.save();
  
        
  //     } else {
  //       await LoginDetails.create({
  //         userId: id,
  //         ipAddress,
  //         device,
  //         location,
  //         __v: 0,
  //       },);
  //     }
  
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

