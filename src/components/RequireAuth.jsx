import React from 'react';
import { Navigate,  useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

function RequireAuth({ children }) {
    const location = useLocation();
  
    return isLoggedIn() ? (
      children
    ) : (
      <Navigate to="/auth" replace state={{ path: location.pathname }} />
    );
}

export default RequireAuth
