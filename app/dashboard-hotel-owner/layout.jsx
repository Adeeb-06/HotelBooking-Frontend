import React from 'react'
import SideBar from '../components/SideBar'

const layout = (props) => {
  return (
    <div className='flex h-screen'>
      {/* Fixed Sidebar */}
      <div className="sidebar fixed left-0 top-0 w-[20%] h-full bg-slate-200 z-10">
        <SideBar/>
      </div>
      
      {/* Main Content Area */}
      <div className="main ml-[20%] w-[80%] h-full overflow-y-auto">
        <div className="p-6">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default layout