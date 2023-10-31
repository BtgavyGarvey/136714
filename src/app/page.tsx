import Login from "../../components/sc/login";
import { NextRequest } from "next/server"
import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import authOptions from "./api/auth/[...nextauth]/options";


export default async function Home(req:NextRequest): Promise<any>{

  const session = await getServerSession(authOptions)
  

  const toLoginPage=()=>{
    redirect('/sc/user/dashboard#first')
  }

  return(
    <>
    {
        session === null ? (
          <Login />
        ):(
          toLoginPage()
        )
      }
      
    </>
  )
}