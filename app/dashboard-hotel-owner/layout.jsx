import React from 'react'

const layout = (props) => {
  return (
    <div className='flex h-[100vh]'>
      <div className="sidebar w-[20%] h-full border-2 border-black">

      </div>
      <div className="main w-[80%] h-full">
        {props.children}
      </div>
    </div>
  )
}

export default layout