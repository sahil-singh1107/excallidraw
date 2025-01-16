"use client"
import React, { useState } from 'react'
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SiginSchema } from "@repo/common/config"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import axios from 'axios';

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof SiginSchema>>({
    resolver: zodResolver(SiginSchema),
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

  async function onSubmit(values: z.infer<typeof SiginSchema>) {
    if (!values.email || !values.password) return;
    try {
      const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signin`, {
        email: values.email,
        password: values.password
      })
      reset();
      localStorage.setItem("token", result.data.token);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='bg-[#010100] min-h-screen h-dvh w-dvw flex justify-center'>
      <div className='w-[50%] flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center space-y-2'>
          <span className='text-white text-xl'>Log in to your Account</span>
        </div>
        <form className='flex flex-col space-y-6 mt-16 w-[80%]' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col space-y-1 text-[#808081] hover:text-white duration-200 hover:-translate-y-1'>
            <label htmlFor='email' className='text-xs'>Email</label>
            <div className='relative'>
              <div className={`absolute bg-red-500 inset-0 rounded-xl blur opacity-0 ${errors.email && ' opacity-50'}`}></div>

              <div className='flex justify-end items-center'>
                <input {...register('email')} id='email' type='email' className='w-full relative bg-[#1b1a1b] h-10 rounded-xl p-6 text-white' placeholder='johndoe@gmail.com' />
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
                <input {...register('password')} id='password' type={showPassword ? "password" : "text"} className='w-full bg-[#1b1a1b] h-10 rounded-xl p-6 text-white transition duration-100' />
                {
                  showPassword ? (<FaRegEye className='absolute mr-2 w-10 hover:cursor-pointer' onClick={() => setShowPassword(prev => !prev)} />) : (<FaRegEyeSlash className='absolute mr-2 w-10 hover:cursor-pointer' onClick={() => { setShowPassword(prev => !prev) }} />)
                }

              </div>
            </div>

            {errors.password && <p className='text-xs'>{errors.password.message}</p>}
          </div>
          <div className='relative group'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur-md opacity-75 transition duration-200 group-hover:opacity-100'></div>

            <button className='bg-white text-black w-full h-10 rounded-xl font-semibold relative focus:scale-[99.5%]transition duration-200 '>Sign In</button>

          </div>
        </form>
        <span className='text-[#555555] text-center mt-2 flex'>Dont have an account? <p className='text-white ml-2 hover:cursor-pointer' onClick={() => {
          router.push("/signup")
        }}>Signin</p></span>
      </div>
    </div>

  )
}

export default Page
