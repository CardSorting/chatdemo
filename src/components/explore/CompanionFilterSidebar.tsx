import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { getAvailableFilters } from "../../services/companion/companionService";

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface CompanionFilterSidebarProps {
  onFiltersChange: (filters: string[]) => void;
  activeFilters: string[];
}

const CompanionFilterSidebar: React.FC<CompanionFilterSidebarProps> = ({
  onFiltersChange,
  activeFilters
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { categories } = await getAvailableFilters();
        setCategories(categories);

        // Initialize selected categories state
        const initialCategories = categories.reduce((acc, category) => {
          acc[category.id] = activeFilters.includes(category.id);
          return acc;
        }, {} as Record<string, boolean>);

        setSelectedCategories(initialCategories);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setError('Failed to load filters');
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, [activeFilters]);

  const prevActiveCategories = React.useRef<string[]>([]);

  useEffect(() => {
    const activeCategories = Object.keys(selectedCategories).filter(
      (categoryId) => selectedCategories[categoryId]
    );

    // Only update if the active categories have actually changed
    if (JSON.stringify(activeCategories) !== JSON.stringify(prevActiveCategories.current)) {
      onFiltersChange(activeCategories);
      prevActiveCategories.current = activeCategories;
    }
  }, [selectedCategories, onFiltersChange]);

  const handleCategoryChange = (categoryId: string, checked: boolean | "indeterminate") => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: checked === true
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
            <div
              key={category.id}
              className={`flex items-center space-x-2 p-2 rounded-lg ${
                selectedCategories[category.id] ? 'bg-green-500/10' : ''
              }`}
            >
              <Checkbox
                id={category.id}
                checked={!!selectedCategories[category.id]}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                className="border-green-500/50 data-[state=checked]:bg-green-500"
              />
              <Label
                htmlFor={category.id}
                className={`text-sm font-medium leading-none ${
                  selectedCategories[category.id] ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                {category.name}
              </Label>
            </div>
          ))}
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
            }, {} as Record<string, boolean>)
          );
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default CompanionFilterSidebar;
