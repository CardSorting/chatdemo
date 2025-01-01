import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-green-500 animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
