'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons/faTrashAlt"
import React from "react"
import toast, {Toaster} from 'react-hot-toast'
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert'
import { render } from "react-dom"
import { DayTime } from "../../../layout/topNav"


let sellData: { [x: string]: number }[]=[]


export default function ViewMedicinePage({pharm}:any) {

    let toastId:any

    let checkRef={

    }
    let inputRef={

    }
    let totalState={

    }

    const [result, setResult]=React.useState([])

    const pharmacyName=pharm.name

    if (result) {

        (result: any) => [...Array(result)].map((_, i) =>{
            checkRef[`checkBox${i}`]=React.useRef()
            inputRef[`input${i}`]=React.useRef()
            totalState[`total${i}`]=''
        });

        // for (let i = 0; i < result.length; i++) {
            
        // }
    }

    React.useEffect(()=>{

        (result: { [x: string]: number }[]) => [...Array(result)].map((_, i) =>{
            inputRef[`input${i}`].current.readOnly=true
            saveBtn.current.disabled=true
            result[i]['quantitySold']=0
            result[i]['totalPrice']=0
        });

    },[])

    const paidAmount=React.useRef()
    const saveBtn=React.useRef()
    const [total, setTotal]=React.useState(totalState)
    const [change, setChange]=React.useState()
    const [total_Price, setTotal_Price]=React.useState(0)

    const router=useRouter()

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
        //   toast.success(`Successful!`,{id:toastId})
          setResult(response.data.drugs)
        }
        else{
            
            toast.error(`Failed! ${response.data.message}`,{id:toastId})
        }
    }

    const handleInputChange=(val:any)=>{

        const quantityEntered=inputRef[`input${val}`].current.value

        if (isNaN(quantityEntered)) {
            toast.error('Invalid Input',{id:toastId})
            return
        }
        else{

            if (quantityEntered > result[val]['quantity']) {
                toast.error('Insufficient Available Quantity',{id:toastId})
                return
            }

            let totalPrice=result[val].markedPrice * quantityEntered

            result[val]['quantitySold']=parseFloat(quantityEntered)
            result[val]['totalPrice']=parseFloat(totalPrice)

            setTotal((prev)=>({
                ...prev,
                [`total${val}`]:totalPrice
            }))

            Main()
        }

    }

    const checkChange=(val:any)=>{

        if (checkRef[`checkBox${val}`].current.checked) {
            inputRef[`input${val}`].current.readOnly=false
            inputRef[`input${val}`].current.focus()

            sellData.push(
                result[val]
            )

            setTotal((prev)=>({
                ...prev,
                [`total${val}`]:0
            }))
            
        }
        else{
            inputRef[`input${val}`].current.readOnly=true

            sellData.splice(val,1)

            setTotal((prev)=>({
                ...prev,
                [`total${val}`]:''
            }))

            inputRef[`input${val}`].current.value=''

            result[val]['quantitySold']=0
            result[val]['totalPrice']=0

            Main()
        }

    }

    const getTableData=()=>{
        const result1=[]

        if (result) {

            for (let i = 0; i < result.length; i++) {
                result1.push(
                    <>
                    <tr>
                    <td>{result[i].batchNumber}</td>
                    <td>{result[i].medicineName}</td>
                    <td>{result[i].availableQuantity}</td>
                    <td>{(DayTime(result[i].expiresAt))}</td>
                    <td>{result[i].costPerUnit}</td>
                    <td ><input ref={inputRef[`input${i}`]} type="text" className="form-control" onChange={(e)=>handleInputChange(i)}></input></td>
                    <td>{total[`total${i}`]}</td>
                    <td><input ref={checkRef[`checkBox${i}`]} type="checkbox" onChange={(e)=>checkChange(i)}></input></td>
                    </tr>
        
                    </>
                )
                
            }
            
        }

        

        return result1
    }

    const submit=()=>{
        
        console.log(sellData);

        // confirmAlert({
        //     customUI:({onClose})=>{
        //         return(
        //             <div className="custom-ui">
        //                 <h1>Successfull</h1>
        //                 <button className="btn btn-success fw-bold" onClick={onClose}>Close</button>
        //             </div>
        //         )
        //     }
        // })
        

    }
    
    const renderReportDashboard=()=>{
        const result=[]

        result.push(
            <>
            <div className="main-dashboard justify-content-between ">
                <h3 className="text-success fw-bold m-3 ">Medicine Sales Dashboard</h3>
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
                        <th>Ava. Quantity</th>
                        <th>Expiry Date</th>
                        <th>Cost</th>
                        <th style={{width:'15%'}}>Quantity Sold</th>
                        <th>Total Price</th>
                        <th style={{width:'3%'}}>Actions</th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {
                            getTableData()
                        }
                    </tbody>
                </table>
                

                </div>
                <div className="d-flex justify-content-end">
                    <div>
                    <label className="fw-bold">Total Amount</label>
                    <input type="text" value={total_Price} className="form-control form-control-lg text-primary fw-bold" readOnly={true}/>
                    </div>
                </div>
                </div>
                
            <hr  />

            <div className="d-flex justify-content-end">
                <div style={{width:'30%', gap:'1em'}} className="d-flex justify-content-between">
                    <div>
                    <label className="fw-bold">Paid Amount</label>
                    <input ref={paidAmount} type="text" className="form-control form-control-lg text-success fw-bold" onChange={(e)=>totalChange(total_Price)}/>
                    </div>
                    <div>
                    <label className="fw-bold">Change</label>
                    <input type="text" value={change} className="form-control form-control-lg text-danger fw-bold" readOnly={true}/>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-start p-3">
                <div style={{width:'30%', gap:'1em',marginLeft:'5%'}}>
                <button ref={saveBtn} className="btn btn-lg btn-primary" onClick={submit}>Save</button>
                </div>
            </div>
            
            </div>
            </>
        )

        return result
    }

    let myChange:any

    const totalChange=(val:any)=>{

        const paid_amount=paidAmount.current.value

        if (isNaN(paid_amount)) {
            toast.error('Invalid Paid Amount',{id:toastId})
            return
        }

        if (total_Price>0 && paid_amount>0) {

            myChange=paid_amount-val
            setChange(myChange)

            if (myChange>-1) {
                saveBtn.current.disabled=false
            }
            else{
                saveBtn.current.disabled=true
            }
        }
        else{
            setChange('')
            paidAmount.current.value=''

        }


    }


    const Main=()=>{

    let currentPrice=0

        for (let i = 0; i < sellData.length; i++) {
            currentPrice=currentPrice+sellData[i]['totalPrice']
        }

        setTotal_Price(currentPrice)

        totalChange(currentPrice)
       
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
            <section id= 'fourth' className="nav_section">
            {
                renderReportDashboard()
            }
        
            </section>
            
        </div>
        
        </>
    )
    
}