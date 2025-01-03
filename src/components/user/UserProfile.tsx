import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../landing/Footer";
import { getCompanionsByUser } from "../../services/companion/companionService";
import Gallery from "../landing/Gallery";
import { Card } from "../ui/card";
import LoadingSpinner from "../ui/loading-spinner";
import { User, Bot, MessageCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { useProfile } from "../../hooks/useProfile";
import { UserDetails } from "../../types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Companion } from "../../lib/companions";

const UserProfile = () => {
  const { userId } = useParams();
  const { profile, loading: profileLoading } = useProfile(userId) as { profile: UserDetails | null, loading: boolean };
  const navigate = useNavigate();

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <LoadingSpinner className="w-12 h-12 text-green-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="relative bg-gradient-to-b from-green-500/10 via-green-500/5 to-transparent py-16 mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent opacity-50 animate-pulse-slow" />
        <div className="container mx-auto px-4 relative">
          <div className="flex items-start gap-6 mb-8">
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {profile?.username || "Collection For You"}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">{profile?.companions_count || 0} companions</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">{profile?.total_messages || 0} messages</span>
              </div>
            </div>
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
                {profile?.companions_count || 0} companions
              </Badge>
            </div>
            
            {profileLoading ? (
              <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <LoadingSpinner className="w-12 h-12 text-green-400 animate-spin" />
                <p className="text-gray-400">Loading profile...</p>
              </div>
            ) : profile?.recent_companions ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.recent_companions.map((companion) => (
                  <Card 
                    key={companion.id}
                    className="bg-gray-800/50 hover:bg-gray-800/70 transition-colors cursor-pointer"
                    onClick={() => navigate(`/companion/${companion.id}`)}
                  >
                    <div className="p-4 flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={companion.avatar_url} />
                        <AvatarFallback>{companion.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">{companion.name}</h3>
                        <p className="text-sm text-gray-400 line-clamp-2">{companion.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <MessageCircle className="w-4 h-4" />
                            {companion.messages_count}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No companions found
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
