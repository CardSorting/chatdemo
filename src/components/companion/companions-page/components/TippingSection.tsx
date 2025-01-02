import { Button } from "../../../../components/ui/button";
import { Gift } from "lucide-react";
import { TooltipProvider } from "../../../../components/ui/tooltip";
import { useTipping } from "../../../../lib/tipping/hooks/useTipping";
import { TippingStats } from "../../../../lib/tipping/components/TippingStats";
import { useNavigate } from "react-router-dom";

export function TippingSection({ creatorId, creatorName }) {
  const { state } = useTipping(creatorId);
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <Button 
          className="w-full gap-2 h-12 transition-all hover:scale-[1.02]" 
          size="lg" 
          variant="outline"
          onClick={() => navigate(`/companions/${creatorId}/tip`)}
        >
          <Gift className="w-5 h-5" />
          Support {creatorName}
        </Button>

        <TippingStats state={state} creatorName={creatorName} />
      </div>
    </TooltipProvider>
  );
}