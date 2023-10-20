import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import { useSession } from "next-auth/react"
import Loader from "../../../../../../components/sc/loader/Loader"
import { NextRequest } from "next/server"
import authOptions from "@/app/api/auth/[...nextauth]/options"
import SideNav from "../../../../../../components/sc/layout/sideNav"
import NewMedicinePage from "../../../../../../components/sc/user/medicine/new/page"

export default async function DashboardPage(req:NextRequest): Promise<any>{

  const session = await getServerSession(authOptions)
  console.log(session);

  const toLoginPage=()=>{
    redirect('/')
  }

  return(
    <>
      {
        session !==null ? (
          <>
            <SideNav pharm={session.user}/>
            <NewMedicinePage  pharm={session.user}/>
          
          </>
        ):(
          toLoginPage()
        )
      }
    </>
  )
  
}