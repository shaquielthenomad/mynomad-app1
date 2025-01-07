import type { Express } from "express";
import { createServer, type Server } from "http";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import { setupAuth } from "./auth";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is required");
}

// Initialize Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const travelModel = genAI.getGenerativeModel({ model: "gemini-pro" });

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Add download endpoint for the exported zip
  app.get("/api/export/download", (req, res) => {
    const exportPath = path.join(process.cwd(), "export", "mynomad-local.zip");

    if (!fs.existsSync(exportPath)) {
      return res.status(404).json({ error: "Export file not found" });
    }

    res.download(exportPath);
  });

  // Packing List Generation API
  app.post("/api/packing-list", async (req, res) => {
    try {
      const { destination, duration, season } = req.body;

      if (!destination || !duration || !season) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      console.log('Generating packing list for:', { destination, duration, season });

      const prompt = `Generate a packing list for a trip to ${destination} for ${duration} during ${season}.
      Return ONLY a JSON object with this structure (no explanation, no markdown):
      {
        "items": [
          {
            "id": "1",
            "category": "Essentials",
            "item": "Passport",
            "checked": false
          }
        ]
      }

      Categories must be one of: Essentials, Clothing, Toiletries, Electronics, or Miscellaneous.
      Include appropriate items for ${destination}'s climate during ${season}.

      IMPORTANT: Return ONLY the JSON object, no other text or formatting.`;

      console.log('Sending prompt to Gemini AI');
      const result = await travelModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Raw response from Gemini AI:', text);

      // Clean up the response text
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      console.log('Cleaned response:', cleanedText);

      try {
        // Parse the JSON response
        const packingList = JSON.parse(cleanedText);

        if (!packingList.items || !Array.isArray(packingList.items)) {
          throw new Error('Invalid response format: missing items array');
        }

        // Add metadata
        const finalResponse = {
          ...packingList,
          destination,
          duration,
          season
        };

        console.log('Sending final response:', finalResponse);
        res.json(finalResponse);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError, '\nText:', cleanedText);
        res.status(500).json({ 
          error: 'Failed to parse AI response',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        });
      }
    } catch (error) {
      console.error('Packing list generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        error: 'Failed to generate packing list',
        details: errorMessage 
      });
    }
  });

  // Travel Recommendations API
  app.post("/api/recommendations", async (req, res) => {
    try {
      const preferences = req.body;

      const prompt = `Generate 3 personalized travel destination recommendations based on these preferences:
      - Budget: ${preferences.budget}
      - Travel Style: ${preferences.travelStyle}
      - Preferred Climate: ${preferences.preferredClimate}
      - Activity Level (1-5): ${preferences.activityLevel}
      - Accommodation: ${preferences.accommodation}
      
      Format the response as a JSON object with this structure:
      {
        "recommendations": [
          {
            "destination": "City, Country",
            "description": "Brief description of why this matches their preferences",
            "activities": ["Activity 1", "Activity 2", "Activity 3"],
            "accommodation": "Specific accommodation recommendation",
            "bestTimeToVisit": "Best season or months to visit",
            "estimatedBudget": "Estimated daily budget range"
          }
        ]
      }`;

      const result = await travelModel.generateContent(prompt);
      const response = await result.response;
      const recommendations = JSON.parse(response.text());
      res.json(recommendations);
    } catch (error) {
      console.error('Recommendations generation error:', error);
      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  });

  // Journal API
  app.post("/api/journal", async (req, res) => {
    try {
      const { location, content, date } = req.body;

      const prompt = `Analyze this travel journal entry and categorize it. Location: ${location}
      Entry: ${content}
      
      Please analyze this travel memory and respond with a JSON object that includes:
      1. Categories: 2-4 relevant tags (e.g., "Food & Dining", "Cultural Experience", "Adventure", "Relaxation", etc.)
      2. Sentiment: A brief emotional tone of the memory (e.g., "Excited", "Peaceful", "Nostalgic")
      
      Format the response as:
      {
        "categories": ["category1", "category2", "category3"],
        "sentiment": "emotional_tone"
      }`;

      const result = await travelModel.generateContent(prompt);
      const response = await result.response;
      const analysis = JSON.parse(response.text());

      const journalEntry = {
        id: Date.now().toString(),
        date,
        location,
        content,
        categories: analysis.categories,
        sentiment: analysis.sentiment
      };

      res.json(journalEntry);
    } catch (error) {
      console.error('Journal analysis error:', error);
      res.status(500).json({ error: 'Failed to process journal entry' });
    }
  });

  // Translation API
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;

      const prompt = `Translate the following text to ${targetLanguage}:
      "${text}"
      
      Only respond with the translated text, no additional context or formatting.`;

      const result = await travelModel.generateContent(prompt);
      const response = await result.response;
      const translation = response.text().trim();

      res.json({ translation });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ error: 'Failed to translate text' });
    }
  });

  // Local Customs API
  app.post("/api/customs", async (req, res) => {
    try {
      const { destination } = req.body;

      const prompt = `Provide local customs, etiquette, and cultural information for ${destination}.
      Focus on practical tips that travelers should know.
      
      Format the response as a JSON object with this structure:
      {
        "customs": [
          {
            "category": "Category name (e.g., Dining Etiquette, Greetings, etc.)",
            "customs": ["Custom 1", "Custom 2", "Custom 3"]
          }
        ]
      }
      
      Include at least 3-4 categories with 3-5 customs each. Make sure the information is accurate and culturally sensitive.`;

      const result = await travelModel.generateContent(prompt);
      const response = await result.response;
      const customs = JSON.parse(response.text());

      res.json(customs);
    } catch (error) {
      console.error('Customs lookup error:', error);
      res.status(500).json({ error: 'Failed to fetch customs information' });
    }
  });

  // Deployment endpoints
  app.post("/api/deploy/local", async (req, res) => {
    try {
      const exportDir = path.join(process.cwd(), "export");
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Create a zip archive
      const output = fs.createWriteStream(path.join(exportDir, "mynomad-local.zip"));
      const archive = archiver("zip");

      output.on("close", () => {
        res.json({
          success: true,
          message: "Application exported successfully",
          size: archive.pointer(),
          downloadUrl: "/api/export/download"
        });
      });

      archive.on("error", (err) => {
        throw err;
      });

      archive.pipe(output);

      // Add deployment files
      archive.file("Dockerfile", { name: "Dockerfile" });
      archive.file("README.md", { name: "README.md" });
      archive.file("package.json", { name: "package.json" });
      archive.file(".env.example", { name: ".env.example" });

      // Add source directories
      archive.directory("client/", "client/");
      archive.directory("server/", "server/");
      archive.directory("db/", "db/");

      // Add configuration files
      ["tsconfig.json", "vite.config.ts", "tailwind.config.ts", "postcss.config.js"]
        .forEach(file => {
          if (fs.existsSync(file)) {
            archive.file(file, { name: file });
          }
        });

      await archive.finalize();
    } catch (error) {
      console.error("Local deployment error:", error);
      res.status(500).json({ error: "Failed to export application" });
    }
  });

  app.post("/api/deploy/cloud", async (req, res) => {
    try {
      // Verify Google Cloud credentials
      if (!process.env.GOOGLE_CLOUD_PROJECT) {
        throw new Error("Google Cloud Project ID not configured");
      }

      // Execute cloud deployment steps
      const steps = [
        "gcloud auth configure-docker",
        `docker build -t gcr.io/${process.env.GOOGLE_CLOUD_PROJECT}/mynomad .`,
        `docker push gcr.io/${process.env.GOOGLE_CLOUD_PROJECT}/mynomad`,
        `gcloud run deploy mynomad --image gcr.io/${process.env.GOOGLE_CLOUD_PROJECT}/mynomad --platform managed --region us-central1 --allow-unauthenticated`
      ];

      for (const step of steps) {
        execSync(step, { stdio: "inherit" });
      }

      res.json({
        success: true,
        message: "Application deployed to Google Cloud successfully"
      });
    } catch (error) {
      console.error("Cloud deployment error:", error);
      res.status(500).json({ error: error.message || "Failed to deploy to Google Cloud" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}