import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { getAvailableFilters } from "../../services/companion/companionService";

const CompanionFilterSidebar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState({});
  const [interactionLevel, setInteractionLevel] = useState([50]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { categories } = await getAvailableFilters();
        setCategories(categories);
        
        // Initialize selected categories state
        const initialCategories = categories.reduce((acc, category) => {
          acc[category.id] = false;
          return acc;
        }, {});
        
        setSelectedCategories(initialCategories);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setError('Failed to load filters');
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  if (loading) {
    return <div className="p-4 text-gray-400">Loading filters...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-400">{error}</div>;
  }

  return (
    <div className="p-4 h-full">
      <h3 className="text-lg font-semibold text-green-400 mb-4">Filters</h3>

      {/* Category Filters */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories[category.id]}
                onCheckedChange={() => handleCategoryChange(category.id)}
                className="border-green-500/50 data-[state=checked]:bg-green-500"
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-medium leading-none text-gray-400"
              >
                {category.name}
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
          setSelectedCategories(
            categories.reduce((acc, category) => {
              acc[category.id] = false;
              return acc;
            }, {})
          );
          setInteractionLevel([50]);
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default CompanionFilterSidebar;