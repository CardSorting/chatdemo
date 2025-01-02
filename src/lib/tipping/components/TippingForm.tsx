import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Gift } from "lucide-react";
import { TippingState } from "../types/TippingTypes";

interface TippingFormProps {
  state: TippingState;
  onTip: (amount: number) => void;
  onCustomTip: () => void;
  onCustomAmountChange: (value: string) => void;
  setTipAmount: (amount: number) => void;
}

export function TippingForm({
  state,
  onTip,
  onCustomTip,
  onCustomAmountChange,
  setTipAmount
}: TippingFormProps) {
  const presetAmounts = [5, 10, 20, 50, 100];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {presetAmounts.map((amount) => (
          <Button
            key={amount}
            variant={state.selectedAmount === amount ? "default" : "outline"}
            onClick={() => {
              setTipAmount(amount);
              onTip(amount);
            }}
          >
            ${amount}
          </Button>
        ))}
      </div>

      <div className="flex gap-4">
        <Input
          type="number"
          placeholder="Custom amount"
          value={state.customAmount}
          onChange={(e) => onCustomAmountChange(e.target.value)}
        />
        <Button onClick={onCustomTip}>Custom Tip</Button>
      </div>

      <AnimatePresence>
        {state.showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Gift className="w-5 h-5" />
            Tip Sent Successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}