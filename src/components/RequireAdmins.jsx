import React from 'react';
import { Navigate } from "react-router-dom";

function RequireAdmin({ children }) {
    const data = JSON.parse(localStorage.getItem('data'));
  
    return (data && (data.user.role === 'admin' || data.user.role === 'superadmin')) ? (
      children
    ) : (
      <Navigate to="/auth" replace state={{ path: location.pathname, msg: "User needs to be an admin to access the page." }} />
    );
}

export default RequireAdmin
