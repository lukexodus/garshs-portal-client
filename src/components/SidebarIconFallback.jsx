import React from 'react'

const SidebarIconFallback = ({icon, ...props}) => {
  return (
    <div className={`animate-pulse flex items-center justify-center`}>
        <div className="h-10 w-10 bg-gray-100 dark:bg-gray-200 rounded-full"></div><span className="w-3"></span><div className="h-7 w-44 bg-gray-100 dark:bg-gray-200 rounded-full"></div>
    </div>
  )
}

export default SidebarIconFallback
