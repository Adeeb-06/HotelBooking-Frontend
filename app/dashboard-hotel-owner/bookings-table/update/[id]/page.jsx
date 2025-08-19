import UpdateBooking from '@/app/components/UpdateBooking'
import React from 'react'

const UpdateBookingPage =  async({params}) => {
 const {id} = await params
  return (
    <div>
        <UpdateBooking id={id} />
    </div>
  )
}

export default UpdateBookingPage