'use client'

import { faDashboard } from "@fortawesome/free-solid-svg-icons"
import { faAdd } from "@fortawesome/free-solid-svg-icons/faAdd"
import { faBookMedical } from "@fortawesome/free-solid-svg-icons/faBookMedical"
import { faFileMedicalAlt } from "@fortawesome/free-solid-svg-icons/faFileMedicalAlt"
import { faLaptopMedical } from "@fortawesome/free-solid-svg-icons/faLaptopMedical"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function  SideNav({pharm}:any) {

    const pharmacyName=pharm.name

  return(
    <>
        <nav className="navbar bg-info shadow d-flex fixed-top justify-content-between">

            <div className="justify-content-start navbar-toggler-div" style={{gap:'0.5em',marginLeft:'3%'}}>
                <h3><span>{pharmacyName}</span></h3>
            </div>
            <div className="d-flex justify-content-end" style={{gap:'0.5em',marginRight:'1%'}}>
                <button className="btn btn-default text-danger fw-bold" onClick={signOut}>Log Out</button>
            </div>

        </nav> 

        <nav className="nav">
            <a href="/sc/user/dashboard#first" title="Dashboard"><FontAwesomeIcon icon={faDashboard}/></a>
            <a href="/sc/user/medicine/new#second" title="New Medicine"><FontAwesomeIcon icon={faAdd}/></a>
            <a href="/sc/user/medicine/view#third" title="Medicine Report"><FontAwesomeIcon icon={faBookMedical}/></a>
            <a href="/sc/user/medicine/sales#fourth" title="Make Sale"><FontAwesomeIcon icon={faFileMedicalAlt} /> </a>
            <a href="/sc/user/medicine/reports#fifth" title='Reports Dashboard'><FontAwesomeIcon icon={faLaptopMedical} /> </a>
        </nav>
        {/* <div className= 'container'> 
            <section id= 'first' className="nav_section">
                <h1>First</h1>
            </section>
            
            <section id= 'second' className="nav_section">
                <h1>Second</h1>
            </section>
            
            <section id= 'third' className="nav_section">
            <h1>Third</h1>
            </section>
            
            <section id= 'fourth' className="nav_section">
            <h1>Fourth</h1>
            </section>
        </div> */}

    </>
)

}