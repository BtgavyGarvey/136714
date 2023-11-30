import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import Users from "../../../../../components/sc/user/view/page"
import { useSession } from "next-auth/react"
import Loader from "../../../../../components/sc/loader/Loader"
import { NextRequest } from "next/server"
import authOptions from "@/app/api/auth/[...nextauth]/options"
import SideNav from "../../../../../components/sc/layout/sideNav"
// 
export default async function ViewUserPage(req:NextRequest): Promise<any>{

  const session = await getServerSession(authOptions)

  const toLoginPage=()=>{
    redirect('/')
  }

  return(
    <>
      {
        session !==null ? (
          <>
            <SideNav pharm={session.user}/>
            <Users  pharm={session.user}/>
          
          </>
        ):(
          toLoginPage()
        )
      }
    </>
  )
  
}