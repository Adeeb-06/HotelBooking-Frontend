"use client";
import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext';
import { useRouter } from 'next/navigation';

const DashboardHotelOwner = () => {
  const router = useRouter();
  const { isLoggedIn, isHotelOwner } = useContext(AppContent);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await isHotelOwner();  // this sets isLoggedIn
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!checkingAuth && !isLoggedIn) {
      router.push('/login');  // redirect if NOT logged in
    }
  }, [checkingAuth, isLoggedIn]);


 
  // User is logged in, show dashboard
  return (
    <div>DashboardHotelOwner</div>
  )
}

export default DashboardHotelOwner;
