import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner = ({ message = "Loading...", className }: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      <p className="text-green-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
