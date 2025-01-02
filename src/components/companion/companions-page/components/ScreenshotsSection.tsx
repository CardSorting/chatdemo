import { useState, useEffect, useCallback } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { ChevronLeft, ChevronRight, Maximize, X } from "lucide-react";

interface ScreenshotsSectionProps {
  screenshots?: string[];
}

export function ScreenshotsSection({ screenshots = [] }: ScreenshotsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
    setProgress(0);
  }, [screenshots.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
    setProgress(0);
  }, [screenshots.length]);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    setIsAutoPlaying(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape" && isFullScreen) toggleFullScreen();
  }, [goToPrevious, goToNext, isFullScreen, toggleFullScreen]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isAutoPlaying || screenshots.length === 0) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, screenshots.length]);

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${isFullScreen ? "fixed inset-0 z-50 bg-black/95 p-8" : ""}`}>
      <Card className={`aspect-[4/3] bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl p-4 ${
        isFullScreen ? "h-full" : ""
      }`}>
        <div className="relative h-full">
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </Button>
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Maximize className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>

          <div className="h-full w-full flex items-center justify-center">
            <img
              src={screenshots[currentIndex]}
              alt={`Screenshot ${currentIndex + 1}`}
              className="h-full w-full object-contain rounded-lg transition-opacity duration-300"
              loading="lazy"
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 h-1 bg-gray-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-50"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {screenshots.map((screenshot, i) => (
          <Button
            key={i}
            variant="ghost"
            className={`h-16 w-16 p-0 overflow-hidden rounded-lg border-2 transition-all ${
              i === currentIndex ? "border-blue-500 scale-105" : "border-transparent"
            }`}
            onClick={() => {
              setCurrentIndex(i);
              setProgress(0);
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <img
              src={screenshot}
              alt={`Thumbnail ${i + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </Button>
        ))}
      </div>
    </div>
  );
}