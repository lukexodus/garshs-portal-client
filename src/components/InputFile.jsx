import React from "react";
import Input from "./Input";

const InputFile = ({ ref, accept, multiple, ...props }) => {
  return (
    <span className="relative pointer-events-auto cursor-pointer">
      <span className="absolute top-6 left-2 bg-gray-200 text-black px-[0.3rem] py-1 z-10 rounded-md text-sm border-gray-400 border-opacity-20 border-[1px] pointer-events-none">
        Choose Files
      </span>
      <Input
        id="fileInput"
        name="fileInput"
        element="input"
        accept={accept}
        multiple={multiple}
        type="file"
        ref={ref}
        variant="simple"
        size="normalEven"
        onInput={() => {}}
        className="max-w-xs"
      />
    </span>
  );
};

export default InputFile;
