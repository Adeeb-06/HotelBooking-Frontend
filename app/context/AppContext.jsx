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
    const [bookingsData, setBookingsData] = useState([])
    const [bookingData, setBookingData] = useState([])

    const isHotelOwner = async () => {
        try {
            console.log('Checking hotel owner status...');
            const response = await axios.get('/api/hotel/is-hotel-owner', { withCredentials: true });

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
            const response = await axios.get('http://localhost:8000/api/room/get-rooms', { withCredentials: true });

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

    const getBookings = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/booking/get-bookings', { withCredentials: true });

            if (response.data.success) {
                setBookingsData(response.data.bookings);
            } else {
                setBookingsData([]);
                toast.error(response.data.message || "Failed to fetch bookings");
            }
        } catch (error) {
            console.error("Fetch bookings error:", error.response?.data || error.message);
            setBookingsData([]);
            if (error.response?.status !== 401) {
                toast.error("Failed to fetch bookings");
            }
        }
    };

    const getBookingsDetails = async (bookingId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/booking/get-booking-by-id/${bookingId}`, { withCredentials: true });
            if (response.data.success) {
                const booking = response.data.booking; // singular
                setBookingData(booking);
                return booking;
            } else {
                setBookingData([]);
                toast.error(response.data.message || "Failed to fetch bookings");
            }
        } catch (error) {
            console.log(error);
            return null;
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
        getRooms,
        bookingsData,
        getBookings,
        bookingData,
        getBookingsDetails
    };

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    );
};