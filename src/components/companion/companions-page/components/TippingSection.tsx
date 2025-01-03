import { Button } from "../../../../components/ui/button";
import { Gift, Loader2 } from "lucide-react";
import { TooltipProvider } from "../../../../components/ui/tooltip";
import { useTipping } from "../../../../lib/tipping/hooks/useTipping";
import { useNavigate } from "react-router-dom";

interface TippingSectionProps {
  creatorId: string;
  creatorName?: string;
}

export function TippingSection({ creatorId, creatorName }: TippingSectionProps) {
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
          disabled={state.isLoading}
        >
          {state.isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Gift className="w-5 h-5" />
          )}
          Support {creatorName || 'Creator'}
        </Button>
      </div>
    </TooltipProvider>
  );
}
