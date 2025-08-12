"use client";
import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AppContent } from '../context/AppContext';
import Login from '../components/Login';

const LoginPage = () => {
  const { isHotelOwner, isLoggedIn } = useContext(AppContent);
  const router = useRouter();

  useEffect(() => {
    isHotelOwner();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard-hotel-owner');
    }
  }, [isLoggedIn]);

  return <div><Login/></div>;
};

export default LoginPage;
