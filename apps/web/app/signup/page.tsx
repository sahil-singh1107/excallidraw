"use client"
import React, { useState } from 'react'
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from "@repo/common/config"
import { z } from "zod"
import axios from 'axios';
import { useRouter } from 'next/navigation'
const Page = () => {

    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
        },
    });
    const router = useRouter()
    const {
        register,
        formState: { errors },
        reset,
        setError,
    } = form;

    async function onSubmit(values: z.infer<typeof UserSchema>) {
        if (!values.email || !values.firstName || !values.lastName || !values.password || !values.username) return;
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signup`, {
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
                email: values.email,
                password: values.password
            })
            reset();
            router.push("/signin");
        } catch (error: any) {
            if (error.response.data.message[0] === 'U') {
                setError("username", { message: error.response.data.message })
            }
            else {
                setError("email", { message: error.response.data.message })
            }
        }
    }

    return (
        <div className='bg-[#010100] min-h-screen h-dvh w-dvw flex justify-center overflow-hidden'>
            <div className='w-[50%] flex flex-col items-center justify-center'>
                <div className='flex flex-col items-center space-y-2'>
                    <span className='text-white text-xl'>Sign Up Account</span>
                    <span className='text-[#555555]'>Enter your personal details to create your account</span>
                </div>
                <form className='flex flex-col space-y-6 mt-16' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='flex space-x-3 items-center'>
                        <div className='flex flex-col space-y-1 text-[#808081] hover:text-white duration-200 hover:-translate-y-1 relative '>
                            <label htmlFor='firstname' className=' text-xs'>First Name</label>
                            <div className='relative'>
                                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-red-600 blur ${errors.firstName ? 'opacity-50' : 'opacity-0'}`}></div>
                                <div className='flex justify-end items-center relative'>
                                    <input {...register('firstName')} id='firstname' className='bg-[#1b1a1b] h-10 rounded-xl p-6 text-white' placeholder='John' />
                                    <MdDriveFileRenameOutline className='absolute mr-2 w-10' />
                                </div>
                            </div>

                            {errors.firstName && <p className='text-xs'>{errors.firstName.message}</p>}
                        </div>
                        <div className='flex flex-col space-y-1 text-[#808081] hover:text-white duration-200 hover:-translate-y-1'>
                            <label htmlFor='lastname' className='text-xs'>Last Name</label>
                            <div className='relative'>
                                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-red-600 blur ${errors.lastName ? 'opacity-50' : 'opacity-0'}`}></div>
                                <div className='flex justify-end items-center relative'>
                                    <input {...register('lastName')} id='lastname' className='bg-[#1b1a1b] h-10 rounded-xl p-6 text-white' placeholder='Doe' />
                                    <MdDriveFileRenameOutline className='absolute mr-2 w-10' />
                                </div>
                            </div>

                            {errors.lastName && <p className='text-xs'>{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div className='flex flex-col space-y-1 text-[#808081] hover:text-white duration-200 hover:-translate-y-1'>
                        <label htmlFor='username' className='text-xs'>Username</label>
                        <div className='relative'>
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-red-600 blur ${errors.username ? 'opacity-50' : 'opacity-0'}`}></div>
                            <div className='flex justify-end items-center relative'>
                                <input {...register('username')} id='username' className='w-full bg-[#1b1a1b] h-10 rounded-xl p-6 text-white' placeholder='john_doe' />
                                <FaRegUserCircle className='absolute mr-2 w-10' />
                            </div>
                        </div>

                        {errors.username && <p className='text-xs'>{errors.username.message}</p>}
                    </div>
                    <div className='flex flex-col space-y-1 text-[#808081] hover:text-white duration-200 hover:-translate-y-1'>
                        <label htmlFor='email' className='text-xs'>Email</label>
                        <div className='relative'>
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-red-600 blur ${errors.email ? 'opacity-50' : 'opacity-0'}`}></div>
                            <div className='flex justify-end items-center relative'>
                                <input {...register('email')} id='email' type='email' className='w-full bg-[#1b1a1b] h-10 rounded-xl p-6 text-white' placeholder='johndoe@gmail.com' />
                                <MdOutlineEmail className='absolute mr-2 w-10' />
                            </div>
                        </div>


                        {errors.email && <p className='text-xs'>{errors.email.message}</p>}
                    </div>
                    <div className='flex flex-col space-y-1 text-[#808081] hover:text-white duration-200 hover:-translate-y-1'>
                        <label htmlFor='password' className='text-xs'>Password</label>
                        <div className='relative'>
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-red-600 blur ${errors.password ? 'opacity-50' : 'opacity-0'}`}></div>
                        <div className='flex justify-end items-center relative'>
                            <input {...register('password')} id='password' type={showPassword ? "password" : "text"} className='w-full bg-[#1b1a1b] h-10 rounded-xl p-6 text-white' />
                            {
                                showPassword ? (<FaRegEye className='absolute mr-2 w-10 hover:cursor-pointer' onClick={() => setShowPassword((prev) => !prev)} />) : (<FaRegEyeSlash className='absolute mr-2 w-10 hover:cursor-pointer' onClick={() => setShowPassword((prev) => !prev)} />)
                            }
                            
                        </div>
                        </div>
                        
                        {errors.password && <p className='text-xs'>{errors.password.message}</p>}
                    </div>
                    <div className='relative group'>
                        <div className='absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur-md opacity-75 transition duration-200 group-hover:opacity-100'></div>
                        <button className='bg-white text-black w-full h-10 rounded-xl font-semibold relative focus:scale-[99.5%] transition duration-200' >Sign Up</button>
                    </div>

                </form>
                <span className='text-[#555555] text-center mt-2 flex'>Already have an account? <p className='text-white ml-2 hover:cursor-pointer' onClick={() => {
                    router.push("/signin")
                }}>Login</p></span>
            </div>
        </div>
    )
}

export default Page
