import { redirect } from "next/navigation"
import { getServerSession } from 'next-auth/next'
import { NextRequest } from "next/server"
import authOptions from "@/app/api/auth/[...nextauth]/options"
import SideNav from "../../../../../../components/sc/layout/sideNav"
import ReportsPage from "../../../../../../components/sc/user/medicine/reports/index"
import { ReportData, predict } from "./data"


export default async function DashboardPage(req:NextRequest): Promise<any>{

  const session = await getServerSession(authOptions)

  const toLoginPage=()=>{
    redirect('/')
  }
  predict()

  let chartDataHour=await ReportData()
  // console.log(chartDataHour);
  

  return(
    <>
      {
        session !==null ? (
          <>
            <SideNav pharm={session.user}/>
            <ReportsPage  pharm={session.user} data={chartDataHour}/>
          </>
        ):(
          toLoginPage()
        )
      }
    </>
  )
  
}