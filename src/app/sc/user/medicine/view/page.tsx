import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import { useSession } from "next-auth/react"
import Loader from "../../../../../../components/sc/loader/Loader"
import { NextRequest } from "next/server"
import authOptions from "@/app/api/auth/[...nextauth]/options"
import SideNav from "../../../../../../components/sc/layout/sideNav"
import ViewMedicinePage from "../../../../../../components/sc/user/medicine/view/page"

export default async function DashboardPage(req:NextRequest): Promise<any>{

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
            <ViewMedicinePage  pharm={session.user}/>
          
          </>
        ):(
          toLoginPage()
        )
      }
    </>
  )
  
}