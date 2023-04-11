import React from "react";
import { usePopupModal } from "./contexts/PopupModalContext";

const primaryButtonStyles = {
  default: "bg-blue-600 hover:bg-blue-800",
  danger: "bg-red-600 hover:bg-red-800",
};

const PopupModal = ({ message, variant, primary, secondary, handler }) => {
  const { setPopupModal } = usePopupModal();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-30 flex items-center justify-center z-50">
      <div
        tabIndex="-1"
        className="p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-3rem)]"
      >
        <div className="relative w-full h-full max-w-md md:h-auto">
          <div className="relative bg-white rounded-lg shadow">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              onClick={() => {
                setPopupModal(null);
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
            <div className="p-6 text-center">
              <h3 className="mb-5 mt-6 text-lg font-normal text-gray-500">
                {message}
              </h3>
              <button
                type="button"
                className={`text-white ${primaryButtonStyles[variant]} focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2`}
                onClick={() => {
                  setPopupModal(null);
                  handler();
                }}
              >
                {primary}
              </button>
              <button
                type="button"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
                onClick={() => {
                  setPopupModal(null);
                }}
              >
                {secondary}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

PopupModal.defaultProps = {
  variant: "default",
  primary: "Proceed",
  secondary: "Cancel",
};

export default PopupModal;
