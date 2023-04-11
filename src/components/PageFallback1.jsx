import React from 'react'

const PageFallback1 = () => {
    const boneContentStyle = "h-5 rounded-full bg-indigo-500 mb-5"
    const boneHeadingStyle = "h-7 rounded-full bg-indigo-500 w-[35%] mb-7";
    const inlineBoneStyle = "w-[18%] inline-block ml-3"

  return (
    <div className="animate-pulse w-full">
      <div className="h-9 rounded-full bg-indigo-500 w-[46%] mb-6 mt-1"></div>

      <div className="py-3"></div>

      <div className={boneHeadingStyle}></div>
      <div className={`${boneContentStyle} ${inlineBoneStyle}`}></div><div className={`${boneContentStyle} ${inlineBoneStyle}`}></div><div className={`${boneContentStyle} ${inlineBoneStyle}`}></div><div className={`${boneContentStyle} ${inlineBoneStyle}`}></div>

      <div className="py-3"></div>

      <div className={boneHeadingStyle}></div>
      <div className={`${boneContentStyle} w-[70%]`}></div>
      <div className={`${boneContentStyle} w-[74%]`}></div>
      <div className={`${boneContentStyle} w-[67%]`}></div>
      <div className={`${boneContentStyle} w-[60%]`}></div>
      <div className={`${boneContentStyle} w-[70%]`}></div>

      <div className="py-3"></div>

      <div className={boneHeadingStyle}></div>
      <div className={`${boneContentStyle} w-[65%]`}></div>
      <div className={`${boneContentStyle} w-[61%]`}></div>
      <div className={`${boneContentStyle} w-[68%]`}></div>
      <div className={`${boneContentStyle} w-[63%]`}></div>
      <div className={`${boneContentStyle} w-[70%]`}></div>

      <div className="py-3"></div>

      <div className={boneHeadingStyle}></div>
      <div className={`${boneContentStyle} w-[64%]`}></div>
      <div className={`${boneContentStyle} w-[66%]`}></div>
      <div className={`${boneContentStyle} w-[70%]`}></div>
      <div className={`${boneContentStyle} w-[73%]`}></div>
      <div className={`${boneContentStyle} w-[68%]`}></div>

      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default PageFallback1