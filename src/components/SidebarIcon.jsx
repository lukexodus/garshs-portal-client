import React from 'react'

const SidebarIcon = ({component, fallback, isComponentReady, ...props}) => {
  return (
    <div className="flex items-center justify-center">
        {isComponentReady ? component : fallback}
    </div>
  )
}

export default SidebarIcon
