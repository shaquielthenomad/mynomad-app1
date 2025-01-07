import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Globe2, Loader2 } from "lucide-react";
import { TravelPreferences } from "./TravelPreferences";

interface Recommendation {
  destination: string;
  description: string;
  activities: string[];
  accommodation: string;
  bestTimeToVisit: string;
  estimatedBudget: string;
}

export function RecommendationEngine() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async (preferences: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Travel Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <TravelPreferences onSubmit={getRecommendations} isLoading={loading} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recommendations.length > 0 ? (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Globe2 className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-semibold">{rec.destination}</h3>
                            <p className="text-sm text-muted-foreground">
                              {rec.description}
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <strong>Best Time to Visit:</strong>{" "}
                                {rec.bestTimeToVisit}
                              </p>
                              <p className="text-sm">
                                <strong>Recommended Stay:</strong>{" "}
                                {rec.accommodation}
                              </p>
                              <p className="text-sm">
                                <strong>Estimated Budget:</strong>{" "}
                                {rec.estimatedBudget}
                              </p>
                              <div className="pt-2">
                                <strong className="text-sm">
                                  Suggested Activities:
                                </strong>
                                <ul className="list-disc list-inside text-sm pl-2 pt-1">
                                  {rec.activities.map((activity, idx) => (
                                    <li key={idx}>{activity}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <Globe2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Fill out your preferences to get personalized travel recommendations
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
