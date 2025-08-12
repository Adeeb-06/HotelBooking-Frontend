"use client"
import React, { useContext } from 'react'
import Login from '../components/Login'
import { AppContent, AppContextProvider } from '../context/AppContext'


const LoginPage = () => {
  const {isHotelOwner , isLoggedIn} = useContext(AppContent)

  isHotelOwner()
  if(isLoggedIn){
    router.push('/dashboard-hotel-owner')
  }
  return ( 
    <div><Login/></div>
  )
}

export default LoginPage