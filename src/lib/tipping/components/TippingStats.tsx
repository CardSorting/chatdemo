import { Card } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Trophy, History, Zap, Heart } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { TippingState, TippingStatsProps } from "../types";
import { getProgressValue } from "../utils/tippingUtils";

export function TippingStats({ state, creatorName }: TippingStatsProps) {
  return (
    <>
      {/* Milestones */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-lg">Creator Milestones</h3>
        </div>
        <div className="space-y-4">
          {state.milestones?.map((milestone, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{milestone.description}</span>
                <span>{milestone.current}/{milestone.goal} Pulse</span>
              </div>
              <div className="relative h-2">
                <Progress
                  value={getProgressValue(milestone.current, milestone.goal)}
                  className="h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Supporters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-lg">Top Supporters</h3>
        </div>
        <div className="space-y-3">
          {state.topTippers?.map((tipper, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                <span className="font-medium">{tipper.username}</span>
              </div>
              <Badge variant="secondary" className="ml-2">
                {tipper.totalTips} Pulse
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-lg">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {state.recentTips?.map((tip, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{tip.amount} Pulse</Badge>
                <span className="text-sm text-gray-600">{tip.sender}</span>
              </div>
              <span className="text-sm text-gray-500">{tip.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Community Impact */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-primary" />
          <h3 className="font-medium text-lg">Community Impact</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Your support enables {creatorName} to create more content and improve the platform for everyone. Join our community of supporters and help shape the future of this project.
        </p>
      </Card>
    </>
  );
}