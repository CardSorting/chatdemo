import React, { useEffect, useState, useCallback } from "react";
import { Companion } from "@lib/companions";
import CompanionCard from "./CompanionCard";
import { Button } from "../ui/button";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface GalleryProps {
  fetchCompanions: (page: number) => Promise<Companion[]>;
  activeFilters?: string[];
}

const Gallery = ({ fetchCompanions, activeFilters }: GalleryProps) => {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [ref, inView] = useInView();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadCompanions = useCallback(async (pageNumber: number) => {
    if (loading || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const data = await fetchCompanions(pageNumber);
      if (data.length > 0) {
        setCompanions(prev => {
          // Filter out duplicates
          const newCompanions = data.filter(newCompanion => 
            !prev.some(existingCompanion => existingCompanion.id === newCompanion.id)
          );
          return [...prev, ...newCompanions];
        });
        setPage(pageNumber + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading companions:", error);
      setError("Failed to load companions");
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchCompanions, loading, isLoadingMore]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    loadCompanions(1).finally(() => setLoading(false));
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      loadCompanions(page);
    }
  }, [inView, hasMore, isLoadingMore, page, loadCompanions]);

  const filteredCompanions = activeFilters && activeFilters.length > 0
    ? companions.filter(companion => activeFilters.includes(companion.category))
    : companions;

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-8 p-8">
        {filteredCompanions.map((companion, index) => (
          <motion.div
            key={companion.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <CompanionCard companion={companion} />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="h-20">
          {(loading || isLoadingMore) && (
            <div className="text-center text-gray-400">Loading more companions...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery;
