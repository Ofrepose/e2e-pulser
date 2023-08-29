import React, { useState, useEffect } from 'react';
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import { useAuth } from '../../contexts/user/AuthContext';


export default function SignUp() {
    const { signUp, isLoading } = useAuth();
    const [formData, setFormData] = useState({ 
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        password2: '',
    });
    const [errors, setErrors] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        const results = await signUp(formData);
        if(results?.errors?.length){
            setErrors(()=> results.errors[0].msg)
        }
      };

  return (
    <div className="mt-0 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[5vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Register
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Create your Free account to get started!
        </p>
        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        
        <form onSubmit={handleSignUp}>
            
            {/* Email */}
            <InputField
            variant="auth"
            extra="mb-3"
            label="Email*"
            placeholder="mail@simmmple.com"
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            {/* Name */}
            <InputField
            variant="auth"
            extra="mb-3"
            label="First Name*"
            placeholder="First Name"
            id="firstname"
            type="text"
            value={formData.firstname}
            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />

            <InputField
            variant="auth"
            extra="mb-3"
            label="Last Name*"
            placeholder="Last Name"
            id="lastname"
            type="text"
            value={formData.lastname}
            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
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

            <InputField
            variant="auth"
            extra="mb-3"
            label="Repeat Password (for funsies)*"
            placeholder="Min. 8 characters"
            id="password2"
            type="password"
            value={formData.password2}
            onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
            />
            {/* Checkbox */}
            <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
                <Checkbox />
                <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                I agree to everything always ( Also for funsies )
                </p>
            </div>
            </div>
            <button type="submit" disabled={isLoading} className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
            Register
            </button>
        </form>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <a
            href="/auth/sign-in"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign In
          </a>
        </div>
        <p className="mt-1 text-base text-red-600">
            {errors ? `${errors} ☝` : ''}
        </p>
      </div>
    </div>
  );
}
