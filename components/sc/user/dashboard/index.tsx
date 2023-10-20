'use client'

import { signOut } from "next-auth/react"
import NavigationBar from "../../layout/topNav"
import Link from "next/link"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard({pharm}:any) {

    const pharmacyName=pharm.name

    const router=useRouter()

    const createSection1=(location:string, title: string, count = 0,key:any)=> { 
                    
        return(
            <div key={key} className="col-xs-12 col-sm-12 col-md-12 col-lg-3 fw-bold text-start text-wrap text-break" >
            <div className="dashboard-stats" onClick={()=>router.push(location)}>
                <Link className="text-dark text-decoration-none" href={`#`}>
                <span className="h4 text-success"> {count} </span>
                <span className="h6"><i className="fa fa-play fa-rotate-270 text-warning"></i></span>
                <div className="small dashboard-title">{title}</div>
                </Link>
            </div>
            </div>
        )
        
    }

    const renderDashboard=()=>{
        const result=[]

        result.push(
            <>
            <div className="main-dashboard justify-content-between ">
                <h3 className="text-success fw-bold m-3 ">Main Dashboard</h3>
                
                
            </div>
            <hr  />
            
            <div className="row">
            
                <>
                    {createSection1('#', 'Total Overall Members',0,1)}
                    {createSection1('#', 'Total Overall Members',0,2)}
                    {createSection1('#', 'Total Overall Members',0,3)}
                    {createSection1('#', 'Total Overall Members',0,4)}
                    {createSection1('#', 'Total Overall Members',0,5)}
                    {createSection1('#', 'Total Overall Members',0,6)}
                    {createSection1('#', 'Total Overall Members',0,7)}
                    {createSection1('#', 'Total Overall Members',0,8)}

                </>
                
            <hr  />
            
            </div>
            </>
        )

        return result
    }

    return(
        <>
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