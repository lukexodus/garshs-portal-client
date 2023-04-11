import React from 'react'

const LinkButton = ({ name, link, onClick, className, ...props }) => {
  return (
    <a href={link}><span className={`uppercase bg-indigo-400 px-[11px] py-[7px] md:px-3 rounded-md text-xs md:text-sm text-white mr-2 md:mr-3 mb-2 md:mb-3 inline-block focus:bg-indigo-300 hover:bg-indigo-300 focus:outline-none shadow-lg hover:cursor-pointer ${className ? className : ''}`} onClick={onClick} >{name}</span></a>
  )
}

export default LinkButton   
