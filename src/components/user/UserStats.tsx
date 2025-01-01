import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot, Heart, MessageCircle, Trophy, Crown, Target } from "lucide-react";

interface UserStatsProps {
  stats: {
    total_companions: number;
    total_likes: number;
    total_messages: number;
    achievements_count: number;
    rank: number;
    top_category: string;
  };
}

const UserStats = ({ stats }: UserStatsProps) => {
  const statItems = [
    {
      icon: <Bot className="w-5 h-5" />,
      label: "Companions Created",
      value: stats.total_companions,
      gradient: "from-green-500 to-emerald-500",
      progress: Math.min((stats.total_companions / 30) * 100, 100), // Example: 30 as max
    },
    {
      icon: <Heart className="w-5 h-5" />,
      label: "Total Likes",
      value: stats.total_likes,
      gradient: "from-pink-500 to-rose-500",
      progress: Math.min((stats.total_likes / 10000) * 100, 100), // Example: 10000 as max
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      label: "Total Messages",
      value: stats.total_messages,
      gradient: "from-blue-500 to-indigo-500",
      progress: Math.min((stats.total_messages / 20000) * 100, 100), // Example: 20000 as max
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: "Achievements",
      value: stats.achievements_count,
      gradient: "from-yellow-500 to-amber-500",
      progress: Math.min((stats.achievements_count / 20) * 100, 100), // Example: 20 as max
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Rank Card */}
      <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20 col-span-full lg:col-span-1 order-first">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Global Rank</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                #{stats.rank}
              </p>
              <p className="text-gray-500">of creators</p>
            </div>
          </div>
          <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20">
            <Crown className="w-6 h-6 text-yellow-500" />
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      {statItems.map((item, index) => (
        <Card
          key={index}
          className="relative group overflow-hidden bg-black/50 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-300"
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
          />

          <div className="relative p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">{item.label}</p>
                <p
                  className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${item.gradient}`}
                >
                  {item.value.toLocaleString()}
                </p>
              </div>
              <div
                className={`p-3 rounded-full bg-gradient-to-br ${item.gradient} bg-opacity-10`}
              >
                {React.cloneElement(item.icon, {
                  className: `w-6 h-6 ${item.gradient.split(" ")[1]}`,
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress
                value={item.progress}
                className="h-1 bg-gray-800"
                indicatorClassName={`bg-gradient-to-r ${item.gradient}`}
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Progress</span>
                <span
                  className={`font-medium bg-clip-text text-transparent bg-gradient-to-r ${item.gradient}`}
                >
                  {Math.round(item.progress)}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UserStats;
