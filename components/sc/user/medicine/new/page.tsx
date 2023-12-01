'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import React from "react"
import toast, { Toaster } from "react-hot-toast"

const initialState={
  batchNumber:'',
  medicineName:'',
  dosageForm:'',
  medicineCategory:'',
  expiresAt:'',
  costPerUnit:'',
  pharmacy:'',
  availableQuantity:'',
}

export default function NewMedicinePage({pharm}:any) {

    const pharmacyName=pharm.name

    initialState.pharmacy=pharm.id

    const dateInput=React.useRef()

    let toastId:any

    const router=useRouter()

    const [formData, setFormData]=React.useState(initialState)

    const validate=async()=>{

      if(
          !formData.batchNumber ||
          !formData.medicineName ||
          !formData.dosageForm ||
          !formData.medicineCategory ||
          !formData.costPerUnit ||
          !formData.availableQuantity ||
          !formData.expiresAt 
          ){
          toast.error("Please fill all required fields",{
              id:toastId
          })
          return false
      }

      if(isNaN(formData.costPerUnit) || isNaN(formData.availableQuantity)){
          toast.error("Invalid cost or quantity input",{
              id:toastId
          })
          return false
      }

      return true
  }

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
      
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  const register = async (e: { preventDefault: () => void; }) => {

      e.preventDefault()

      const valid=await validate()

      if (valid) {
          toastId=toast.loading('Loading, please wait...',{
              id:toastId
          })

          let response=await axios.post('/api/v1/controller/medicine?action=newMedicine',formData)            
          toast.dismiss(toastId)
          if (response.data.success===true) {
            toast.success(`Successful!`,{id:toastId})
          }
          else{
              
              toast.error(`Failed! ${response.data.message}`,{id:toastId})
          }

      }
      
  };

  React.useEffect(()=>{
    var today = new Date().toISOString().split('T')[0];
    dateInput.current.setAttribute('min', today);
  },[])

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
          <section id= 'second' className="nav_section">
            
          <div className="main-dashboard ">
            <div className="col col-md-12 d-flex justify-content-center ">
            <h3 className="text-success fw-bold m-3 ">New Medicine</h3>
            </div>
          </div>
          <div className="main-dashboard justify-content-center ">
          <div className="d-block">

          <div className="row col col-md-12 form-outline form-white mb-4">
            <div className="col col-md-6 form-group">
              <label className="fw-bold" >Medicine ID :</label>
              <input onChange={handleInputChange} type="text" className="form-control form-control-lg"  placeholder="Medicine ID" name="batchNumber"/>
            </div>

            <div className="col col-md-6 form-group">
              <label className="fw-bold" >Medicine Name :</label>
              <input onChange={handleInputChange} type="text" className="form-control form-control-lg"  placeholder="Medicine Name" name="medicineName"/>
            </div>
            
          </div>

          <div className="row col col-md-12 form-outline form-white mb-4">
            <div className="col col-md-6 form-group ">
              <label className="fw-bold" >Dosage Form :</label>
              <select onChange={handleInputChange} className="form-control form-control-lg" name='dosageForm'>
                <option></option>
                <option>Tablet</option>
                <option>Capsule</option>
                <option>Liquid</option>
                <option>Injection</option>
              </select>
            </div>

            <div className="col col-md-6 form-group">
              <label className="fw-bold">Category :</label>
              <select onChange={handleInputChange} className="form-control form-control-lg" name='medicineCategory'>
                <option></option>
                <option>M01AB</option>
                <option>M01AE</option>
                <option>N02BE</option>
                <option>N05B</option>
                <option>N05C</option>
                <option>R03</option>
                <option>R06</option>
                <option>N02BA</option>

              </select>
            </div>
          </div>

          <div className="row col col-md-12 form-outline form-white mb-4">

            <div className="col col-md-6 form-group">
              <label className="fw-bold">Expiry Date:</label>
              <input ref={dateInput} onChange={handleInputChange} type="date" className="form-control form-control-lg" name="expiresAt"/>
            </div>

            <div className="col col-md-6 form-group ">
              <label className="fw-bold" htmlFor="suppliers_name">Cost Per Unit:</label>
              <input onChange={handleInputChange} type="text" className="form-control form-control-lg"  name="costPerUnit" />
            </div>
          </div>

          <div className="row col col-md-12 form-outline form-white mb-4">

            <div className="col col-md-12 form-group ">
              <label className="fw-bold" htmlFor="suppliers_name">Quantity:</label>
              <input onChange={handleInputChange} type="text" className="form-control form-control-lg"  name="availableQuantity" />
            </div>
          </div>
         
          <hr />

          <div className="row col col-md-12 form-outline form-white mb-4">
            &emsp;
            <div className="form-group m-auto">
              <button className="btn btn-primary form-control fw-bold" onClick={register}>ADD NEW MEDICINE</button>
            </div>

          </div>

          </div>
          </div>

        </section>
          
      </div>
      </>
  )

}