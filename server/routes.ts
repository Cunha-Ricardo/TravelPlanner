import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  chatMessageSchema, 
  itineraryParamsSchema, 
  checklistParamsSchema,
  currencyConvertSchema 
} from "../shared/schema";
import { sendMessage, generateItinerary, generateChecklist } from "./services/openai";
import { getExchangeRates, convertCurrency, getDolarRate } from "./services/currency";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - prefix all routes with /api

  // Health Check
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  // OpenAI Chat Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const data = chatMessageSchema.parse(req.body);
      const response = await sendMessage(data.message);
      return res.status(200).json({ response });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      console.error("Error in chat API:", error);
      return res.status(500).json({ 
        message: "Erro ao processar sua mensagem. Por favor, tente novamente." 
      });
    }
  });

  // Itinerary Routes
  app.post("/api/itinerary", async (req, res) => {
    try {
      const data = itineraryParamsSchema.parse(req.body);
      const itinerary = await generateItinerary(data);
      return res.status(200).json(itinerary);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      console.error("Error in itinerary API:", error);
      return res.status(500).json({ 
        message: "Erro ao gerar o roteiro. Por favor, tente novamente." 
      });
    }
  });

  // Checklist Routes
  app.post("/api/checklist", async (req, res) => {
    try {
      const data = checklistParamsSchema.parse(req.body);
      const checklist = await generateChecklist(data);
      return res.status(200).json(checklist);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      console.error("Error in checklist API:", error);
      return res.status(500).json({ 
        message: "Erro ao gerar a lista de itens. Por favor, tente novamente." 
      });
    }
  });

  // Currency Routes
  app.get("/api/currency/rates", async (_req, res) => {
    try {
      const rates = await getExchangeRates();
      return res.status(200).json(rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar as taxas de câmbio. Por favor, tente novamente." 
      });
    }
  });

  app.post("/api/currency/convert", async (req, res) => {
    try {
      const data = currencyConvertSchema.parse(req.body);
      const result = await convertCurrency(data.from, data.to, data.amount);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      console.error("Error converting currency:", error);
      return res.status(500).json({ 
        message: "Erro ao converter moeda. Por favor, tente novamente." 
      });
    }
  });

  app.get("/api/currency/dolar", async (_req, res) => {
    try {
      const rate = await getDolarRate();
      return res.status(200).json(rate);
    } catch (error) {
      console.error("Error fetching USD rate:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar a cotação do dólar. Por favor, tente novamente." 
      });
    }
  });

  // Destinations API (for searching and filtering destinations)
  app.get("/api/destinations", async (req, res) => {
    try {
      const searchTerm = req.query.search as string || "";
      const continent = req.query.continent as string || "";
      const type = req.query.type as string || "";
      
      const destinations = await storage.searchDestinations(searchTerm, continent, type);
      return res.status(200).json(destinations);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar destinos. Por favor, tente novamente." 
      });
    }
  });

  // User data storage (if the user is logged in)
  app.get("/api/user/itineraries", async (req, res) => {
    try {
      // In a real app, you would get the user ID from the session
      const userId = 1; // Mock user ID
      const itineraries = await storage.getItinerariesByUserId(userId);
      return res.status(200).json(itineraries);
    } catch (error) {
      console.error("Error fetching user itineraries:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar roteiros do usuário. Por favor, tente novamente." 
      });
    }
  });

  app.get("/api/user/checklists", async (req, res) => {
    try {
      // In a real app, you would get the user ID from the session
      const userId = 1; // Mock user ID
      const checklists = await storage.getChecklistsByUserId(userId);
      return res.status(200).json(checklists);
    } catch (error) {
      console.error("Error fetching user checklists:", error);
      return res.status(500).json({ 
        message: "Erro ao buscar listas do usuário. Por favor, tente novamente." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
