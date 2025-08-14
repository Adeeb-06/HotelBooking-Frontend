"use client"
import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

// Configure axios defaults
axios.defaults.withCredentials = true;

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [rooms, setRooms] = useState([])

    const isHotelOwner = async () => {
        try {
            console.log('Checking hotel owner status...');
            const response = await axios.get('/api/hotel/is-hotel-owner', {withCredentials: true});
            
            if (response.data.success) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                toast.error(response.data.message || "Not authorized");
            }
        } catch (error) {
            console.error("Auth check error:", error.response?.data || error.message);
            setIsLoggedIn(false);
            if (error.response?.status !== 401) {
                toast.error("Failed to check authentication status");
            }
        }
    };

    const getRooms = async () => {
        try {
            const response = await axios.get('/api/room/get-rooms', {withCredentials: true});
            
            if (response.data.success) {
                setRooms(response.data.rooms);
            } else {
                setRooms([]);
                toast.error(response.data.message || "Failed to fetch rooms");
            }
        } catch (error) {
            console.error("Fetch rooms error:", error.response?.data || error.message);
            setRooms([]);
            if (error.response?.status !== 401) {
                toast.error("Failed to fetch rooms");
            }
        }
    };

    // Check auth on app load
 
    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        isHotelOwner,
        rooms,
        getRooms
    };

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};