"use client";

import React, {  useEffect, useState } from 'react';
import {useRouter} from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from '@/redux/store';
import { loginWithGoogle, loginUser, listenForAuthChanges } from '@/features/auth/authSlice';
import Link from 'next/link';


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [remeberMe, setRemeberMe] = useState<boolean>(false);
    const [isLogged,setIslogged] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const Router = useRouter();

    useEffect(() => {
        dispatch(listenForAuthChanges());
    }, [dispatch]);

    const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
    useEffect(() => {
        console.log(user);
        if (user) {
            Router.push('/');
        } else {
            setIslogged(true);
        }
    }, [user, Router]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const res = await dispatch(loginUser({ email, password,remeberMe }));
        if (loginUser.rejected.match(res)) {
            toast.error(res.payload as string);
        } else if (loginUser.fulfilled.match(res)) {
            toast.success(`Welcome back ${res.payload.email}`);
            Router.replace('/');
        }
    };

    
    const handleGoogleSignin = async () => {
        const res = await dispatch(loginWithGoogle());
        if (loginWithGoogle.rejected.match(res)) {
            toast.error(res.payload as string);
            Router.replace('/login');
        } else if (loginWithGoogle.fulfilled.match(res)) {
            toast.success(`Welcome back ${res.payload.email}`);
            Router.replace('/');
        }
    };


    return isLogged ?  (
        <div className="flex flex-col items-center justify-center h-[93.3vh] bg-dark-secondary">
               <Toaster />
            <div className="bg-gray-700 p-8 rounded-lg shadow-md sm:w-full sm:max-w-md ">
                <div className='mb-6 flex flex-col gap-3'>
                      <h2 className="text-4xl text-white font-bold">Welcome </h2>
                      <span className=' text-white text-sm text-white/50'>Please enter your details</span>
                </div>
              

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input type="email" id="email" name="email" placeholder='Email Address' required   onChange={(e)=>{setEmail(e.target.value)}} className="mt-1 block w-full px-4 py-3 bg-dark-secondary   rounded-md shadow-sm focus:outline-none text-white/80   focus:ring-theme-primary focus:border-theme-primary sm:text-sm placeholder:text-[0.9rem]" />
                    </div>
                    <div className="mb-8">
                        <input type="password" id="password" name="password" placeholder='Password'  onChange={(e)=>{setPassword(e.target.value)}} required className="mt-1 block w-full px-4 py-3 bg-dark-secondary rounded-md shadow-sm focus:outline-none text-white/80 focus:ring-theme-primary focus:border-theme-primary sm:text-sm placeholder:text-[0.9rem]" />
                    </div>
                    <div className='flex justify-between items-center mb-8'>
                       <div className='flex  gap-3'>
                         <input type="checkbox" onChange={(e) =>  setRemeberMe(!remeberMe)} />
                         <label className='text-white/80 text-[0.9rem]' >Remember me </label>
                        </div>
                        <span className='text-theme-primary underline text-sm'>Forgot password</span>
                    </div>
                  
                      
                     
                    <button type="submit" className="w-full py-2 px-4 bg-theme-primary text-white rounded-sm hover:bg-theme-primary/80 disabled:opacity-60 mb-8">Sign in </button>
                    <button type='button' onClick={() => handleGoogleSignin()}  className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white  rounded-sm hover:bg-white/90 transition-all duration-300 disabled:opacity-60">
                       <img src="./google.webp" alt="google icon" className='w-5'/>
                        Sign in with Google
                    </button>
                    <Link href='/signup' className='block w-full text-center text-white/80 mt-6'>D'ont have an account? <span className='underline text-theme-primary'>Sign up</span></Link>

                </form>
            </div>
        </div>
     ) : <div className='bg-dark-primary w-full h-[93.3vh]'></div>;
};

export default  LoginPage;
