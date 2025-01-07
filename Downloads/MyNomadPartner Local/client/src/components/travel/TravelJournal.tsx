import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface JournalEntry {
  id: string;
  date: string;
  location: string;
  content: string;
  categories: string[];
  sentiment: string;
}

export function TravelJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    location: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const submitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.location || !newEntry.content) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: newEntry.location,
          content: newEntry.content,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save journal entry");
      }

      const data = await response.json();
      setEntries((prev) => [data, ...prev]);
      setNewEntry({ location: "", content: "" });
    } catch (error) {
      console.error("Error saving journal entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={submitEntry} className="space-y-4">
        <div>
          <Input
            placeholder="Location (e.g., Paris, France)"
            value={newEntry.location}
            onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
            className="mb-2"
          />
          <Textarea
            placeholder="Write about your experience..."
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            className="min-h-[200px]"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Memory
        </Button>
      </form>

      <div className="border rounded-lg">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{entry.location}</h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm">{entry.content}</p>
                    <div className="flex items-center gap-2 pt-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-wrap gap-2">
                        {entry.categories.map((category, idx) => (
                          <span
                            key={idx}
                            className={cn(
                              "px-2 py-1 rounded-full text-xs",
                              "bg-primary/10 text-primary"
                            )}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground italic">
                      Sentiment: {entry.sentiment}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
