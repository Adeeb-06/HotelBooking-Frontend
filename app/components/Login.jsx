"use client"
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { AppContent } from '../context/AppContext'

const LogIn = () => {
  const {setIsLoggedIn} = useContext(AppContent);
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState("")


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


const handleSubmit = async () => {
if (!/\S+@\S+\.\S+/.test(formData.email)) {
    setErrors("Please enter a valid email");
    return;
  } else if (!formData.password) {
    setErrors("Password is required");
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:8000/api/hotel/login-hotel',
      {
        email: formData.email,
        password: formData.password
      },
      { withCredentials: true }
    );

    if (response.status === 201) {
      setIsLoggedIn(true);
      router.push('/dashboard-hotel-owner');
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      setErrors(error.response.data.message || "Something went wrong");
    } else {
      setErrors("Network error, please try again"); 
    }
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Register Your Hotel</h1>
          <p className="text-gray-600 mt-2">Join our platform and start accepting bookings</p>
        </div>

        {/* Form */}
        <div className="space-y-6">

      
         
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter your email address"
            />

          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Create a password"
            />

          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >

            Login

          </button>


          {errors && (
            <p style={{ color: "red", fontWeight: "bold" }}>{errors}</p>
          )}
          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogIn