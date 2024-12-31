import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Terminal, Send, Sparkles, Zap, Command } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface ChatDemoProps {
  initialMessages?: Message[];
  isTyping?: boolean;
}

const defaultMessages: Message[] = [
  {
    id: 1,
    text: "Hello! I'm your Matrix Mingle AI companion.",
    sender: "ai",
    timestamp: "12:01",
  },
  {
    id: 2,
    text: "Hi! Can you tell me about yourself?",
    sender: "user",
    timestamp: "12:02",
  },
  {
    id: 3,
    text: "I'm a highly adaptable AI companion designed to engage in meaningful conversations and learn from our interactions.",
    sender: "ai",
    timestamp: "12:02",
  },
];

const ChatDemo = ({ isTyping = true }: ChatDemoProps) => {
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([
    defaultMessages[0],
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    const timeouts = defaultMessages.slice(1).map((message, index) => {
      return setTimeout(
        () => {
          setDisplayedMessages((prev) => [...prev, message]);
        },
        (index + 1) * 2000,
      );
    });

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, []);

  // Glow effect animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="w-[600px] h-[500px] bg-black/80 backdrop-blur-sm border-green-500/50 border-2 overflow-hidden p-4 relative group transition-all duration-500 hover:border-green-400 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-matrix-grid bg-matrix-cell opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-50" />

      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-green-500/30 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-green-500" />
          <span className="text-green-500 font-mono flex items-center gap-2">
            Matrix Terminal v1.0
            <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors duration-300" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors duration-300" />
          <div className="w-3 h-3 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors duration-300" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-[380px] overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-green-500/20 scrollbar-track-transparent pr-2">
        {displayedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg backdrop-blur-sm relative group/message transition-all duration-300 ${
                message.sender === "user"
                  ? "bg-blue-500/20 text-blue-200 hover:bg-blue-500/30"
                  : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
              }`}
            >
              {/* Message glow effect */}
              <div
                className={`absolute inset-0 rounded-lg transition-opacity duration-500 ${
                  message.sender === "user" ? "bg-blue-500/5" : "bg-green-500/5"
                } opacity-0 group-hover/message:opacity-100`}
              />

              <div className="relative z-10">
                <p className="font-mono">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block font-mono flex items-center gap-1">
                  <Command className="w-3 h-3" />
                  {message.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-green-500/10 text-green-400 p-3 rounded-lg backdrop-blur-sm">
              <div className="flex gap-2">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse delay-150">.</span>
                <span className="animate-pulse delay-300">.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-4 left-4 right-4">
        <div
          className={`flex gap-2 items-center bg-black/50 backdrop-blur-md border transition-all duration-500 ${isGlowing ? "border-green-400/70" : "border-green-500/30"} rounded-lg p-2 relative group/input`}
        >
          {/* Input glow effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-500" />

          <Zap className="w-5 h-5 text-green-500/50 group-hover/input:text-green-400 transition-colors duration-300" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono placeholder-green-500/50 relative z-10"
          />
          <button className="group/send relative p-2 hover:bg-green-500/10 rounded-full transition-colors duration-300">
            <Send className="w-5 h-5 text-green-500/50 group-hover/send:text-green-400 transform group-hover/send:scale-110 group-hover/send:rotate-12 transition-all duration-300" />
            <div className="absolute inset-0 bg-green-500/10 rounded-full scale-0 group-hover/send:scale-100 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
    </Card>
  );
};

export default ChatDemo;
