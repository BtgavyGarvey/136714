import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import { NextRequest } from "next/server"
import authOptions from "@/app/api/auth/[...nextauth]/options"
import SideNav from "../../../../../../components/sc/layout/sideNav"
import ReportsPage from "../../../../../../components/sc/user/medicine/reports/index"


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
            <ReportsPage  pharm={session.user}/>
          </>
        ):(
          toLoginPage()
        )
      }
    </>
  )
  
}