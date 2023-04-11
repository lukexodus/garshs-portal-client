import React from "react";

const CircularProgress = ({
  min,
  max,
  value,
  radiusParam,
  strokeParam,
  normRadiusParam,
}) => {
  const current = Math.ceil((value / (max - min)) * 100);
  const radius = radiusParam;
  const stroke = strokeParam;
  const normRadius = radius - stroke * normRadiusParam;
  const circumference = normRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (current / 100) * circumference;

  return (
    <div className="h-10 w-10 rounded-full flex items-center relative justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        strokeLinecap="round"
        strokeWidth={stroke}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <circle
          className="stroke-white fill-transparent"
          transform={`rotate(-90 ${radius} ${radius})`}
          r={normRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="stroke-blue-400 fill-transparent"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          transform={`rotate(-90 ${radius} ${radius})`}
          r={normRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {/* <span className="absolute text-sm text-white">
        {current}%
      </span> */}
    </div>
  );
};

CircularProgress.defaultProps = {
  radiusParam: 70,
  strokeParam: 5,
  normRadiusParam: 11,
};

export default CircularProgress;
