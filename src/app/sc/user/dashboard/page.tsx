import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import Dashboard from "../../../../../components/sc/user/dashboard"
import { useSession } from "next-auth/react"
import Loader from "../../../../../components/sc/loader/Loader"
import { NextRequest } from "next/server"
import authOptions from "@/app/api/v1/auth/[...nextauth]/options"
// 
export default async function DashboardPage(req:NextRequest): Promise<any>{

  const session = await getServerSession(authOptions)

  const toLoginPage=()=>{
    redirect('/')
  }

  return(
    <>
      {
        session !==null ? (
          <Dashboard />
        ):(
          toLoginPage()
        )
      }
    </>
  )
  
}