import { NextRequest, NextResponse } from "next/server";
import DbConnect, { MiddleWare, generateCode, generateId, newPharmacyValidation, newUserValidation, sanitizeMessage, sendEmail } from "../../utils";
import Pharmacy from "../../model/pharmacy";
import Token from "../../model/token";
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import Morgan from 'morgan'
import User from "../../model/user";

// DB CONNECTION

DbConnect()

// HTTP REQUEST METHODS

export async function POST(request:NextRequest) {

    let responseData:any

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')
    const morgan=Morgan('dev')

    if (params==='newPharmacy') {
      MiddleWare(request,NextResponse,morgan)
      responseData=await newPharmacy(body)
    }
    else if (params==='forgotpassword') {
      MiddleWare(request,NextResponse,morgan)
      responseData=await forgotPassword(body)
    }
    else if (params==='checkcode') {
      MiddleWare(request,NextResponse,morgan)
      responseData=await checkResetPasswordCode(body)
    }
    else if (params==='newUser') {
      MiddleWare(request,NextResponse,morgan)
      responseData=await newUser(body)
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
    const username=searchParams.get('username')
    const password=searchParams.get('password')
    const pharmacy=searchParams.get('pharmacy')
    const morgan=Morgan('dev')

    if (params==='login') {      
      MiddleWare(request,NextResponse,morgan)
      responseData=await loginUser2(username,password)
      
    }
    else if (params==='getUserData') {      
      MiddleWare(request,NextResponse,morgan)
      responseData=await getUserData(pharmacy)
      
    }
    return NextResponse.json(responseData)
    
}

export async function PATCH(request:NextRequest) {

    let responseData:any


    const {searchParams}=new URL(request.url)
    const action=searchParams.get('action')
    const token=searchParams.get('token')
    const vr=searchParams.get('vr')
    const morgan=Morgan('dev')

    if (action==='verifyemail') {
      
      MiddleWare(request,NextResponse,morgan)
        
      responseData=await verifyEmail(token,vr)
    }
    else if (action==='editUserData') {
      const body=await request.json()
      
      MiddleWare(request,NextResponse,morgan)
        
      responseData=await editUserData(body)
    }
    return NextResponse.json(responseData)
    
}

export async function PUT(request:NextRequest) {

    let responseData:any

    const body=await request.json()
    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')

    if (params==='resetPassword') {
        
      responseData=await resetPassword(body)
    }
    return NextResponse.json(responseData)
    
}

export async function DELETE(request:NextRequest) {

    let responseData={
        message:'',
        success:false
    }

    const {searchParams}=new URL(request.url)
    const params=searchParams.get('action')
    const pharmacy=searchParams.get('pharmacy')
    const username=searchParams.get('username')
    const morgan=Morgan('dev')

    if (params==='deleteUserData') {
        
        MiddleWare(request,NextResponse,morgan)
        
      responseData=await deleteUserData(pharmacy,username)
    }
    return NextResponse.json(responseData)
    
}

// CODE GENERATION

async function generateUniqueCode(prefix: any) {
  let code;
  do {
    code = await generateCode(prefix);
  } while (await Pharmacy.findOne({ code }));

  return code;
}

async function generateUniqueId(prefix: any) {
  let id;
  do {
    id = await generateId(prefix);
  } while (await Pharmacy.findOne({ id }));

  return id;
}

async function generateUniqueUsername() {
  let username;
  do {
    username = Math.floor(Math.random() * 999999 - 111111 + 1) + 111111;
  } while (await User.findOne({ username }));

  return username;
}

async function generateUniqueUserId(prefix: any) {
  let id;
  do {
    id = await generateId(prefix);
  } while (await User.findOne({ id }));

  return id;
}

export const tokenGeneration = async (id: any, emailToken: any) => {
  try {
    let token = await Token.findOne({ id });

    if (token) {
      await token.deleteOne();
    }

    await Token.create({
      id,
      token: emailToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 2880 * 60 * 1000, // 2880 minutes => 2 days
    });
  } catch (error) {
    console.log(error);
  }
};

// EXTENSION FUNCTIONS OF HTTP METHODS

export const newPharmacy=async(value: undefined)=>{

  let responseData={
      message:'',
      success:false
  }

  let pharmValue={
    mobile:value?.mobile,
    pharmacy:value?.pharmacy,
    email:value?.email,
  }

  try {

    const validate=await newPharmacyValidation(pharmValue)

    if (validate.error) {
        console.log(validate.error);
        responseData.message='Fill in all fields.'      

        return responseData
    }

    const body=validate.value

    const promises=[
      Pharmacy.findOne({email:body.email}).select('-_id'),
      Pharmacy.findOne({mobile:body.mobile}).select('-_id'),
      generateUniqueCode('P'),
      generateUniqueId(1),
    ]

    const promise=await Promise.allSettled(promises)

    const data=promise.filter((res)=> res.status==='fulfilled') as PromiseFulfilledResult<any>[]
    // console.log(promise);

    const emailExist=data[0].value
    const mobile=data[1].value
    const code=data[2].value
    const id=data[3].value

    if (emailExist) {
      responseData.message='Pharmacy email has already been registered'
      return responseData
    }

    if (mobile) {
      responseData.message='Contact Number has already been registered'
      return responseData
    }

    const insertPharmacy=await Pharmacy.create({
      id,
      code,
      pharmacy:body.pharmacy,
      mobile:body.mobile,
      email:body.email,
      verified:false,
      __v:0,
    })

    if (!insertPharmacy) {
      responseData.message='Invalid data'
      return responseData
    }

    let userValue={
      firstName:value?.firstName,
      lastName:value?.lastName,
      email:value?.email,
      pharmacy:JSON.stringify(insertPharmacy.id),
      role:'Administrator'
    }

    await newUser(userValue)

    let verifyToken = crypto.randomBytes(32).toString("hex") + insertPharmacy.id;
      
    await tokenGeneration(insertPharmacy.id, verifyToken);

    const verifyUrl = `${process.env.WEB_URL}/sc/verifyemail?token=${verifyToken}&vr=pharmacy`;

    const message=`
    <h3>Registration of ${insertPharmacy.pharmacy} Pharmacy</h3>
    <p>Thank you for registering in Pharmacy Management System.</p>
    <p>Please use the link below to verify your Registration.</p>
    <p>The verification link is valid for only 2 days.</p>
    <p><a href=${verifyUrl} clicktracking=off>Click here</a> to verify your registration</p><br />
    <p>If the above link is not working, plase copy and paste the below link in your browser.</p>
    <p><a href=${verifyUrl} clicktracking=off>${verifyUrl}.</a></p><br />

    <p>Kind Regards</P>
    `
    
    const subject="Pharmacy Verification"
    const send_to=insertPharmacy.email
    const sent_from=process.env.EMAIL_USER

    const sanitizedMessage = await sanitizeMessage(message);

    sendEmail(subject,sanitizedMessage,send_to,sent_from)

    responseData.success=true

    return responseData
    
  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      

    return responseData
  }

  
    
}

export const newUser=async(value: undefined)=>{

  let responseData={
    message:'',
    success:false
  }

  try {

    const validate=await newUserValidation(value)

    if (validate.error) {
        console.log(validate.error);
        responseData.message='Fill in all fields.'      

        return responseData
    }

    const body=validate.value


    let pharmacyObject=JSON.parse(JSON.stringify(body.pharmacy))

    const promises=[
      User.findOne({email:body.email,__v:0}).select('-password -_id'),
      Pharmacy.findOne({id:pharmacyObject}),
      generateUniqueUsername(),
      generateUniqueUserId(2),
    ]
    const promise=await Promise.allSettled(promises)

    const data=promise.filter((res)=> res.status==='fulfilled') as PromiseFulfilledResult<any>[]

    const emailExist=data[0].value
    const pharmacy=data[1].value
    const username=data[2].value
    const id=data[3].value

    if (emailExist) {
      responseData.message='User email has already been registered'
      return responseData
    }

    let password=crypto.randomBytes(4).toString('hex')

    const insertUser=await User.create({
      id,
      username,
      firstName:body.firstName,
      lastName:body.lastName,
      pharmacy:pharmacy.id,
      role:body.role,
      email:body.email,
      password,
      verified:false,
      __v:0,
    })

    if (!insertUser) {
      responseData.message='Invalid data'
      return responseData
    }

    let verifyToken = crypto.randomBytes(32).toString("hex") + insertUser.id;
      
    await tokenGeneration(insertUser.id, verifyToken);

    const verifyUrl = `${process.env.WEB_URL}/sc/verifyemail?token=${verifyToken}&vr=user`;

    const message=`
    <h3>Registration of ${insertUser.firstName}</h3>
    <p>Thank you for registering at ${pharmacy.pharmacy} Pharmacy.</p>
    <p>Please use the link below to verify your Registration.</p>
    <p>Your Login Details:</p>
    <p>Username: ${username}</p>
    <p>You have been given a random password. Click <a href='${`${process.env.WEB_URL}`}/sc/resetpassword'>here</a> to rest your password.</p>
    <p>The verification link is valid for only 2 days.</p>
    <p><a href=${verifyUrl} clicktracking=off>Click here</a> to verify your registration</p><br />
    <p>If the above link is not working, plase copy and paste the below link in your browser.</p>
    <p><a href=${verifyUrl} clicktracking=off>${verifyUrl}.</a></p><br />

    <p>Kind Regards</P>
    `
    
    const subject="User Verification"
    const send_to=insertUser.email
    const sent_from=process.env.EMAIL_USER

    const sanitizedMessage = await sanitizeMessage(message);

    sendEmail(subject,sanitizedMessage,send_to,sent_from)

    responseData.success=true

    return responseData
    
  } catch (error) {
    console.log(error);
    responseData.message='Server error has ocurred.'      

    return responseData
  }
    
}

// USER LOGIN

export const loginUser = async (username: any, password: any, req: any) => {
  
  
    try {
      if (!username || !password) {
        return {
          message: 'Please enter username and password',
          success: false,
        };
      }
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return {
          message: 'Invalid username or password',
          success: false,
        };
      }
  
      if (user.__v === -1) {
        return {
          message: 'Invalid username or password',
          success: false,
        };
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (validPassword) {
        if (!user.verified) {
          return {
            message: 'Email not verified. Please verify your email address',
            success: false,
          };
        }

        let pharmacy= await Pharmacy.findOne({id:user.pharmacy})
  
        if (process.env.NODE_ENV === 'production') {
          // loginDetails(req, pharmacy.id, pharmacy.email, pharmacy.pharmacy);
        }
  
        let access = true;
  
        return {
          success: true,
          pharmacy,
          user,
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

// USER LOGIN 2

export const loginUser2 = async (username: string, password: any) => {
  
  let responseData={
    message:'',
    success:false
  }
  
  try {
    if (!username || !password) {
        responseData.message= 'Please enter username and password'
        return responseData
    }

    const user = await User.findOne({ username });

    if (!user) {
        responseData.message= 'Invalid username or password'
        return responseData
    }

    if (user.__v === -1) {
        responseData.message= 'Invalid username or password'
        return responseData
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      if (!user.verified) {
          responseData.message= 'Email not verified. Please verify your email address'
          return responseData
      }

      const randomNum = Math.floor(Math.random() * (99999 - 10000)) + 10000;
      const  loginCode = 'P'+randomNum
      const hashedToken = crypto.createHash("sha256").update(loginCode).digest('hex');

      await Token.deleteMany({ id: user.id });

      await Token.create({
        id: user.id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 5 * (60 * 1000) // 5 minutes
      });
  
      // Email the login code to the user
      const message = `
        <h2>Hello ${user.firstName} ${user.lastName}</h2>
        <p>You requested a login code.</p>
        <p>Please use the code below to login.</p>
        <p>The login code is valid for only 5 minutes.</p><br />
        <p>${loginCode}</p><br />
        <p>Kind Regards</P>
      `;
      const subject = "Login Code";
      const send_to = user.email;
      const sent_from = process.env.EMAIL_USER;

      const sanitizedMessage = await sanitizeMessage(message);

      sendEmail(subject, sanitizedMessage, send_to, sent_from);

      responseData.success=true
      return responseData
      
    } else {
      responseData.message= 'Invalid username or password'
      return responseData
    }
  } catch (error) {
    console.log('Error =>' + error);
    responseData.message= 'Unknown server error has occurred'
    return responseData
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


  export const verifyEmail=async(token: null,val:any)=>{

    let responseData={
      message:'',
      success:false
    }

    const hashedToken=crypto.createHash("sha256").update(token).digest('hex')

    try {
        const pharmacyToken=await Token.findOne({
            token:hashedToken,
            expiresAt:{$gt:Date.now()}
        })
    
        if (!pharmacyToken) {
          responseData.message='Link has expired.'      
          return responseData
        }
    
        if (pharmacyToken.used) {
          responseData.message='Link has already been used.'      
          return responseData
        }
        let pharmacy:any
        if (val==='pharmacy') {
          pharmacy=await Pharmacy.findOne({id:pharmacyToken.id})
        }
        else if(val==='user'){
          pharmacy=await User.findOne({id:pharmacyToken.id})
        }
        else{
          responseData.message='Invalid link.'      
          return responseData
        }

        if (pharmacy.verified) {
          responseData.message='You have already verified your email.'      
          return responseData
        }
    
        pharmacy.verified=true
        pharmacyToken.used=true
        await pharmacyToken.save()
        await pharmacy.save()

        responseData.success=true      
        return responseData
    } catch (error) {
        console.log(error)
        responseData.message='Unknown sever error has occured.'      
        return responseData
    }
    
}

// REQUEST PASSWORD CODE

export const forgotPassword = async (body: { username: any; }) => {

  let responseData={
    message:'',
    success:false
  }

  try {

    const { username } = body;
    const user = await User.findOne({ username });

    if (!user) {
      responseData.message='Invalid Username.'      
      return responseData
    }

    if (!user.verified) {
      responseData.message='Email not verified.'  
      return responseData
    }

    // Delete existing token for the user from DB if it exists
    await Token.deleteMany({ id: user.id });

    // Generate a random token and hash it before saving to DB
    const resetToken = crypto.randomBytes(8).toString("hex").toUpperCase();
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest('hex');

    // console.log(resetToken);
    // Save the new token to DB
    await Token.create({
      id: user.id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * (60 * 1000) // 5 minutes
    });

    // Email the reset token to the user
    const message = `
      <h2>Hello ${user.firstName}</h2>
      <p>You requested a password reset.</p>
      <p>Please use the code below to reset your password.</p>
      <p>The reset code is valid for only 5 minutes.</p><br />
      <p>${resetToken}</p><br />
      <p>Kind Regards</P>
    `;
    const subject = "Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {

        const sanitizedMessage = await sanitizeMessage(message);

      sendEmail(subject, sanitizedMessage, send_to, sent_from);

      responseData.message='Password reset code sent to your email.'      
      responseData.success=true    
      return responseData

    } catch (error) {
      console.log(error);
      responseData.message='Email not set, please try again.'      
      return responseData
    }
  } catch (error) {
    console.log(error);
    responseData.message='Server error occurred.'      
    return responseData
  }
};

// CHECK PASSWORD CODE

export const checkResetPasswordCode = async (body: { code: string; username:any}) => {
  let responseData={
    message:'',
    success:false
  }

  try {

      const myCode = body.code.trim();
    let hashedToken = crypto.createHash("sha256").update(myCode).digest("hex");
    hashedToken = crypto.createHash("sha256").update(hashedToken).digest("hex");

    const user = await User.findOne({ username:body.username });

    const pharmacyToken = await Token.findOne({
      id: user.id,
      token: hashedToken,
      expiresAt: { $gt: Date.now() }
    });

    if (!pharmacyToken) {
      responseData.message='Invalid code.'      
      return responseData
    }

    responseData.success=true      
    return responseData
  } catch (error) {
    console.log(error);
    responseData.message='Server error occurred.'      
    return responseData
  }
};

// RESET PASSWORD

export const resetPassword = async (body: { password: any; username: any; }) => {

  let responseData={
    message:'',
    success:false
  }

  try {

    const { password, username } = body;

    // Find user by username
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      responseData.message='User not found, please sign up.'      
      return responseData
    }
    
    // Update user password
    user.password = password;
    await user.save();

    const message = `
      <h2>Hello ${user.firstName}</h2>
      <p>You have reset your password successfully.</p>
      <p>If you did not change your password, contact us on the email below.</p>
      <p><a href=${process.env.EMAIL_USER} alt='_blank' clicktracking=off>${process.env.EMAIL_USER}.</a></p><br />
      <p>Kind Regards</p>
    `;
    const subject = "Password Reset Update";
    const send_to = user.email;
    const sent_from = process.env.EMAIL_USER;

    try {
      const sanitizedMessage = await sanitizeMessage(message);

      sendEmail(subject, sanitizedMessage, send_to, sent_from);

      responseData.message='Password Reset Successful. Please Login.'     
      responseData.success=true     
      return responseData

    } catch (error) {
      console.log(error);
      responseData.message='Email not set, please try again.'      
      return responseData
    }
  } catch (error) {
    console.log(error);
    responseData.message='Server error occurred.'      
    return responseData
  }
};

export const getUserData=async(pharmacy:any)=>{

  let responseData={
    message:'',
    success:false,
    users: []
  }

  try {

    let users=await User.find({pharmacy,__v:0}).select('-password -_id')

    responseData.success=true
    responseData.users=users

    console.log(users);
    

    return responseData
    
  } catch (error) {
    console.log(error);
    responseData.message='Server error occurred.'      
    return responseData
  }

}

export const editUserData=async(body:any)=>{

  let responseData={
      message:'',
      success:false,
  }

  try {
      let editUser=await User.findOneAndUpdate(
          {pharmacy:body.pharmacy, id:body.id},{$set:{...body}},{new:true}
      )

      if (editUser) {
          
          responseData.success=true
      }
      else{
          responseData.message='Invalid user data'
      }

      return responseData
      
  } catch (error) {
      console.log(error);
      responseData.message='Server error has ocurred.'      
  
      return responseData
  }

}

export const deleteUserData=async(pharmacy:any,username:any)=>{

  let responseData={
      message:'',
      success:false,
  }

  try {
      let deleteUser=await User.findOneAndUpdate(
          {pharmacy, username},{$set:{__v:1}},{new:true}
      )

      if (deleteUser) {
          responseData.success=true
      }
      else{
          responseData.message='Invalid user data'
      }

      return responseData
      
  } catch (error) {
      console.log(error);
      responseData.message='Server error has ocurred.'      
  
      return responseData
  }

}