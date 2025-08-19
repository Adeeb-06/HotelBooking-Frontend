"use client"
import React, { useContext, useEffect, useState } from 'react';
import { Calendar, Users, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import { useRouter } from 'next/navigation';


const UpdateBooking = ({ id }) => {
    const router = useRouter();
    const { getBookingsDetails, getRooms, rooms } = useContext(AppContent);

    const [formData, setFormData] = useState({
        roomIds: [],
        guestName: "",
        startDate: "",
        endDate: "",
        guests: 1,
        totalPrice: 0,
    });

    const [availableRooms, setAvailableRooms] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    // Fetch booking details + populate form
    useEffect(() => {
        const fetchData = async () => {
            try {
                const details = await getBookingsDetails(id);
                if (details) {
                    setFormData({
                        roomIds: details.roomIds || [],
                        guestName: details.guestName || "",
                        startDate: details.startDate
                            ? details.startDate.split("T")[0] // format for input[type=date]
                            : "",
                        endDate: details.endDate
                            ? details.endDate.split("T")[0]
                            : "",
                        guests: details.guests || 1,
                        totalPrice: details.totalPrice || 0,
                    });
                } else {
                    setErrorMsg("Booking not found");
                }
            } catch (error) {
                console.log("Error fetching booking details:", error);
                setErrorMsg("Failed to load booking details");
            }
        };

        fetchData();
        getRooms();
    }, [id]);

    // Sync available rooms
    useEffect(() => {
        setAvailableRooms(rooms);
    }, [rooms]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "guests" ? parseInt(value) : value,
        }));
    };

    // Handle room selection
    const handleRoomSelection = (roomId) => {
        setFormData((prev) => {
            const updatedRoomIds = prev.roomIds.includes(roomId)
                ? prev.roomIds.filter((id) => id !== roomId)
                : [...prev.roomIds, roomId];

            const nights =
                prev.startDate && prev.endDate
                    ? Math.ceil(
                        (new Date(prev.endDate) - new Date(prev.startDate)) /
                        (1000 * 60 * 60 * 24)
                    )
                    : 1;

            const calculatedTotalPrice = updatedRoomIds.reduce((acc, id) => {
                const room = availableRooms.find((room) => room._id === id);
                return acc + (room ? room.pricePerNight * nights : 0);
            }, 0);

            return {
                ...prev,
                roomIds: updatedRoomIds,
                totalPrice: calculatedTotalPrice,
                nights,
            };
        });
    };

    // Submit update
    const handleSubmit = async () => {
        try {
            const res = await axios.put(
                `http://localhost:8000/api/booking/update-booking/${id}`,
                formData,
                { withCredentials: true }
            );

            if (res.data.success) {
                router.push("/dashboard-hotel-owner/");
            }
        } catch (error) {
            if (error.response?.status === 409) {
                setErrorMsg(error.response.data.message);
            } else {
                setErrorMsg("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                        <h1 className="text-4xl font-bold mb-2">Update Booking</h1>
                        <p className="text-blue-100">Modify your existing reservation</p>
                    </div>

                    <div className="p-8">
                        {/* Guest Information */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                <Users className="mr-3 text-blue-600" />
                                Guest Information
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Guest Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="guestName"
                                        value={formData.guestName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Guests
                                    </label>
                                    <input
                                        type="number"
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleInputChange}
                                        min="1"
                                        max="20"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date Selection */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                <Calendar className="mr-3 text-blue-600" />
                                Stay Dates
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-in Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Check-out Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Room Selection */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                <MapPin className="mr-3 text-blue-600" />
                                Select Rooms
                            </h2>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableRooms.map((room) => (
                                    <div
                                        key={room._id}
                                        onClick={() => handleRoomSelection(room._id)}
                                        className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.roomIds.includes(room._id)
                                                ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                                                : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                                            }`}
                                    >
                                        {formData.roomIds.includes(room._id) && (
                                            <CheckCircle className="absolute top-3 right-3 text-blue-600 w-6 h-6" />
                                        )}
                                        <h3 className="font-semibold text-gray-800 mb-2">
                                            {room.name}
                                        </h3>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ${room.pricePerNight}
                                        </p>
                                        <p className="text-xs text-gray-500">per night</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total Price */}
                        {/* Total Price */} <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl"> <div className="flex items-center justify-between"> <div className="flex items-center"> <CreditCard className="mr-3 text-gray-600" /> <span className="text-xl font-semibold text-gray-800">Total Price</span> </div> <div className="text-3xl font-bold text-blue-600"> ${formData.totalPrice} </div> </div> <p className="text-sm text-gray-600 mt-2"> {formData.roomIds.length > 0 ? (formData.startDate && formData.endDate ? (`Total for ${formData.guests} guest(s) x ${Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} night(s) `) : 'Select stay dates to see total price' ) : 'Select rooms to see price'} </p> </div>

                        {errorMsg && (
                            <p className="text-red-500 text-xl mt-5 mb-5">{errorMsg}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={
                                formData.roomIds.length === 0 ||
                                !formData.guestName ||
                                !formData.startDate ||
                                !formData.endDate
                            }
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Update Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBooking;
