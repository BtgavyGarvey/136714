'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons/faTrashAlt"
import React from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { DayTime } from "../../../layout/topNav"


export default function ViewMedicinePage({pharm}:any) {

    const pharmacyName=pharm.name

    let toastId:any

    const router=useRouter()

    const [medicineData, setMedicineData]=React.useState([])

    React.useEffect(()=>{
        getMedicineData()
    },[])

    const getMedicineData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let response=await axios.get(`/api/v1/controller/medicine?action=getMedicineData&pharmacy=${pharm.id}`)            
        toast.dismiss(toastId)
        if (response.data.success===true) {
          toast.success(`Successful!`,{id:toastId})
          setMedicineData(response.data.drugs)
        }
        else{
            
            toast.error(`Failed! ${response.data.message}`,{id:toastId})
        }
    }

    const getTableData=()=>{

        const result=[]


        for (let i = 0; i < medicineData.length; i++) {
            result.push(
                <>
                <tr>
                <td>{medicineData[i].batchNumber}</td>
                <td>{medicineData[i].medicineName}</td>
                <td>{medicineData[i].dosageForm}</td>
                <td>{medicineData[i].medicineCategory}</td>
                <td>{medicineData[i].availableQuantity}</td>
                <td>{medicineData[i].costPerUnit}</td>
                <td>{(DayTime(medicineData[i].expiresAt))}</td>
                <td><a title='Edit'><FontAwesomeIcon icon={faEdit} className="text-warning"/></a></td>
                <td><a title="Delete"><FontAwesomeIcon icon={faTrashAlt} className="text-danger"/></a></td>
                </tr>
    
                </>
            )
    
        }

        return result
    }
    
    const renderReportDashboard=()=>{
        const result=[]

        result.push(
            <>
            <div className="main-dashboard justify-content-between ">
                <h3 className="text-success fw-bold m-3 ">Medicine Report Dashboard</h3>
            </div>
            <hr  />
            
            <div className="row">

            <div className="col col-md-12 table-responsive p-3">
            <div className="table-responsive">
            	<table className="table table-bordered table-striped table-hover ">
                    <thead >
                        <tr className="bg-secondary">
                        <th>Batch Number</th>
                        <th>Medicine Name</th>
                        <th>Dosage Form</th>
                        <th>Category</th>
                        <th>Ava. Quantity</th>
                        <th>Cost Per Unit</th>
                        <th>Expiry Date</th>
                        <th colSpan={'2'}>Actions</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {
                            getTableData()
                        }
                    </tbody>
                </table>
                </div>
                </div>
            
                
                
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
            <section id= 'third' className="nav_section">
            {
                renderReportDashboard()
            }
            </section>
            
        </div>
        </>
    )
    
}