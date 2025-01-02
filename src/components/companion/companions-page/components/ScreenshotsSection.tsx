import { Card } from "../../../../components/ui/card";

interface ScreenshotsSectionProps {
  screenshots: string[];
}

export function ScreenshotsSection({ screenshots }: ScreenshotsSectionProps) {
  return (
    <div className="relative">
      <Card className="aspect-[4/3] bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-4 h-full">
          {screenshots.map((screenshot, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
            >
              <img
                src={screenshot}
                alt={`Screenshot ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
            </div>
          ))}
        </div>
      </Card>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex gap-2">
          {screenshots.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === 0 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}