import { useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Button } from "../../../../components/ui/button";
import { Star, ChevronRight, HelpCircle, Flag, ChevronDown, ChevronUp, CheckCircle, ThumbsUp, ThumbsDown, Search, Edit, Share, AlertTriangle, History, Pin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { Progress } from "../../../../components/ui/progress";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { Label } from "../../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Skeleton } from "../../../../components/ui/skeleton";

interface Review {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
  is_verified: boolean;
  images?: string[];
  developer_response?: string;
  sentiment?: "positive" | "neutral" | "negative";
  helpful_percentage?: number;
  is_pinned?: boolean;
  version_history?: string[];
  content_warning?: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  isLoading: boolean;
}

export function ReviewsSection({ reviews, isLoading }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState("mostHelpful");
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [reportReason, setReportReason] = useState("");

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: totalReviews > 0 
      ? (reviews.filter((r) => r.rating === rating).length / totalReviews) * 100
      : 0,
  }));

  // Filter and sort reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = selectedRating === 0 || review.rating === selectedRating;
    return matchesSearch && matchesRating;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "mostHelpful") return b.helpful_count - a.helpful_count;
    if (sortBy === "mostRecent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return b.rating - a.rating;
  });

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleReport = (reviewId: string) => {
    // Implement report functionality
    console.log(`Reported review ${reviewId} for reason: ${reportReason}`);
    setReportReason("");
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-96" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (totalReviews === 0) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-bold">No Reviews Yet</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Be the first to share your experience with this companion!
            </p>
            <Button className="gap-2">
              Write a Review
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Review Summary */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="space-y-4 flex-1">
          <h2 className="text-2xl font-bold">User Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-4xl font-bold">{averageRating}</div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                      fill={star <= Math.round(Number(averageRating)) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button className="gap-2">
              Write a Review
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="w-full md:w-96 space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-10">
                <span className="text-sm">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <Progress value={percentage} className="h-2 flex-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300 w-10 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mostHelpful">Most Helpful</SelectItem>
              <SelectItem value="mostRecent">Most Recent</SelectItem>
              <SelectItem value="highestRating">Highest Rating</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRating.toString()} onValueChange={(value) => setSelectedRating(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Ratings</SelectItem>
              {[5, 4, 3, 2, 1].map((rating) => (
                <SelectItem key={rating} value={rating.toString()}>
                  {rating} Star{rating > 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.slice(0, visibleReviews).map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>{review.user_id[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {/* Review Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{review.user_id}</h4>
                    {review.is_verified && (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                    {review.is_pinned && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Pin className="w-3 h-3" />
                            Pinned
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>This review has been highlighted by the developer</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
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

                {/* Content Warning */}
                {review.content_warning && (
                  <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                      {review.content_warning}
                    </p>
                  </div>
                )}

                {/* Review Content */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {review.comment}
                </p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 my-4">
                    {review.images.map((image, idx) => (
                      <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Review image ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Developer Response */}
                {review.developer_response && (
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>D</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Developer Response</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {review.developer_response}
                    </p>
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <p className="text-gray-400 text-xs">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </p>
                    {review.version_history && review.version_history.length > 1 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Button variant="ghost" size="sm" className="gap-1 text-xs">
                            <History className="w-3 h-3" />
                            Edited
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-2">
                            <p className="font-medium">Edit History</p>
                            {review.version_history.map((version, idx) => (
                              <p key={idx} className="text-sm">
                                Version {idx + 1}: {formatDistanceToNow(new Date(version), { addSuffix: true })}
                              </p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs"
                      onClick={() => handleHelpfulClick(review.id)}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      Helpful ({helpfulVotes[review.id] ? review.helpful_count + 1 : review.helpful_count})
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                          <Flag className="w-3 h-3" />
                          Report
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium">Report Review</h4>
                          <RadioGroup
                            value={reportReason}
                            onValueChange={setReportReason}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="spam" id="spam" />
                              <Label htmlFor="spam">Spam or misleading</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="inappropriate" id="inappropriate" />
                              <Label htmlFor="inappropriate">Inappropriate content</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="hate" id="hate" />
                              <Label htmlFor="hate">Hate speech or symbols</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">Other</Label>
                            </div>
                          </RadioGroup>
                          <Button
                            size="sm"
                            onClick={() => handleReport(review.id)}
                          >
                            Submit Report
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <Share className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-xs">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {visibleReviews < sortedReviews.length && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleReviews((prev) => prev + 3)}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </section>
  );
}