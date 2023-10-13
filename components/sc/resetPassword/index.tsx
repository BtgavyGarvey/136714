'use client'

import { useRouter } from "next/navigation"
import React from "react"
import toast, {Toaster} from 'react-hot-toast'
import axios from 'axios';

let initialState = {
    password: "",
    email:"",
    confirmPassword:"",
    code:"",
};

export default function ForgotPassword(){

    const router=useRouter()
    let toastId:any

    const [formData, setFormData] = React.useState(initialState);


    const emailDiv=React.useRef<HTMLInputElement>(null)
    const codeDiv=React.useRef<HTMLInputElement>(null)
    const passwordDiv=React.useRef<HTMLInputElement>(null)
    const sendCodeBtn=React.useRef<HTMLInputElement>(null)
    const confirmCodeBtn=React.useRef<HTMLInputElement>(null)
    const resetPassBtn=React.useRef<HTMLInputElement>(null)

    const sendCode=async()=>{

        if (formData.email.trim() !=="") {

            try {
                toastId=toast.loading('Please wait. Loading...',{
                    id:toastId
                })

                const response=await axios.post('/api/v1/controller/user?action=forgotpassword',formData)
                toast.dismiss(toastId)
                if (response.data.success) {
                    toast.success(response.data.message)
                    if (emailDiv.current) emailDiv.current.style.pointerEvents='none'
                    if (codeDiv.current) codeDiv.current.style.display='block'
                    if (confirmCodeBtn.current) confirmCodeBtn.current.style.display='block'
                    if (sendCodeBtn.current) sendCodeBtn.current.style.display='none'
                }
                else{
                    toast.error(response.data.message,{
                        id:toastId
                    })
                }
            } catch (error) {
                console.log(error);
            }
            
        } else {
            toastId=toast.error('Please enter email',{
                id:toastId
            })
        }

    }

    const confirmCode=async()=>{

        if (codeDiv.current) codeDiv.current.style.pointerEvents='none'
        if (passwordDiv.current) passwordDiv.current.style.display='block'
        if (resetPassBtn.current) resetPassBtn.current.style.display='block'
        if (confirmCodeBtn.current) confirmCodeBtn.current.style.display='none'

        if (formData.code.trim() !=="") {

            const data={
                code:formData.code,
                username:formData.email
            }

            try {
                toastId=toast.loading('Please wait. Loading...',{
                    id:toastId
                })

                const response=await axios.post(`/api/v1/controller/user?action=checkcode`,data)
                toast.dismiss(toastId)
                if (response.data.success) {
                    if (codeDiv.current) codeDiv.current.style.pointerEvents='none'
                    if (passwordDiv.current) passwordDiv.current.style.display='block'
                    if (resetPassBtn.current) resetPassBtn.current.style.display='block'
                    if (confirmCodeBtn.current) confirmCodeBtn.current.style.display='none'
                }
                else{
                    toast.error(response.data.message,{
                        id:toastId
                    })
                }
            } catch (error) {
                console.log(error);
            }
            
        } else {
            toastId=toast.error('Please enter confirmation code',{
                id:toastId
            })
        }
    }

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resetPass=async(e: { preventDefault: () => void; })=>{

        e.preventDefault()
        
        if (formData.password.trim() !=="") {

            if ((formData.password).length<8) {
                toastId=toast.error(`Password must be atleast 8 characters`,{
                    id:toastId
                })
                return
                
            }

            if (formData.confirmPassword.trim() !=="") {

                if (formData.password===formData.confirmPassword) {

                    try {
                        toastId=toast.loading('Please wait. Loading...',{
                            id:toastId
                        })
        
                        const response=await axios.put(`/api/v1/controller/user?action=resetPassword`,formData)
                        toast.dismiss(toastId)
                        if (response.data.success) {
                            toast.success(response.data.message,{
                                id:toastId
                            })
                            router.push('/')
                        }
                        else{
                            toast.error(response.data.message,{
                                id:toastId
                            })
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    toast.error(`Password don't match`,{
                        id:toastId
                    })
                }
            
            } else {
                toastId=toast.error('Please confirm your password',{
                id:toastId
            })
            }
            
        } else {
            toastId=toast.error('Please enter new password',{
                id:toastId
            })
        }
        
    }

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

                        <h2 className="fw-bold mb-3 text-uppercase text-warning">Reset Password</h2>
                        <p className="text-white-50 mb-5">Please enter your email to proceed!</p>

                        <div ref={emailDiv} className="form-outline form-white mb-4">
                            <input type="email" name="email" className="form-control form-control-lg" 
                            onChange={handleInputChange}
                            required
                            />
                            <label className="form-label" >Email Address</label>
                        </div>

                        <div ref={codeDiv} className="form-outline form-white mb-4 dblock">
                            <input type="text" name="code" className="form-control form-control-lg" 
                            onChange={handleInputChange}
                            required
                            />
                            <label className="form-label" >Confirmation Code</label>
                        </div>

                        <div ref={passwordDiv} className="dblock">
                            <div className="form-outline form-white mb-4">
                                <input type="password" name="password" className="form-control form-control-lg" 
                                onChange={handleInputChange}
                                required
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                title='Must contain at least one number an one uppercase and lowercase letter, and at least 8 or more characters'
                                />
                                <label className="form-label">New Password</label>
                            </div>

                            <div className="form-outline form-white mb-4">
                                <input type="password" name="confirmPassword" className="form-control form-control-lg" 
                                onChange={handleInputChange}
                                autoComplete='new-password'
                                required
                                />
                                <label className="form-label">Confirm Password</label>
                            </div>
                        </div>

                        <div ref={sendCodeBtn}>
                            <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={sendCode}>Send Code</button>
                        </div>
                        <div ref={confirmCodeBtn} className="dblock">
                            <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={confirmCode}>Confirm Code</button>
                        </div>
                        <div ref={resetPassBtn} className="dblock">
                            <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={resetPass}>Reset Password</button>
                        </div>

                        </div>

                        <div>
                        <p className="mb-0"><a href="/" className="text-white-50 fw-bold">Sign In</a>
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