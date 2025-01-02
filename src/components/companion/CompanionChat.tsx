import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Companion, fetchCompanions } from "../../services/companion/companion";
import { Card } from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import ChatDemo from "../landing/ChatDemo";

const CompanionChat = () => {
  const { companionId } = useParams();
  const [companion, setCompanion] = useState<Companion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanion = async () => {
      try {
        const companions = await fetchCompanions();
        const found = companions.find((c) => c.id === companionId);
        setCompanion(found || null);
      } catch (error) {
        console.error("Error loading companion:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanion();
  }, [companionId]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
          <h1 className="text-xl text-white">Companion not found</h1>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black p-4 md:p-8 flex flex-col items-center">
      {/* Matrix-style background overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

      {/* Companion Info */}
      <Card className="w-full max-w-4xl bg-black/50 backdrop-blur-sm border-green-500/20 p-6 mb-8">
        <div className="flex items-center gap-4">
          <img
            src={companion.avatar_url}
            alt={companion.name}
            className="w-16 h-16 rounded-full border-2 border-green-500/50"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{companion.name}</h1>
            <p className="text-gray-400">Created by {companion.creator_name}</p>
          </div>
        </div>
        <p className="mt-4 text-gray-300">{companion.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {companion.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>

      {/* Chat Interface */}
      <div className="w-full max-w-4xl">
        <ChatDemo
          initialMessages={[
            {
              id: 1,
              text: `Hello! I'm ${companion.name}, your AI companion.`,
              sender: "ai",
              timestamp: "now",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default CompanionChat;
