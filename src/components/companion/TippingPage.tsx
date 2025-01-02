import { useParams } from "react-router-dom";
import { useTipping } from "@lib/tipping/hooks/useTipping";
import { TippingStats } from "@lib/tipping/components/TippingStats";
import { TippingForm } from "@lib/tipping/components/TippingForm";
import { Button } from "../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TippingPage() {
  const { creatorId, creatorName } = useParams();
  const navigate = useNavigate();
  const {
    state,
    setTipAmount,
    handleTip,
    handleCustomAmountChange
  } = useTipping(creatorId);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto space-y-8">
        <TippingForm
          state={state}
          onTip={handleTip}
          onCustomTip={() => handleTip(parseFloat(state.customAmount))}
          onCustomAmountChange={handleCustomAmountChange}
          setTipAmount={setTipAmount}
        />

        <TippingStats state={state} creatorName={creatorName || ""} />
      </div>
    </div>
  );
}