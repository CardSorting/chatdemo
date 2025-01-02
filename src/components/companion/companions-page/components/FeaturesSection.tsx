import { Card } from "../../../../components/ui/card";
import { Brain, Clock, Zap, Globe } from "lucide-react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, i) => (
          <Card key={i} className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <feature.icon className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}