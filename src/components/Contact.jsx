import React from "react";
import ComingSoon from "./svgs/ComingSoon";

const Contact = () => {
  document.title = `Contact | GARSHS`;

  return (
    <>
      <div className="flex items-center justify-center pt-16 xl:pt-0">
        <ComingSoon className="w-9/12 xl:w-8/12" />
      </div>
    </>
  );
};

export default Contact;
