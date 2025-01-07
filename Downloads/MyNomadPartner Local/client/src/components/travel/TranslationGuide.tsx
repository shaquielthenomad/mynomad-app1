import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Globe2, Info } from "lucide-react";

const commonLanguages = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
];

interface CustomsInfo {
  category: string;
  customs: string[];
}

export function TranslationGuide() {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [destination, setDestination] = useState("");
  const [translation, setTranslation] = useState("");
  const [customsInfo, setCustomsInfo] = useState<CustomsInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const translate = async () => {
    if (!text || !targetLanguage) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const data = await response.json();
      setTranslation(data.translation);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCustoms = async () => {
    if (!destination) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/customs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch customs information");
      }

      const data = await response.json();
      setCustomsInfo(data.customs);
    } catch (error) {
      console.error("Customs lookup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Translation</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter text to translate..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[100px]"
              />
              <Select
                value={targetLanguage}
                onValueChange={setTargetLanguage}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target language" />
                </SelectTrigger>
                <SelectContent>
                  {commonLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={translate}
                disabled={isLoading || !text || !targetLanguage}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Translate
              </Button>
              {translation && (
                <div className="mt-4 p-4 rounded-lg bg-muted">
                  <p className="text-sm">{translation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Local Customs & Etiquette</h3>
            <div className="space-y-4">
              <Input
                placeholder="Enter destination (e.g., Japan, France)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              <Button
                onClick={getCustoms}
                disabled={isLoading || !destination}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Local Customs
              </Button>
              {customsInfo.length > 0 && (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {customsInfo.map((info, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          {info.category}
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {info.customs.map((custom, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              {custom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
