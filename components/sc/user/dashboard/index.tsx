'use client'

import { signOut } from "next-auth/react"
import NavigationBar, { Today } from "../../layout/topNav"
import Link from "next/link"
import React, { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

export default function Dashboard({pharm}:any) {

    const pharmacyName=pharm.name

    const router=useRouter()
    const [mydashboardData, setMydashboardData]=React.useState(null)

    const todayHour=Today()

    

    const getDashboardData=async()=>{
        let id
        try{
            id=toast.loading('Loading data. Please wait...',{id:id})
            const response=await axios.get(`/api/v1/controller/medicine?action=getDashboardData&pharmacy=${pharm.id}`)
            toast.dismiss(id)
            if(response.data.success){
                setMydashboardData(response.data.totalData)
            }
            else{
                console.log(response.data.message,{id:id});
            }
        }
        catch(error){
            console.log(error);

        }
    }

    React.useEffect(()=>{

        getDashboardData()

    },[])

    // console.log(mydashboardData);
    

    const createSection1=(title: string, count = 0,key:any)=> { 
                    
        return(
            <div key={key} className="col-xs-12 col-sm-12 col-md-12 col-lg-3 fw-bold text-start text-wrap text-break" >
            <div className="dashboard-stats">
                <span className="h4 text-success"> {count} </span>
                <span className="h6"><i className="fa fa-play fa-rotate-270 text-warning"></i></span>
                <div className="small dashboard-title">{title}</div>
            </div>
            </div>
        )
        
    }

    const renderDashboard=()=>{
        const result=[]

        result.push(
            <>
            <div className="main-dashboard justify-content-between ">
                <h3 className="text-primary fw-bold m-3">Sales Dashboard <span className="text-danger">(KShs)</span></h3>
                
                
            </div>
            <hr  />
            
            <div className="row">
            
                <>
                    {createSection1(`This Hour (${todayHour.hour}) Sales`,mydashboardData ? mydashboardData.hourSales.toLocaleString() : 0,1)}
                    {createSection1(`Today's Sales `,mydashboardData ? mydashboardData.todaySales.toLocaleString() : 0,2)}
                    {createSection1('This Week Sales',mydashboardData ? mydashboardData.weekSales.toLocaleString() :0,3)}
                    {createSection1('This Month Sales',mydashboardData ? mydashboardData.monthSales.toLocaleString() :0,4)}

                </>
                
            <hr  />
            
            </div>
            </>
        )

        result.push(
            <>
            <div className="main-dashboard justify-content-between ">
                <h3 className="text-success fw-bold m-3 ">Medicine Dashboard</h3>
                
                
            </div>
            <hr  />
            
            <div className="row">
            
                <>
                    {createSection1('Total Overall Drugs',mydashboardData ? mydashboardData.overal.toLocaleString() : 0,5)}
                    {createSection1('M01AB Drugs',mydashboardData ? mydashboardData.M01AB.toLocaleString() : 0,6)}
                    {createSection1('M01AE Drugs',mydashboardData ? mydashboardData.M01AE.toLocaleString() : 0,7)}
                    {createSection1('N05C Drugs',mydashboardData ? mydashboardData.N05C.toLocaleString() : 0,8)}
                    {createSection1('N05B Drugs',mydashboardData ? mydashboardData.N05B.toLocaleString() : 0,9)}
                    {createSection1('R03 Drugs',mydashboardData ? mydashboardData.R03.toLocaleString() : 0,10)}
                    {createSection1('R06 Drugs',mydashboardData ? mydashboardData.R06.toLocaleString() : 0,11)}
                    {createSection1('N02BE Drugs',mydashboardData ? mydashboardData.N02BE.toLocaleString() : 0,12)}
                    {createSection1('N02BA Drugs',mydashboardData ? mydashboardData.N02BA.toLocaleString() : 0,12)}
                    {createSection1('Expired Drugs',mydashboardData ? mydashboardData.expiredDrugs.toLocaleString() : 0,13)}

                </>
                
            <hr  />
            
            </div>
            </>
        )

        

        return result
    }

    return(
        <>
        <Toaster 

        toastOptions={{
            success:{
                style:{
                    background:'green',
                    color:'white',
                }
            },
            error:{
                style:{
                    background:'red',
                    color:'white'
                }
            },
            
        }}

        >
        </Toaster>
        <div className= 'container'> 
            <section id= 'first' className="nav_section">
            {
                renderDashboard()
            }
            </section>
            
        </div>
        </>
    )
    
}