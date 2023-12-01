'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons/faTrashAlt"
import React from "react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { DayTime } from "../../layout/topNav"
import { signOut } from "next-auth/react"

let tempQuantity: Number | null=null
let myId:any
export default function ViewUserPage({pharm}:any) {

    const pharmacyName=pharm.name

    let toastId:any


    const router=useRouter()
    const dialogBox=React.useRef()

    const [userData, setUserData]=React.useState([])
    const [oneUserData, setOneUserData]=React.useState()

    React.useEffect(()=>{
        dialogBox.current.close()
        getUserData()
    },[])

    const getUserData=async()=>{
        toastId=toast.loading('Loading, please wait...',{
            id:toastId
        })

        let response=await axios.get(`/api/v1/controller/user?action=getUserData&pharmacy=${pharm.id}`)            
        toast.dismiss(toastId)
        if (response.data.success===true) {
          toast.success(`Successful!`,{id:toastId})
          setUserData(response.data.users)
        }
        else{
            
            toast.error(`Failed! ${response.data.message}`,{id:toastId})
        }
    }

    const oneUser=(data:any)=>{
        tempQuantity=data.availableQuantity
        setOneUserData(data)
        dialogBox.current.showModal()

    }

    const deleteUser=async(pharmacy:any, username:any)=>{

        let answer=confirm(`Are you sure you want to delete user with username: ${username}`)
        if (myId === pharm.user) {
            toast.error('Failed!!! Access Denied')
            return
        }
        else{
            if (answer) {
                toastId=toast.loading('Loading, please wait...',{
                    id:toastId
                })
        
                let response=await axios.delete(`/api/v1/controller/user?action=deleteUserData&pharmacy=${pharmacy}&username=${username}`)            
                toast.dismiss(toastId)
                if (response.data.success===true) {
                    toast.success(`Successful!`,{id:toastId})
                    getUserData()
                }
                else{
                    toast.error(`Failed! ${response.data.message}`,{id:toastId})
                }
            }
        }
        
    }

    const getTableData=()=>{

        const result=[]

        if (userData.length>0) {
            for (let i = 0; i < userData.length; i++) {
                result.push(
                    <>
                    <tr>
                    <td>{userData[i].username}</td>
                    <td>{userData[i].firstName}</td>
                    <td>{userData[i].lastName}</td>
                    <td>{userData[i].email}</td>
                    <td>{userData[i].role}</td>
                    {
                        pharm.role==='Administrator' &&(
                            <>
                    <td><a title='Edit' onClick={(e)=>{oneUser(userData[i])}}><FontAwesomeIcon icon={faEdit} className="editA text-warning"/></a></td>
                    <td><a title="Delete" onClick={(e)=>{
                        myId=userData[i].id
                        deleteUser(userData[i].pharmacy, userData[i].username)
                        }}><FontAwesomeIcon icon={faTrashAlt} className="editA text-danger"/></a>
                    </td>
                            </>
                        )
                    }
                    
                    </tr>
        
                    </>
                )
        
            }
        }

        return result
    }
    
    const renderReportDashboard=()=>{
        const result=[]

        result.push(
            <>
            <div className="main-dashboard ">
            <div className="col col-md-10 d-flex justify-content-center ">
            <h3 className="text-success fw-bold m-3 ">Users Report Dashboard</h3>
            </div>
            <div className="col col-md-2 m-3 d-flex justify-content-start">
                {
                    pharm.role==='Administrator' && (
                        <a href="/sc/user/new#seventh" className="fw-bold text-dark">New User</a>
                    )
                }
            </div>
          </div>
            <hr  />
            
            <div className="row">

            <div className="col col-md-12 table-responsive p-3">
            <div className="table-responsive">
            	<table className="table table-bordered table-striped table-hover ">
                    <thead >
                        <tr className="bg-secondary">
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email Address</th>
                        <th>Role</th>
                        {
                            pharm.role ==='Administrator' && (
                        <th colSpan={'2'}>Actions</th>

                        )
                        }
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
        setOneUserData({ ...oneUserData, [name]: value });

    }

    const saveEdit=async(val:any)=>{

        if (val===0) {
            dialogBox.current.close()
        }
        else{
            toastId=toast.loading('Loading, please wait...',{
                id:toastId
            })
    
            let response=await axios.patch(`/api/v1/controller/user?action=editUserData`,oneUserData)            
            toast.dismiss(toastId)
            if (response.data.success===true) {
              toast.success(`Successful!`,{id:toastId})
              getUserData()
                dialogBox.current.close()

                if (pharm.user === oneUserData.id) {

                    if (pharm.role !== oneUserData.role) {
                        await signOut()
                        router.push('/')
                    }
                    
                }

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
            <section id= 'sixth' className="nav_section">
            <div>
                {
                    renderReportDashboard()
                }
                <dialog className="dialog1"  ref={dialogBox}>
                    {
                        oneUserData && (
                            <>
                            <div className="d-flex justify-content-end">
                                <span><span className='fw-bold'>Username: </span> {oneUserData.username}</span>
                            </div>
                            <div className="main-dashboard justify-content-center">
                            <h3 className="text-danger fw-bold">{oneUserData.firstName} {oneUserData.lastName}</h3>
                            </div>
                            <div className="row col col-md-12 form-outline form-white mb-4">
                                <div className="col col-md-6 form-group">
                                <label className="fw-bold" >First Name :</label>
                                <input onChange={handleInputChange} type="text" className="form-control form-control-lg"  value={oneUserData.firstName} name="firstName"/>
                                </div>

                                <div className="col col-md-6 form-group">
                                <label className="fw-bold" >Last Name :</label>
                                <input onChange={handleInputChange} type="text" className="form-control form-control-lg"  value={oneUserData.lastName} name="lastName"/>
                                </div>
                                
                            </div>
                            <div className="row col col-md-12 form-outline form-white mb-4">
                                <div style={{pointerEvents:'none'}} className="col col-md-6 form-group">
                                <label className="fw-bold" >Email Address :</label>
                                <input  onChange={handleInputChange} type="email" className="form-control form-control-lg"  value={oneUserData.email} name="email" disabled/>
                                </div>

                                <div className="col col-md-6 form-group">
                                <label className="fw-bold" >Role :</label>
                                <select onChange={handleInputChange} className="form-control form-control-lg" name='role'>
                                    <option>{oneUserData.role}</option>
                                    <option value={'Pharmacist'}>Pharmacist</option>
                                    <option value={'Administrator'}>Administrator</option>
                                </select>
                                
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