"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { listenForAuthChanges, signupWithEmail, signupWithGoogle } from "@/features/auth/authSlice";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import axios from "axios";
import {signupSchema} from "@/validation/formValidations"

interface Input {
  ref: React.RefObject<HTMLInputElement | null>;
  placeholder: string;
  name: string;
  type?: string;
}


const SignupPage: React.FC = () => {
  const [isSignedUp, setIsSignedUp] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const Router = useRouter();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [inputs] = useState<Input[]>([
    { ref: firstNameRef, placeholder: "First Name", name: "firstname" },
    { ref: lastNameRef, placeholder: "Last Name", name: "lastname" },
    { ref: usernameRef, placeholder: "Username", name: "username" },
    { ref: emailRef, placeholder: "Email Address", name: "email", type: "email" },
    { ref: passwordRef, placeholder: "Password", name: "password", type: "password" },
    { ref: confirmPasswordRef, placeholder: "Confirm Password", name: "confirmPassword", type: "password" },
  ]);
       useEffect(() => {
           dispatch(listenForAuthChanges());
       }, [dispatch]);
   
       const user = useSelector((state: { auth: { user: any } }) => state.auth.user);
       useEffect(() => {
           console.log(user);
           if (user) {
               Router.push('/');
           } else {
               setIsSignedUp(true);
           }
       }, [ Router]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    const uploadEndpoint = file.type.startsWith("video/")
      ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
      : `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

    try {
      const response = await axios.post(uploadEndpoint, formData);
      setAvatarUrl(response.data.secure_url);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload avatar");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userData = {
      firstname: firstNameRef.current?.value?.trim() || "",
      lastname: lastNameRef.current?.value?.trim() || "",
      username: usernameRef.current?.value?.trim() || "",
      email: emailRef.current?.value?.trim() || "",
      password: passwordRef.current?.value || "",
      confirmPassword: confirmPasswordRef.current?.value || "",
      avatar: avatarUrl,
    };

    try {
      setErrors({});
      const validationResult = await signupSchema.safeParseAsync(userData);
      
      if (!validationResult.success) {
        const newErrors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          const path = err.path[0];
          if (path && !newErrors[path]) {
            newErrors[path] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }

      const res = await dispatch(signupWithEmail(userData));
      
      if (signupWithEmail.rejected.match(res)) {
        toast.error(res.payload as string, {duration:500});
      } else if (signupWithEmail.fulfilled.match(res)) {
        toast.success(`Welcome ${res.payload.email}`);
        Router.replace('/');
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    const res = await dispatch(signupWithGoogle());
    if (signupWithGoogle.rejected.match(res)) {
      toast.error(res.payload as string);
    } else if (signupWithGoogle.fulfilled.match(res)) {
      toast.success(`Welcome ${res.payload.email}`);
      Router.replace('/');
    }
  };

  const handleInputChange = (field: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return isSignedUp ? (
    <div className="flex flex-col items-center pt-6 min-h-screen bg-dark-secondary px-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="bg-gray-700 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl text-white font-bold mb-4">Create Account</h2>
        <form onSubmit={handleSignup} className="grid grid-cols-1 gap-4">
          {inputs.map(({ ref, placeholder, name, type = "text" }) => (
            <div key={name}>
              <input
                onChange={() => handleInputChange(name)}
                type={type}
                placeholder={placeholder}
                ref={ref}
                className="w-full px-4 py-3 bg-dark-secondary rounded-md text-sm text-white/80 focus:ring-theme-primary"
              />
              {errors[name] && <p className="text-red-400 text-sm mt-2">{errors[name]} *</p>}
            </div>
          ))}
          <input type="file" ref={avatarRef} onChange={handleAvatarUpload} className="text-white" />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-theme-primary text-white rounded-sm hover:bg-theme-primary/80 disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
          <button
            type='button'
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-white rounded-sm hover:bg-white/90 transition-all duration-300 disabled:opacity-60"
          >
            <img src="./google.webp" alt="google icon" className='w-5' />
            Sign in with Google
          </button>
          <Link href='/login' className='block w-full text-center text-white/80 mt-6'>
            Already have an account? <span className='underline text-theme-primary'>login</span>
          </Link>
        </form>
      </div>
    </div>
  ) : (
    <div className="bg-dark-primary w-full h-screen"></div>
  );
};

export default SignupPage;