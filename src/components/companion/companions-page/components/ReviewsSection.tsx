import { Card } from "../../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Star, ChevronRight } from "lucide-react";

interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">User Reviews</h2>
        <Button variant="ghost" className="gap-2">
          See All <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>{review.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{review.user}</h4>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-yellow-400"
                        fill={star <= review.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {review.comment}
                </p>
                <p className="text-gray-400 text-xs mt-2">{review.date}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}