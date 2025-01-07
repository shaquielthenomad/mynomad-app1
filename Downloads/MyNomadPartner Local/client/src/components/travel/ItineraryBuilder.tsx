import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItineraryItem {
  id: number;
  time: string;
  activity: string;
  notes: string;
}

export function ItineraryBuilder() {
  const [items, setItems] = useState<ItineraryItem[]>([
    { id: 1, time: "09:00", activity: "Breakfast", notes: "Local cafe" },
    { id: 2, time: "10:30", activity: "Sightseeing", notes: "City tour" },
  ]);

  const addItem = () => {
    const newItem: ItineraryItem = {
      id: items.length + 1,
      time: "",
      activity: "",
      notes: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: keyof ItineraryItem,
    value: string
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "grid grid-cols-[auto_1fr_2fr_2fr_auto] gap-4 items-center p-4 rounded-lg border",
              index % 2 === 0 ? "bg-background" : "bg-muted"
            )}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
            
            <Input
              type="time"
              value={item.time}
              onChange={(e) => updateItem(item.id, "time", e.target.value)}
              className="w-full"
            />

            <Input
              placeholder="Activity"
              value={item.activity}
              onChange={(e) => updateItem(item.id, "activity", e.target.value)}
            />

            <Textarea
              placeholder="Notes"
              value={item.notes}
              onChange={(e) => updateItem(item.id, "notes", e.target.value)}
              className="h-10 resize-none"
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button onClick={addItem} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Activity
      </Button>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Save Draft</Button>
        <Button>Save Itinerary</Button>
      </div>
    </div>
  );
}
