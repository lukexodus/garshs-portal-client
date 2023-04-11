import React from "react";
import { usePopupModal } from "./contexts/PopupModalContext";
import { useCustomModal } from "./contexts/CustomModalContext";
import { useToast } from "./contexts/ToastContext";
import CustomModal from "./CustomModal";
import Toast from "./Toast";
import PopupModal from "./PopupModal";

const ModalsSpace = ({ children }) => {
  const { popupModal } = usePopupModal();
  const { customModal } = useCustomModal();
  const { toast } = useToast();

  return (
    <div className="bg-indigo-600 min-h-screen h-screen">
      {children}
      {popupModal ? <PopupModal {...popupModal} /> : ""}
      {customModal ? <CustomModal>{customModal}</CustomModal> : ""}
      {toast ? <Toast {...toast} /> : ""}
    </div>
  );
};

export default ModalsSpace;
