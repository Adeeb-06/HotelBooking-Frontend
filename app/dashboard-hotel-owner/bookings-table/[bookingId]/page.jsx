import BookingsDetails from '@/app/components/BookingsDetails'
import React from 'react'


const BookingDetails = async ({params}) => {
 const {bookingId} = await params
 console.log('bookingId' , bookingId)

  return (
    <div>
     <BookingsDetails bookingId={bookingId} />
    </div>
  )
}

export default BookingDetails