'use client'

import React from "react";
import {SignInResponse, signIn} from 'next-auth/react'
import toast, {Toaster} from 'react-hot-toast'
import { useRouter } from "next/navigation";

let initialState = {
    password: "",
    email:"",
};

export default function Login(){

    const [formData, setFormData] = React.useState(initialState);
    let toastId:any

    const router=useRouter()

    const validate=async()=>{

        if(!formData.email){
            toast.error("Username is required",{
                id:toastId
            })
            return false
        }

        if(!formData.password){
            toast.error("Password is required",{
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

    const login = async (e: { preventDefault: () => void; }) => {

        e.preventDefault()

        const valid=await validate()

        if (valid) {
            toastId=toast.loading('Loading, please wait...',{
                id:toastId
            })

            let info=await signIn('credentials',{
                username:formData.email,
                password:formData.password,
                redirect:false
            })
            toast.dismiss(toastId)
        
            if ((info && !info.ok)) {
                toastId=toast.error(info.error,{
                    id:toastId
                })
            }

            router.push('/sc/user/dashboard')
        }
        
    };


    return (
        <>
        <section className="gradient-custom">
            <div className="container py-5 ">
                <div className="row d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="card bg-dark text-white" style={{borderRadius: "1rem"}}>
                    <div className="card-body p-5 text-center">

                        <div className="mb-md-5 mt-md-4 pb-5">

                        <div className="logo mb-md-5 mt-md-4 pb-3">
                            <h1 className="logo-caption fw-bold"><span className="tweak">P</span>harmacy <span className="tweak">M</span>anagement <span className="tweak">S</span>ystem</h1>
                        </div>

                        <h2 className="fw-bold mb-3 text-uppercase text-warning">Login</h2>
                        <p className="text-white-50 mb-5">Please enter your email and password!</p>

                        <div className="form-outline form-white mb-4">
                            <input type="email" name="email" className="form-control form-control-lg" 
                            onChange={handleInputChange}
                            autoFocus
                            autoComplete='false' 

                            />
                            <label className="form-label" >Email Address</label>
                        </div>

                        <div className="form-outline form-white mb-4">
                            <input type="password" name="password" className="form-control form-control-lg" 
                            onChange={handleInputChange}
                            autoFocus
                            autoComplete='false'
                            />
                            <label className="form-label">Password</label>
                        </div>

                        <p className="small mb-5 pb-lg-2"><a className="text-white-50" href="/sc/resetpassword">Forgot password?</a></p>

                        <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={login}>Login</button>

                        {/* <div className="d-flex justify-content-center text-center mt-4 pt-1">
                            <a href="#!" className="text-white"><i className="fab fa-facebook-f fa-lg"></i></a>
                            <a href="#!" className="text-white"><i className="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                            <a href="#!" className="text-white"><i className="fab fa-google fa-lg"></i></a>
                        </div> */}

                        </div>

                        <div>
                        <p className="mb-0">Don't have an account? <a href="/sc/register" className="text-white-50 fw-bold">Sign Up</a>
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