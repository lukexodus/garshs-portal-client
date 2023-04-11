import React from 'react';
import { Navigate } from "react-router-dom";

function RequireSuperadmin({ children }) {
    const data = JSON.parse(localStorage.getItem('data'));
  
    return (data && (data.user.role === 'superadmin')) ? (
      children
    ) : (
      <Navigate to="/auth" replace state={{ path: location.pathname, msg: "User needs to be a superadmin to access the page." }} />
    );
}

export default RequireSuperadmin
