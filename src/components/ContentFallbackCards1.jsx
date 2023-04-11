import React from "react";

const PageFallback1 = () => {
  const boneContentStyle = "h-72 w-72 rounded-xl bg-indigo-500 mb-5 ml-5";

  return (
    <div className="animate-pulse w-full flex flex-wrap">
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>
      <div className={`${boneContentStyle}`}></div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default PageFallback1;
