import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchForm } from "@/components/travel/SearchForm";
import { ItineraryBuilder } from "@/components/travel/ItineraryBuilder";
import { ChatbotInterface } from "@/components/travel/ChatbotInterface";
import { PackingListGenerator } from "@/components/travel/PackingListGenerator";
import { RecommendationEngine } from "@/components/travel/RecommendationEngine";
import { TravelJournal } from "@/components/travel/TravelJournal";
import { TranslationGuide } from "@/components/travel/TranslationGuide";

export default function TravelToolsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Travel Tools</h1>

      <Tabs defaultValue="search">
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="packing">Packing List</TabsTrigger>
          <TabsTrigger value="journal">Travel Journal</TabsTrigger>
          <TabsTrigger value="translation">Translation & Customs</TabsTrigger>
          <TabsTrigger value="assistant">Travel Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Search Flights & Accommodations</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchForm />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1551279076-6887dee32c7e"
                      alt="Paris"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1683893884572-05ad954122b3"
                      alt="Tokyo"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Travel Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>• Book flights 3-4 months in advance</li>
                    <li>• Check visa requirements early</li>
                    <li>• Consider travel insurance</li>
                    <li>• Research local customs and etiquette</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <RecommendationEngine />
        </TabsContent>

        <TabsContent value="itinerary">
          <Card>
            <CardHeader>
              <CardTitle>Build Your Itinerary</CardTitle>
            </CardHeader>
            <CardContent>
              <ItineraryBuilder />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packing">
          <Card>
            <CardHeader>
              <CardTitle>Smart Packing List</CardTitle>
            </CardHeader>
            <CardContent>
              <PackingListGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journal">
          <Card>
            <CardHeader>
              <CardTitle>Travel Journal</CardTitle>
            </CardHeader>
            <CardContent>
              <TravelJournal />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="translation">
          <Card>
            <CardHeader>
              <CardTitle>Translation & Local Customs Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <TranslationGuide />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistant">
          <Card>
            <CardHeader>
              <CardTitle>Travel Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatbotInterface />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}