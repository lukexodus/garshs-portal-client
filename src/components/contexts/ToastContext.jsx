import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  return (
    <ToastContext.Provider value={{toast, setToast}}>
      {children}
    </ToastContext.Provider>
  );
};
