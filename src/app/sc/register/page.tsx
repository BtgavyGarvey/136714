import { redirect } from "next/navigation";
import NewPharmacy from "../../../../components/sc/register";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
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
          <NewPharmacy />
        ):(
          toLoginPage()
        )
      }
      
    </>
  )
}