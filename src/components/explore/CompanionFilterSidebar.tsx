import React, { useState } from "react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const CompanionFilterSidebar = () => {
  const [personalityTypes, setPersonalityTypes] = useState({
    friendly: false,
    intellectual: false,
    creative: false,
    adventurous: false,
  });

  const [interests, setInterests] = useState({
    technology: false,
    art: false,
    science: false,
    philosophy: false,
  });

  const [interactionLevel, setInteractionLevel] = useState([50]);

  const handlePersonalityChange = (type: string) => {
    setPersonalityTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleInterestChange = (interest: string) => {
    setInterests((prev) => ({
      ...prev,
      [interest]: !prev[interest],
    }));
  };

  return (
    <div className="p-4 h-full">
      <h3 className="text-lg font-semibold text-green-400 mb-4">Filters</h3>

      {/* Personality Type Filters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Personality</h4>
        <div className="space-y-2">
          {Object.entries(personalityTypes).map(([type, checked]) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={checked}
                onCheckedChange={() => handlePersonalityChange(type)}
                className="border-green-500/50 data-[state=checked]:bg-green-500"
              />
              <Label
                htmlFor={type}
                className="text-sm font-medium leading-none capitalize text-gray-400"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Interest Filters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Interests</h4>
        <div className="space-y-2">
          {Object.entries(interests).map(([interest, checked]) => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest}
                checked={checked}
                onCheckedChange={() => handleInterestChange(interest)}
                className="border-green-500/50 data-[state=checked]:bg-green-500"
              />
              <Label
                htmlFor={interest}
                className="text-sm font-medium leading-none capitalize text-gray-400"
              >
                {interest}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Interaction Level Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 mb-2">
          Interaction Level
        </h4>
        <Slider
          defaultValue={interactionLevel}
          max={100}
          step={1}
          onValueChange={(value) => setInteractionLevel(value)}
          className="[&>span:first-child]:bg-green-500"
        />
        <div className="text-xs text-gray-400 mt-1">
          {interactionLevel[0]}% interaction
        </div>
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        className="w-full border-green-500/20 text-green-400 hover:bg-green-500/10"
        onClick={() => {
          setPersonalityTypes({
            friendly: false,
            intellectual: false,
            creative: false,
            adventurous: false,
          });
          setInterests({
            technology: false,
            art: false,
            science: false,
            philosophy: false,
          });
          setInteractionLevel([50]);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default CompanionFilterSidebar;