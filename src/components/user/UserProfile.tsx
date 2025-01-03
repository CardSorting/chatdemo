import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../landing/Footer";
import { getCompanionsByUser } from "../../services/companion/companionService";
import Gallery from "../landing/Gallery";
import { Card } from "../ui/card";
import LoadingSpinner from "../ui/loading-spinner";
import { User, Bot } from "lucide-react";
import { Badge } from "../ui/badge";
import { useProfile } from "../../hooks/useProfile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Companion } from "../../lib/companions";

const UserProfile = () => {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const navigate = useNavigate();

  const fetchUserCompanions = async (page: number): Promise<Companion[]> => {
    if (!profile?.id) return [];
    try {
      const data = await getCompanionsByUser(profile.id);
      return data;
    } catch (error) {
      console.error("Error fetching user companions:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadInitialCompanions = async () => {
      if (!profile?.id) return;
      
      setLoading(true);
      try {
        const data = await fetchUserCompanions(1);
        setCompanions(data);
      } catch (error) {
        console.error("Error fetching user companions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCompanions();
  }, [profile]);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="relative bg-gradient-to-b from-green-500/10 via-green-500/5 to-transparent py-16 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent opacity-50 animate-pulse-slow" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-start gap-6 mb-8">
            <div className="bg-green-500/10 p-4 rounded-xl backdrop-blur-sm">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  <User className="w-8 h-8 text-green-400" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                {profile?.username || "User Profile"}
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                {profile?.bio || "This is your profile page where you can view your submitted companions."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Bot className="w-6 h-6 text-green-400" />
                Your Companions
              </h2>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                {companions.length} companions
              </Badge>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <LoadingSpinner className="w-12 h-12 text-green-400 animate-spin" />
                <p className="text-gray-400">Loading your companions...</p>
              </div>
            ) : (
              <Gallery 
                fetchCompanions={fetchUserCompanions}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;