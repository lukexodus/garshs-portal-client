import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { DataProvider } from "./components/contexts/DataContext";
import { ToastProvider } from "./components/contexts/ToastContext";
import { PopupModalProvider } from "./components/contexts/PopupModalContext";
import { CustomModalProvider } from "./components/contexts/CustomModalContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <DataProvider>
    <ToastProvider>
      <PopupModalProvider>
        <CustomModalProvider>
          <App />
        </CustomModalProvider>
      </PopupModalProvider>
    </ToastProvider>
  </DataProvider>
  </React.StrictMode>,
);
