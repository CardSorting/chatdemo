import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FloatingCTAProps {
  onClick?: () => void;
  label?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

const FloatingCTA = ({
  onClick = () => console.log("Create companion clicked"),
  label = "Create Companion",
  position = "bottom-right",
}: FloatingCTAProps) => {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 bg-background`}>
      <Button
        onClick={onClick}
        size="lg"
        className="shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all duration-300 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
      >
        <Plus className="w-5 h-5 mr-2" />
        {label}
      </Button>
    </div>
  );
};

export default FloatingCTA;
