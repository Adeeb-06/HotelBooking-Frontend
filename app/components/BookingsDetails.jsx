"use client"
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { AppContent } from '../context/AppContext';
import Link from 'next/link';

const getRooms = async (bookingId) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/room/get-room-by-booking-id/${bookingId}`, {withCredentials: true});
        const data = response.data.room;
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const BookingsDetails = ({bookingId, onBack}) => {
    const { getBookingsDetails , bookingData } = useContext(AppContent);
    const [bookingsDetails, setBookingsDetails] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!bookingId) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const details = await getBookingsDetails(bookingId);
                const roomsData = await getRooms(bookingId);
            
                
                setBookingsDetails(bookingData);
                setRooms(roomsData || []);
                
                if (!details) {
                    setError('Booking not found');
                }
            } catch (err) {
                setError('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [bookingId]);

    // Helper functions
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatShortDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getBookingStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return { status: 'Upcoming', color: 'bg-blue-100 text-blue-800 border-blue-200' };
        } else if (now >= start && now <= end) {
            return { status: 'Active', color: 'bg-green-100 text-green-800 border-green-200' };
        } else {
            return { status: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-200' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-white rounded-lg mb-8 w-1/3 shadow-sm"></div>
                        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                            <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                            <div className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-4 bg-gray-100 rounded w-full"></div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="h-5 bg-gray-200 rounded mb-3 w-1/2"></div>
                                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !bookingsDetails) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Booking Not Found</h3>
                        <p className="text-gray-500 mb-8">{error || 'The booking you are looking for could not be found.'}</p>
                        <button
                            onClick={onBack}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const bookingStatus = getBookingStatus(bookingsDetails.startDate, bookingsDetails.endDate);
    const duration = calculateDuration(bookingsDetails.startDate, bookingsDetails.endDate);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 group"
                            >
                                <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Booking Details
                            </h1>
                            <p className="text-gray-600 mt-1">Booking ID: #{bookingsDetails._id?.slice(-8) || 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border ${bookingStatus.color}`}>
                            <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                            {bookingStatus.status}
                        </span>
                        <Link href={`/dashboard-hotel-owner/bookings-table/update/${bookingId}`}>
                        
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Edit Booking</span>
                        </button>
                        </Link>
                    </div>
                </div>

                {/* Main Booking Info Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-2xl">
                                    {bookingsDetails.guestName?.charAt(0)?.toUpperCase() || 'G'}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-1">{bookingsDetails.guestName || 'Guest Name'}</h2>
                                <p className="text-gray-600 text-lg">{bookingsDetails.guests || 1} {bookingsDetails.guests === 1 ? 'Guest' : 'Guests'}</p>
                                <div className="flex items-center mt-2 text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                                    </svg>
                                    Booked on {formatShortDate(bookingsDetails.createdAt || bookingsDetails.startDate)}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                                {formatPrice(bookingsDetails.totalPrice || 0)}
                            </div>
                            <div className="text-gray-500 text-lg">Total Amount</div>
                        </div>
                    </div>

                    {/* Stay Timeline */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 mb-2">{formatShortDate(bookingsDetails.startDate)}</div>
                            <div className="text-gray-600 font-medium">Check-in</div>
                            <div className="text-sm text-gray-500 mt-1">3:00 PM</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{duration}</div>
                            <div className="text-gray-600 font-medium">Night{duration !== 1 ? 's' : ''}</div>
                            <div className="text-sm text-gray-500 mt-1">Stay Duration</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 mb-2">{formatShortDate(bookingsDetails.endDate)}</div>
                            <div className="text-gray-600 font-medium">Check-out</div>
                            <div className="text-sm text-gray-500 mt-1">11:00 AM</div>
                        </div>
                    </div>
                </div>

                {/* Rooms Section */}
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        Your Rooms ({rooms.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {rooms.map((room, index) => (
                            <div key={room._id || index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
                                {/* Room Image */}
                                <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
                                    {room.images && room.images.length > 0 ? (
                                        <img 
                                            src={room.images[0]} 
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                                            {formatPrice(room.pricePerNight)}/night
                                        </span>
                                    </div>
                                </div>

                                {/* Room Details */}
                                <div className="p-6">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h4>
                                    {room.description && (
                                        <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                                    )}
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        {room.bedType && (
                                            <div className="flex items-center text-gray-700">
                                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2z" />
                                                </svg>
                                                <span className="text-sm font-medium">{room.bedType}</span>
                                            </div>
                                        )}
                                        {room.extraBedPrice && (
                                            <div className="flex items-center text-gray-700">
                                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <span className="text-sm font-medium">Extra bed: {formatPrice(room.extraBedPrice)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Amenities */}
                                    {room.amenities && room.amenities.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-gray-900 mb-2 text-sm">Amenities</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {room.amenities.slice(0, 4).map((amenity, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                                    >
                                                        {amenity}
                                                    </span>
                                                ))}
                                                {room.amenities.length > 4 && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                        +{room.amenities.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        Payment Summary
                    </h3>
                    
                    <div className="grid grid-cols- md:grid-cols- gap-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Room Rate (per night)</span>
                                <span className="font-semibold">{formatPrice((bookingsDetails.totalPrice || 0) / duration)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Number of Nights</span>
                                <span className="font-semibold">{duration}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Number of Rooms</span>
                                <span className="font-semibold">{rooms.length}</span>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-bold text-green-600">{formatPrice(bookingsDetails.totalPrice || 0)}</span>
                                </div>
                            </div>
                        </div>
                        
                       
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            <span>Download Invoice</span>
                        </button>
                        <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            <span>Share Booking</span>
                        </button>
                        <button className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Print Details</span>
                        </button>
                        <button className="border-2 border-red-300 hover:border-red-400 hover:bg-red-50 text-red-700 px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Cancel Booking</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingsDetails;