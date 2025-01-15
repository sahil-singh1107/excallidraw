"use client"
import React from 'react'
import SideBar from '../components/SideBar'
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SiginSchema } from "@repo/common/config"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import axios from 'axios';

const Page = () => {
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
        email : values.email,
        password : values.password
      })
      reset();
      localStorage.setItem("token", result.data.token);
      router.push("/");
    } catch (error) {
      console.log(error);    
    }
  }

  return (
    <div className='bg-[#010100] min-h-screen h-dvh w-dvw flex'>
      <div className='w-[60%]'>
        <SideBar />
      </div>
      <div className='w-[40%] flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center space-y-2'>
          <span className='text-white text-xl'>Log in to your Account</span>
        </div>
        <form className='flex flex-col space-y-6 mt-16 w-[80%]' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col space-y-1 text-[#808081] hover:text-white duration-200 hover:-translate-y-3'>
            <label htmlFor='email' className='text-xs'>Email</label>
            <div className='flex justify-end items-center relative'>
              <input {...register('email')} id='email' type='email' className='w-full bg-[#1b1a1b] h-10 rounded-xl p-6 text-white' placeholder='johndoe@gmail.com' />
              <MdOutlineEmail className='absolute mr-2 w-10' />
            </div>
            {errors.email && <p className='text-xs'>{errors.email.message}</p>}
          </div>
          <div className='flex flex-col space-y-1 text-[#808081] hover:text-white duration-200 hover:-translate-y-3'>
            <label htmlFor='password' className='text-xs'>Password</label>
            <div className='flex justify-end items-center relative'>
              <input {...register('password')} id='password' type='password' className='w-full bg-[#1b1a1b] h-10 rounded-xl p-6 text-white' />
              <FaRegEye className='absolute mr-2 w-10 hover:cursor-pointer' />
            </div>
            {errors.password && <p className='text-xs'>{errors.password.message}</p>}
          </div>
          <button className='bg-white text-black w-full h-10 rounded-xl font-semibold' >Sign Up</button>
        </form>
        <span className='text-[#555555] text-center mt-2 flex'>Dont have an account? <p className='text-white ml-2 hover:cursor-pointer' onClick={() => {
          router.push("/signup")
        }}>Signin</p></span>
      </div>
    </div>

  )
}

export default Page
