import React, { useEffect, useState } from "react";
import { Companion } from "../../lib/companions";
import CompanionCard from "./CompanionCard";

interface GalleryProps {
  fetchCompanions: () => Promise<Companion[]>;
}

const Gallery = ({ fetchCompanions }: GalleryProps) => {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCompanions = async () => {
      try {
        const data = await fetchCompanions();
        setCompanions(data);
      } catch (error) {
        console.error("Error loading companions:", error);
        setError("Failed to load companions");
      } finally {
        setLoading(false);
      }
    };

    loadCompanions();
  }, [fetchCompanions]);

  if (loading) {
    return <div className="text-center text-gray-400">Loading companions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companions.map((companion) => (
        <CompanionCard key={companion.id} companion={companion} />
      ))}
    </div>
  );
};

export default Gallery;
