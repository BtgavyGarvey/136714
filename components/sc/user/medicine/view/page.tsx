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

let tempQuantity: Number | null=null

export default function ViewMedicinePage({pharm}:any) {

    const pharmacyName=pharm.name

    let toastId:any

    const router=useRouter()
    const dialogBox=React.useRef()

    const [medicineData, setMedicineData]=React.useState([])
    const [oneMedicineData, setOneMedicineData]=React.useState()

    React.useEffect(()=>{
        dialogBox.current.close()
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

    const oneMedicine=(data:any)=>{
        tempQuantity=data.availableQuantity
        setOneMedicineData(data)
        dialogBox.current.showModal()

    }

    const deleteMed=async(pharmacy:any, batchNumber:any)=>{

        let answer=confirm(`Are you sure you want to delete medicine with ID: ${batchNumber}`)

        if (answer) {
            toastId=toast.loading('Loading, please wait...',{
                id:toastId
            })
    
            let response=await axios.delete(`/api/v1/controller/medicine?action=deleteMedicineData&pharmacy=${pharmacy}&medID=${batchNumber}`)            
            toast.dismiss(toastId)
            if (response.data.success===true) {
                toast.success(`Successful!`,{id:toastId})
                getMedicineData()
            }
            else{
                toast.error(`Failed! ${response.data.message}`,{id:toastId})
            }
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
                <td><a title='Edit' onClick={(e)=>{oneMedicine(medicineData[i])}}><FontAwesomeIcon icon={faEdit} className="editA text-warning"/></a></td>
                <td><a title="Delete" onClick={(e)=>{deleteMed(medicineData[i].pharmacy, medicineData[i].batchNumber)}}><FontAwesomeIcon icon={faTrashAlt} className="editA text-danger"/></a></td>
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
                        <th>Medicine ID</th>
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

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
      
        const { name, value } = e.target;
        setOneMedicineData({ ...oneMedicineData, [name]: value });

        if (name==='newQuantity') {

            if (value > 0) {
                let a=parseFloat(tempQuantity)+parseFloat(value)
                setOneMedicineData({ ...oneMedicineData, ['availableQuantity']: a });
            }
            else{
                setOneMedicineData({ ...oneMedicineData, ['availableQuantity']: tempQuantity });
            }

        }
    }

    const saveEdit=async(val:any)=>{

        if (val===0) {
            dialogBox.current.close()
        }
        else{
            toastId=toast.loading('Loading, please wait...',{
                id:toastId
            })
    
            let response=await axios.patch(`/api/v1/controller/medicine?action=editMedicineData`,oneMedicineData)            
            toast.dismiss(toastId)
            if (response.data.success===true) {
              toast.success(`Successful!`,{id:toastId})
              getMedicineData()
                dialogBox.current.close()

            }
            else{
                toast.error(`Failed! ${response.data.message}`,{id:toastId})
            }
        }
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
            <div>
                {
                    renderReportDashboard()
                }
                <dialog className="dialog1"  ref={dialogBox}>
                    {
                        oneMedicineData && (
                            <>
                            <div className="d-flex justify-content-end">
                                <span><span className='fw-bold'>Medicine ID: </span> {oneMedicineData.batchNumber}</span>
                            </div>
                            <div className="main-dashboard justify-content-center">
                            <h3 className="text-danger fw-bold">{oneMedicineData.medicineName}</h3>
                            </div>
                            <div className="row col col-md-12 form-outline form-white mb-4">
                                <div className="col col-md-6 form-group">
                                <label className="fw-bold" >Medicine Name :</label>
                                <input onChange={handleInputChange} type="text" className="form-control form-control-lg"  value={oneMedicineData.medicineName} name="medicineName"/>
                                </div>

                                <div className="col col-md-6 form-group">
                                <label className="fw-bold" >Cost Per Unit :</label>
                                <input onChange={handleInputChange} type="number" className="form-control form-control-lg"  value={oneMedicineData.costPerUnit} name="costPerUnit"/>
                                </div>
                                
                            </div>
                            <div className="row col col-md-12 form-outline form-white mb-4">
                                <div style={{pointerEvents:'none'}} className="col col-md-6 form-group">
                                <label className="fw-bold" >Available Quantity :</label>
                                <input  onChange={handleInputChange} type="text" className="form-control form-control-lg"  value={oneMedicineData.availableQuantity} name="availableQuantity"/>
                                </div>

                                <div className="col col-md-6 form-group">
                                <label className="fw-bold" >New Quantity :</label>
                                <input onChange={handleInputChange} type="text" className="form-control form-control-lg" name="newQuantity"/>
                                </div>
                                
                            </div>
                            <div className="main-dashboard justify-content-center">
                                <button autoFocus className="btn btn-default btn-lg fw-bold" onClick={(e)=>{saveEdit(0)}}>CANCEL</button>
                                <button autoFocus className="btn btn-primary btn-lg fw-bold" onClick={(e)=>{saveEdit(1)}}>SAVE</button>
                                
                            </div>
                            </>
                        )
                    }
                    
                </dialog>
                
                </div>
            </section>
            
        </div>
        </>
    )
    
}