'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import React from "react"
import toast, { Toaster } from "react-hot-toast"

const initialState={
  firstName:'',
  lastName:'',
  role:'',
  email:'',
  pharmacy:'',
}

export default function NewUserPage({pharm}:any) {

    const pharmacyName=pharm.name

    initialState.pharmacy=pharm.id

    let toastId:any

    const router=useRouter()

    const [formData, setFormData]=React.useState(initialState)

    const validate=async()=>{

      if(
          !formData.firstName ||
          !formData.lastName ||
          !formData.role ||
          !formData.email
          ){
          toast.error("Please fill all required fields",{
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

          let response=await axios.post('/api/v1/controller/user?action=newUser',formData)            
          toast.dismiss(toastId)
          if (response.data.success===true) {
            toast.success(`Successful!`,{id:toastId})
          }
          else{
              
              toast.error(`Failed! ${response.data.message}`,{id:toastId})
          }

      }
      
  };

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
          <section id= 'seventh' className="nav_section">
          <div className="main-dashboard justify-content-center ">
              <h3 className="text-success fw-bold m-3 ">New User</h3>
          </div>
          <div className="main-dashboard justify-content-center ">
          <div className="d-block">

          <div className="row col col-md-12 form-outline form-white mb-4">
            <div className="col col-md-6 form-group">
              <label className="fw-bold" >First Name :</label>
              <input onChange={handleInputChange} type="text" className="form-control form-control-lg"  placeholder="first name" name="firstName"/>
            </div>

            <div className="col col-md-6 form-group">
              <label className="fw-bold" >Last Name :</label>
              <input onChange={handleInputChange} type="text" className="form-control form-control-lg"  placeholder="last name" name="lastName"/>
            </div>
            
          </div>

          <div className="row col col-md-12 form-outline form-white mb-4">
          <div className="col col-md-6 form-group">
              <label className="fw-bold" >Email Address :</label>
              <input onChange={handleInputChange} type="email" className="form-control form-control-lg"  placeholder="user email" name="email"/>
            </div>

            <div className="col col-md-6 form-group">
              <label className="fw-bold">Role :</label>
              <select onChange={handleInputChange} className="form-control form-control-lg" name='role'>
                <option></option>
                <option>Pharmacist</option>
                <option>Administrator</option>
              </select>
            </div>
          </div>

          <hr />

          <div className="row col col-md-12 form-outline form-white mb-4">
            &emsp;
            <div className="form-group m-auto">
              <button className="btn btn-primary form-control fw-bold" onClick={register}>ADD NEW USER</button>
            </div>

          </div>

          </div>
          </div>

        </section>
          
      </div>
      </>
  )

}