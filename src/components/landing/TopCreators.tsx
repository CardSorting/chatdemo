import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const TopCreators = () => {
  return (
    <section className="w-full bg-black py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
          <p className="text-gray-400">Coming Soon</p>
        </Card>
      </div>
    </section>
  );
};

export default TopCreators;
