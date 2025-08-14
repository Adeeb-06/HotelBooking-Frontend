"use client"
import React, { useState, useEffect, useContext } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';

const CreateBooking = () => {
  const { getRooms, rooms } = useContext(AppContent);
  const [formData, setFormData] = useState({
    roomIds: [],
    guestName: '',
    startDate: '',
    endDate: '',
    guests: 1,
    totalPrice:0
  });

  useEffect(() => {
    const fetchRooms = async () => {
      await getRooms();
    };
    fetchRooms();
  }, [getRooms]);
  //   getRooms();
  //   console.log('rooms' , rooms)

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample rooms data - replace with actual API call
  //   const [rooms, setrooms] = useState();
  // setrooms(rooms);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoomSelect = (roomId) => {
    setFormData(prev => ({
      ...prev,
      roomIds: prev.roomIds.includes(roomId)
        ? prev.roomIds.filter(id => id !== roomId)
        : [...prev.roomIds, roomId]
    }));

    // Clear room error if exists
    if (errors.room) {
      setErrors(prev => ({
        ...prev,
        roomIds: ''
      }));
    }
  };

  const calculateTotalPrice = () => {
    if (!formData.startDate || !formData.endDate || formData.roomIds.length === 0) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const selectedRooms = rooms.filter(room => formData.roomIds.includes(room._id));
    const totalRoomPrice = selectedRooms.reduce((sum, room) => sum + room.pricePerNight, 0);

    let totalPrice = nights * totalRoomPrice

    return totalPrice;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Check-in date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Check-out date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'Check-out date must be after check-in date';
      }
    }

    if (formData.guests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    if (formData.roomIds.length === 0) {
      newErrors.room = 'Please select at least one room';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
     const updatedFormData = {
    ...formData,
    totalPrice: calculateTotalPrice()
  };
    
    try {
      const res = await axios.post('http://localhost:8000/api/booking/create-booking', updatedFormData, {withCredentials: true});
      console.log('Booking submitted:', res.data);
      alert('Booking created successfully!');
      setIsSubmitting(false);

     console.log(formData)
      // Reset form
      // setFormData({
      //   guestName: '',
      //   startDate: '',
      //   endDate: '',
      //   guests: 1,
      //   roomIds: [],
      //   totalPrice:''
      // });
    } catch (error) {
      console.log(error)
    }

  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Stay</h1>
        <p className="text-gray-600">Fill in your details to make a reservation</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6m-6 0v4a2 2 0 002 2h4a2 2 0 002-2v-4m-6 0H8m8 0h4" />
          </svg>
          Booking Details
        </h2>

        <div className="space-y-6">

          {/* Guest Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guest Name *
            </label>
            <input
              type="text"
              name="guestName"
              value={formData.guestName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.guestName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter guest name"
            />
            {errors.guestName && <p className="mt-1 text-sm text-red-600">{errors.guestName}</p>}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                min={today}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
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
                min={formData.startDate || today}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          {/* Number of Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests *
            </label>
            <input
              type="number"
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              min="1"
              max="10"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.guests ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="1"
            />
            {errors.guests && <p className="mt-1 text-sm text-red-600">{errors.guests}</p>}
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Rooms * (Multiple selection allowed)
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${formData.roomIds.includes(room._id)
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  onClick={() => handleRoomSelect(room._id)}
                >
                  {/* Checkbox */}
                  <div className="absolute top-3 right-3">
                    <input
                      type="checkbox"
                      checked={formData.roomIds.includes(room._id)}
                      onChange={() => handleRoomSelect(room._id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Room Image Placeholder */}
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.293-1.293a2 2 0 012.828 0L20 15m-6-6h.01M6 8a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>

                  {/* Room Details */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{room.name}</h3>

                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      </svg>
                      {room.bedType}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        ${room.pricePerNight}
                      </span>
                      <span className="text-sm text-gray-500">per night</span>
                    </div>

                    {/* Room Features */}
                    <div className="flex flex-wrap gap-1 pt-2">
                      {room.amenities.map((amenity) => (
                        <span key={amenity} className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {formData.roomIds.includes(room._id) && (
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Selected
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {errors.room && <p className="mt-2 text-sm text-red-600">{errors.room}</p>}

            {/* Selected Rooms Count */}
            {formData.roomIds.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">{formData.roomIds.length}</span> room{formData.roomIds.length > 1 ? 's' : ''} selected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Summary */}
      {calculateTotalPrice() > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Nights:</span>
              <span>
                {formData.startDate && formData.endDate
                  ? Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))
                  : 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rooms:</span>
              <span>{formData.roomIds.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Guests:</span>
              <span>{formData.guests}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-semibold text-blue-600">
              <span>Total Amount:</span>
              <span>${calculateTotalPrice()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Booking...
            </>
          ) : (
            'Create Booking'
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateBooking;