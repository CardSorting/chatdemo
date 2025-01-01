import React from "react";
import { Card } from "@/components/ui/card";
import { Brain, HardDrive, MessageSquare, Sparkles } from "lucide-react";

interface ValueProp {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const valueProps: ValueProp[] = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "Personality Customization",
    description:
      "Create a unique AI companion that matches your preferences. Adjust traits, interests, and communication style to build your perfect digital friend.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <HardDrive className="w-8 h-8" />,
    title: "Advanced Memory System",
    description:
      "Your companion remembers past conversations and learns from every interaction, creating a more meaningful and personalized experience over time.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Natural Conversations",
    description:
      "Engage in fluid, context-aware discussions that feel genuine. Our AI understands nuance, humor, and emotional context.",
    gradient: "from-purple-500 to-pink-500",
  },
];

const ValueProps = () => {
  return (
    <section className="w-full bg-black py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-matrix-grid bg-matrix-cell opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="text-center mb-16 relative">
          <Sparkles className="w-6 h-6 text-green-500 absolute -top-8 left-1/2 transform -translate-x-1/2 animate-float-slow" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-text-shimmer bg-clip-text text-transparent bg-[linear-gradient(to_right,#22c55e,#3b82f6,#22c55e)] bg-[length:200%_auto]">
            Key Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Experience the next generation of AI companionship with our
            cutting-edge features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <Card
              key={index}
              className="group relative bg-black/40 backdrop-blur-sm border-green-500/20 hover:border-green-500/40 transition-all duration-500 overflow-hidden transform hover:scale-[1.02] hover:-translate-y-1"
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${prop.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <div className="relative p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${prop.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <div className="text-transparent bg-clip-text bg-gradient-to-br animate-text-shimmer bg-[linear-gradient(to_right,#22c55e,#3b82f6,#22c55e)] bg-[length:200%_auto]">
                      {prop.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                    {prop.title}
                  </h3>

                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                    {prop.description}
                  </p>

                  {/* Hover line effect */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>
    </section>
  );
};

export default ValueProps;
