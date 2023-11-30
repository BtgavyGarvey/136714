import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import Users from "../../../../../components/sc/user/new/page"
import { useSession } from "next-auth/react"
import Loader from "../../../../../components/sc/loader/Loader"
import { NextRequest } from "next/server"
import authOptions from "@/app/api/auth/[...nextauth]/options"
import SideNav from "../../../../../components/sc/layout/sideNav"
// 
export default async function NewUserPage(req:NextRequest): Promise<any>{

  const session = await getServerSession(authOptions)

  const toLoginPage=()=>{
    redirect('/')
  }

  const toDashboard=()=>{
    redirect('/sc/user/dashboard#first')
  }

  return(
    <>
      {
        session !==null ? (
          session?.user?.role==='Administrator' ? (
          <>
            <SideNav pharm={session.user}/>
            <Users  pharm={session.user}/>
          
          </>
          ):(
              toDashboard()
          )
          
        ):(
          toLoginPage()
        )
      }
    </>
  )
  
}