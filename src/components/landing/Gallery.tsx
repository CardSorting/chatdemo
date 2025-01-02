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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadCount, setLoadCount] = useState(0);
  const [ref, inView] = useInView();

  const loadMoreCompanions = useCallback(async () => {
    if (!hasMore) return;
    
    setLoading(true);
    try {
      const data = await fetchCompanions(page);
      if (data.length > 0) {
        setCompanions(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
        setLoadCount(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading companions:", error);
      setError("Failed to load companions");
    } finally {
      setLoading(false);
    }
  }, [fetchCompanions, page, hasMore]);

  useEffect(() => {
    loadMoreCompanions();
  }, []);

  useEffect(() => {
    if (inView && loadCount < 2) {
      loadMoreCompanions();
    }
  }, [inView, loadCount, loadMoreCompanions]);

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

      {loadCount >= 2 && hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMoreCompanions}
            className="bg-green-500 hover:bg-green-600"
          >
            Show More
          </Button>
        </div>
      )}

      {loadCount < 2 && hasMore && (
        <div ref={ref} className="h-20">
          {loading && <div className="text-center text-gray-400">Loading more companions...</div>}
        </div>
      )}
    </div>
  );
};

export default Gallery;
