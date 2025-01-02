import React, { useState, useEffect, useCallback } from "react";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Plus,
  Search,
  Flame,
  Clock,
  ThumbsUp,
  MessageSquare,
  Tags,
  X,
} from "lucide-react";
import {
  Companion,
  fetchCompanions,
  fetchCompanionCount,
  fetchLikedStatuses,
  toggleCompanionLike,
  trackCompanionAction,
} from "../../lib/companions";
import { useAuth } from "../../hooks/useAuth";

interface GalleryProps {
  itemsPerPage?: number;
}

type SortOption = "trending" | "newest" | "popular" | "active";

const Gallery = ({ itemsPerPage = 6 }: GalleryProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedCompanions, setLikedCompanions] = useState<Record<string, boolean>>({});

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const [showSidebar, setShowSidebar] = useState(true);
  const [minLikes, setMinLikes] = useState<number | "">("");
  const [minMessages, setMinMessages] = useState<number | "">("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const loadCompanions = useCallback(async () => {
    try {
      setLoading(true);
      const [data, count] = await Promise.all([
        fetchCompanions(currentPage, itemsPerPage),
        fetchCompanionCount(),
      ]);
      setCompanions(data);
      setTotalCount(count);

      if (user?.id) {
        const likedMap = await fetchLikedStatuses(data.map(c => c.id), user.id);
        setLikedCompanions(likedMap);
      }
    } catch (error) {
      console.error("Error loading companions:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, user?.id]);

  useEffect(() => {
    loadCompanions();
  }, [loadCompanions]);

  const handleLike = async (companionId: string) => {
    if (!user?.id) return;
    
    try {
      const newLikedState = await toggleCompanionLike(companionId, user.id);
      setLikedCompanions(prev => ({ ...prev, [companionId]: newLikedState }));
      
      // Optimistically update the likes count
      setCompanions(prev => prev.map(c => 
        c.id === companionId ? { 
          ...c, 
          likes_count: c.likes_count + (newLikedState ? 1 : -1) 
        } : c
      ));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleChatClick = async (companionId: string, chatUrl: string) => {
    try {
      await trackCompanionAction(companionId, "chat");
      window.open(chatUrl, "_blank");
      
      // Optimistically update the messages count
      setCompanions(prev => prev.map(c => 
        c.id === companionId ? { 
          ...c, 
          messages_count: c.messages_count + 1 
        } : c
      ));
    } catch (error) {
      console.error("Error tracking chat:", error);
      window.open(chatUrl, "_blank");
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentItems = companions;

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // ... rest of the component remains the same ...

  return (
    <section className="w-full bg-black py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-matrix-grid bg-matrix-cell opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h2 className="text-4xl md:text-5xl font-bold animate-text-shimmer bg-clip-text text-transparent bg-[linear-gradient(to_right,#22c55e,#3b82f6,#22c55e)] bg-[length:200%_auto]">
              Discover Companions
            </h2>
            <Button
              onClick={() => navigate("/submit")}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Submit Companion
            </Button>
          </div>
        </div>

        {/* ... rest of the JSX remains the same ... */}
      </div>
    </section>
  );
};

export default Gallery;
