import React, { useState, useEffect } from 'react';
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";
import { useAuth } from '../../contexts/user/AuthContext';

export default function SignIn() {
  const { signIn, isLoading } = useAuth();
  const [formData, setFormData] = useState({ 
      email: '',
      password: '',
  });
  const [errors, setErrors] = useState('');

  const handleSignIn = async (e) => {
      e.preventDefault();
      const results = await signIn(formData);
      if(results?.errors?.length){
        setErrors(()=> results.errors[0].msg)
    }
    };

    useEffect(()=>{
      console.log(
        `
         _______ _______ _______                          
        |       |       |       |                         
        |    ___|____   |    ___|                         
        |   |___ ____|  |   |___                          
        |    ___| ______|    ___|                         
        |   |___| |_____|   |___                          
        |_______|_______|_______|_______ _______ ______   
        |       |  | |  |   |   |       |       |    _ |  
        |    _  |  | |  |   |   |  _____|    ___|   | ||  
        |   |_| |  |_|  |   |   | |_____|   |___|   |_||_ 
        |    ___|       |   |___|_____  |    ___|    __  |
        |   |   |       |       |_____| |   |___|   |  | |
        |___|   |_______|_______|_______|_______|___|  |_|
         Copyright (C) 2023  Daniel Payne
    This program comes with ABSOLUTELY NO WARRANTY.
        `
      )
    },[])
  
  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        <form onSubmit={handleSignIn}>
          {/* Email */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="text"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          {/* Password */}
          <InputField
            variant="auth"
            extra="mb-3"
            label="Password*"
            placeholder="Min. 8 characters"
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {/* Checkbox */}
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Keep me logged In
              </p>
            </div>
            <a
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              href=" "
            >
              Forgot Password?
            </a>
          </div>
          <button 
          type='submit'
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Sign In
          </button>
        </form>
        
        <div className="mt-3">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <a
            href="/auth/sign-up"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </a>
        </div>
        <p className="mt-1 text-base text-red-600">
            {errors ? `${errors} ☝` : ''}
        </p>
      </div>
    </div>
  );
}
