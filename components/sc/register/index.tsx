'use client'

import { useRouter } from "next/navigation";
import React from "react";
import toast, {Toaster} from 'react-hot-toast'
import axios from "axios";

let initialState = {
    firstName: "",
    email:"",
    pharmacy:"",
    lastName:"",
    mobile:"",
};

export default function NewPharmacy(){

    const [formData, setFormData] = React.useState(initialState);
    let toastId:any

    const router=useRouter()

    const validate=async()=>{

        if(
            !formData.email ||
            !formData.pharmacy ||
            !formData.lastName ||
            !formData.mobile ||
            !formData.firstName 
            ){
            toast.error("Please fill all required fields",{
                id:toastId
            })
            return false
        }

        if(
            !formData.email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
            ){
                toast.error('Please enter a valid email address',{id:toastId})
                return false
        }

        if (isNaN(formData.mobile)) {
            toast.error("Invalid Contact Number",{
                id:toastId
            })
            return false
        }

        return true
    }

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        // if(e.target.files){
        //     setState({...state,[e.target.name]:e.target.files[0]})

        // }
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

            let response=await axios.post('/api/v1/controller/user?action=newPharmacy',formData)            
            toast.dismiss(toastId)
            if (response.data.success===true) {
                    
                toast.success(`Successful!`,{id:toastId})
                router.push('/')
            }
            else{
                
                toast.error(`Failed! ${response.data.message}`,{id:toastId})
            }

        }
        
    };

    return (
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
        <section className="gradient-custom">
            <div className="container py-5 ">
                <div className="row d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-dark text-white" style={{borderRadius: "1rem"}}>
                    <div className="card-body p-5 text-center">

                        <div className="mb-md-5 mt-md-4 pb-5">

                        <div className="logo mb-md-5 mt-md-4 pb-3 ">
                            <h1 className="logo-caption fw-bold"><span className="tweak">P</span>harmacy <span className="tweak">M</span>anagement <span className="tweak">S</span>ystem</h1>
                            <h2 className="logo-caption fw-bold"><span className="tweak">O</span>ne <span className="tweak">T</span>ime <span className="tweak">S</span>etup</h2>
                        </div>

                        <h2 className="fw-bold mb-3 text-uppercase text-warning">Sign Up</h2>
                        <p className="text-white-50 mb-5">Please enter necessary user & pharmacy details!</p>

                        <h6 className="fw-bold mb-3 text-uppercase text-warning">User Details</h6>


                        <div className="form-outline form-white mb-4">
                            <input type="text" name="firstName" className="form-control form-control-lg" onChange={handleInputChange} required/>
                            <label className="form-label">First Name</label>
                        </div>

                        <div className="form-outline form-white mb-4">
                            <input type="text" name="lastName" className="form-control form-control-lg" onChange={handleInputChange} required/>
                            <label className="form-label">Last Name</label>
                        </div>

                        <div className="form-outline form-white mb-4">
                            <input type="email" name="email" className="form-control form-control-lg" onChange={handleInputChange} required/>
                            <label className="form-label" >Email Address</label>
                        </div>

                        <h6 className="fw-bold mb-3 text-uppercase text-warning">Pharmacy Details</h6>

                        <div className="form-outline form-white mb-4">
                            <input type="text" name="pharmacy" className="form-control form-control-lg" onChange={handleInputChange} required/>
                            <label className="form-label" >Pharmacy Name</label>
                        </div>

                        <div className="form-outline form-white mb-4">
                            <input type="text" name="mobile" className="form-control form-control-lg" onChange={handleInputChange} required/>
                            <label className="form-label" >Contact Number</label>
                        </div>

                        <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={register}>Sign Up</button>

                        </div>

                        <div>
                        <p className="mb-0">Have an account? <a href="/" className="text-white-50 fw-bold">Sign In</a>
                        </p>
                        </div>

                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>

        </>
    )
}