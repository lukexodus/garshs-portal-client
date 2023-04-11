import React, { createContext, useContext, useState } from 'react';

const PopupModalContext = createContext();

export const usePopupModal = () => useContext(PopupModalContext);

export const PopupModalProvider = ({ children }) => {
  const [popupModal, setPopupModal] = useState(null);

  return (
    <PopupModalContext.Provider value={{popupModal, setPopupModal}}>
      {children}
    </PopupModalContext.Provider>
  );
};
