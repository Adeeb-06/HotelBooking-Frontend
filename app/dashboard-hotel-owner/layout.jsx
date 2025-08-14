"use client";
import React, { useContext, useEffect, useState } from 'react'
import SideBar from '../components/SideBar'
import { useRouter } from 'next/navigation';
import { AppContent } from '../context/AppContext';

const layout = (props) => {
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
  return (
    <div className='flex h-screen'>
      {/* Fixed Sidebar */}
      <div className="sidebar fixed left-0 top-0 w-[20%] h-full bg-slate-200 z-10">
        <SideBar/>
      </div>
      
      {/* Main Content Area */}
      <div className="main ml-[20%] w-[80%] h-full overflow-y-auto">
        <div className="p-6">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default layout