import ForgotPassword from "../../../../components/sc/resetPassword";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { NextRequest } from "next/server";

export default async function Home(req:NextRequest): Promise<any>{

  const session = await getServerSession(authOptions)

  const toLoginPage=()=>{
    redirect('/sc/user/dashboard#first')
  }

  return(
    <>
    {
        session === null ? (
          <ForgotPassword />
        ):(
          toLoginPage()
        )
      }
      
    </>
  )
}