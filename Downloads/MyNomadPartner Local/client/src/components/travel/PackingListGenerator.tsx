import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  duration: z.string().min(1, "Duration is required"),
  season: z.string().min(1, "Season is required"),
});

interface PackingItem {
  id: string;
  category: string;
  item: string;
  checked: boolean;
}

interface PackingList {
  items: PackingItem[];
  destination: string;
  duration: string;
  season: string;
}

export function PackingListGenerator() {
  const [packingList, setPackingList] = useState<PackingList | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      duration: "",
      season: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/packing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to generate packing list");
      }

      const data = await response.json();
      setPackingList(data);
    } catch (error) {
      console.error("Error generating packing list:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleItem = (itemId: string) => {
    if (!packingList) return;

    setPackingList({
      ...packingList,
      items: packingList.items.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Paris, France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 7 days" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Packing List
          </Button>
        </form>
      </Form>

      {packingList && (
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Packing List for {packingList.destination} ({packingList.duration})
          </h3>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {Object.entries(
                packingList.items.reduce<Record<string, PackingItem[]>>(
                  (acc, item) => {
                    if (!acc[item.category]) {
                      acc[item.category] = [];
                    }
                    acc[item.category].push(item);
                    return acc;
                  },
                  {}
                )
              ).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-medium text-muted-foreground mb-2">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                        />
                        <label
                          htmlFor={item.id}
                          className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {item.item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
