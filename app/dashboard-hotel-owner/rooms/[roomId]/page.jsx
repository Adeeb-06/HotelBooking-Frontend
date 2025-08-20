import React from 'react'
import RoomsDetails from '@/app/components/RoomsDetails'

const RoomsDetailsPage = async ({params}) => {
    const {roomId} = await params
    console.log('roomId' , roomId)
  return (
    <div><RoomsDetails roomId={roomId}/></div>
  )
}

export default RoomsDetailsPage