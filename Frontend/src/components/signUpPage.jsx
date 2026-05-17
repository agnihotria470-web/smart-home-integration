"use client"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import image1 from "../assets/DLN Logo.png"
import { z } from 'zod';
import image2 from "../assets/image3.png";
import { useUser } from "../context/UserContext"; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import axios from "axios";

const passwordSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  mobileNumber: z
    .string()
    .length(10, 'Mobile number must be 10 digits')
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'), 
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters'),
  confirmPassword: z
    .string()
    .min(6, 'Confirm password must be at least 6 characters')
    .max(20, 'Confirm password must be at most 20 characters'),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { setEmail, setIsLoggedIn, setFirstName, setMobileNumber, setPicture } = useUser();

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      passwordSchema.parse(formData);
      setErrors({});

      const response = await fetch(`https://smart-home-backend-xyir.onrender.com/api/v1/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        const fullName = result.data.fullName || 'Unknown User';
        setMessage(`User created successfully: ${fullName}`);
        setFormData({
          fullName: '',
          mobileNumber: '',
          email: '',
          password: '',
          confirmPassword: '',
        });

        setTimeout(() => navigate('/signin'), 2000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = err.errors.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.path[0]]: curr.message,
          }),
          {}
        );
        setErrors(newErrors);
      } else {
        setMessage(`Error: ${err.message}`);
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex-1 lg:flex flex-col justify-center items-center bg-sky-200">
        <img src= "https://res.cloudinary.com/dh4cgdjhh/image/upload/v1746338974/n7j8dzl8ny4tomc1ssia.png"  alt="Logo"  className='flex items-center h-48 w-72'/>
      </div>
      <div className="flex-1 flex justify-center mt-10 bg-white">
        <form onSubmit={handleSubmit} className="w-80">
          <div>
            <button
            onClick={() => navigate('/abc')}
            className=""
        >
        <img src={image2} alt="" className="trans transform rotate-180 h-6 w-6" />
        </button>
          <h2 className="text-xl font-bold -mt-8 mb-10 text-sky-400 text-center">
            Create Account
          </h2>
          </div>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2 ml-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Abcd Efg"
              className="w-full px-4 py-2 border-none outline-none text-gray-600 rounded-3xl bg-sky-200"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2 ml-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Example@Example.com"
              className="w-full px-4 py-2 bg-sky-200 rounded-3xl border-none outline-none"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="mobileNumber" className="block text-gray-700 font-medium mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="+ 123 456 789"
              className="w-full px-4 py-2 border-none outline-none rounded-3xl bg-sky-200"
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder='......'
                className="w-full px-4 py-2 border-none outline-none bg-sky-200 rounded-3xl placeholder:text-6xl placeholder:tracking-widest placeholder:font-black"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2 ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder='......'
                className="w-full px-4 py-2 border-none outline-none bg-sky-200 rounded-3xl placeholder:text-6xl placeholder:tracking-widest placeholder:font-black"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          <div className=''>
            <p className='text-center text-xs px-16'>
            By continuing, you agree to 
            </p>
            <p className='text-center text-xs px-14'>
            <span className='font-bold'> Terms of Use</span> and <span className='font-bold'>Privacy Policy.</span>
            </p>
          </div>
          <button
            type="submit"
            className="ml-24 font-bold mt-8 px-12 py-2 bg-sky-400 rounded-3xl"
          >
            Sign Up
          </button>
          {message && (
            <p className="text-center mt-4  text-green-500">{message}</p>
          )}
          <GoogleOAuthProvider clientId="653140205065-u8ohloqk6ou4sinmqgs8b9uftdqcmeto.apps.googleusercontent.com">
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        const decoded = jwtDecode(credentialResponse.credential);

        const { email, name, picture } = decoded;

        const res = await fetch("https://smart-home-backend-xyir.onrender.com/api/v1/users/signup-with-google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name, picture }),
        });
         
        const data = await res.json();

        if (data.success) {
          console.log("Google signup successful");
          setEmail(email);
          setFirstName(name);
          setIsLoggedIn(true);
          setMobileNumber(decoded.picture);
          setPicture(picture);
          setTimeout(() => navigate("/home"), 2000);
        } else {
          console.error("Signup failed:", data.message);
        }
      } catch (err) {
        console.error("Signup/Login failed:", err);
      }
    }}
    onError={() => {
      console.log("Google Sign In Failed");
    }}
  />
</GoogleOAuthProvider>
          <p className="text-center ml-4 mt-6 mb-8 text-[14px] text-gray-600">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/signin')}
              className="text-sky-400 hover:underline cursor-pointer"
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
