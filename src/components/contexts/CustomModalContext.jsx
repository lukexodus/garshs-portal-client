import React, { createContext, useContext, useState } from 'react';

const CustomModalContext = createContext();

export const useCustomModal = () => useContext(CustomModalContext);

export const CustomModalProvider = ({ children }) => {
  const [customModal, setCustomModal] = useState(null);

  return (
    <CustomModalContext.Provider value={{customModal, setCustomModal}}>
      {children}
    </CustomModalContext.Provider>
  );
};
