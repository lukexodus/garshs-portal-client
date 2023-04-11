import React from "react";
import { useCustomModal } from "./contexts/CustomModalContext";
import { useToast } from "./contexts/ToastContext";

const CustomModal = ({ children }) => {
  const { setCustomModal } = useCustomModal();
  const { setToast } = useToast();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-30 flex items-center justify-center z-40 max-h-screen overflow-y-auto">
      <div className="relative w-full h-full max-w-xl md:h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={() => {
              setCustomModal(null);
              setToast(null);
            }}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            {/* CONTENT */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
