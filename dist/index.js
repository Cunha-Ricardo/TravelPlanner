// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  destinations;
  itineraries;
  checklists;
  chatMessages;
  exchangeRates;
  userCurrentId;
  destinationCurrentId;
  itineraryCurrentId;
  checklistCurrentId;
  chatMessageCurrentId;
  exchangeRateCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.destinations = /* @__PURE__ */ new Map();
    this.itineraries = /* @__PURE__ */ new Map();
    this.checklists = /* @__PURE__ */ new Map();
    this.chatMessages = /* @__PURE__ */ new Map();
    this.exchangeRates = /* @__PURE__ */ new Map();
    this.userCurrentId = 1;
    this.destinationCurrentId = 1;
    this.itineraryCurrentId = 1;
    this.checklistCurrentId = 1;
    this.chatMessageCurrentId = 1;
    this.exchangeRateCurrentId = 1;
    this.initializeDestinations();
    this.initializeExchangeRates();
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id, createdAt: /* @__PURE__ */ new Date() };
    this.users.set(id, user);
    return user;
  }
  // Destination operations
  async getDestination(id) {
    return this.destinations.get(id);
  }
  async getDestinations() {
    return Array.from(this.destinations.values());
  }
  async searchDestinations(searchTerm = "", continent = "", type = "") {
    return Array.from(this.destinations.values()).filter((destination) => {
      const matchesSearch = searchTerm === "" || destination.name.toLowerCase().includes(searchTerm.toLowerCase()) || destination.country.toLowerCase().includes(searchTerm.toLowerCase()) || destination.activities && destination.activities.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesContinent = continent === "" || destination.continent === continent;
      const matchesType = type === "" || destination.type === type;
      return matchesSearch && matchesContinent && matchesType;
    });
  }
  async createDestination(insertDestination) {
    const id = this.destinationCurrentId++;
    const destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }
  // Itinerary operations
  async getItinerary(id) {
    return this.itineraries.get(id);
  }
  async getItinerariesByUserId(userId) {
    return Array.from(this.itineraries.values()).filter(
      (itinerary) => itinerary.userId === userId
    );
  }
  async createItinerary(insertItinerary) {
    const id = this.itineraryCurrentId++;
    const itinerary = {
      ...insertItinerary,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.itineraries.set(id, itinerary);
    return itinerary;
  }
  // Checklist operations
  async getChecklist(id) {
    return this.checklists.get(id);
  }
  async getChecklistsByUserId(userId) {
    return Array.from(this.checklists.values()).filter(
      (checklist) => checklist.userId === userId
    );
  }
  async createChecklist(insertChecklist) {
    const id = this.checklistCurrentId++;
    const checklist = {
      ...insertChecklist,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.checklists.set(id, checklist);
    return checklist;
  }
  // Chat message operations
  async getChatMessagesByUserId(userId) {
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.userId === userId
    );
  }
  async createChatMessage(insertChatMessage) {
    const id = this.chatMessageCurrentId++;
    const chatMessage = {
      ...insertChatMessage,
      id,
      timestamp: /* @__PURE__ */ new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
  // Exchange rate operations
  async getExchangeRates() {
    return Array.from(this.exchangeRates.values());
  }
  async getExchangeRate(currencyCode) {
    return this.exchangeRates.get(currencyCode);
  }
  async updateExchangeRate(currencyCode, rate) {
    const existingRate = this.exchangeRates.get(currencyCode);
    if (existingRate) {
      const updatedRate = {
        ...existingRate,
        rate,
        lastUpdated: /* @__PURE__ */ new Date()
      };
      this.exchangeRates.set(currencyCode, updatedRate);
      return updatedRate;
    } else {
      const id = this.exchangeRateCurrentId++;
      const newRate = {
        id,
        currencyCode,
        rate,
        lastUpdated: /* @__PURE__ */ new Date()
      };
      this.exchangeRates.set(currencyCode, newRate);
      return newRate;
    }
  }
  // Initialize sample data
  initializeDestinations() {
    const destinations2 = [
      {
        name: "Rio de Janeiro",
        country: "Brasil",
        continent: "am\xE9rica do sul",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Popular",
        tagType: "popular",
        activities: "Praias, Cultura, Divers\xE3o",
        type: "cidade",
        description: "Rio de Janeiro \xE9 uma cidade vibrante conhecida por suas belas praias, o Cristo Redentor e o Carnaval."
      },
      {
        name: "Paris",
        country: "Fran\xE7a",
        continent: "europa",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Rom\xE2ntico",
        tagType: "romantic",
        activities: "Arte, Gastronomia, Arquitetura",
        type: "cidade",
        description: "Paris, a Cidade Luz, encanta com a Torre Eiffel, museus de classe mundial e gastronomia requintada."
      },
      {
        name: "T\xF3quio",
        country: "Jap\xE3o",
        continent: "\xE1sia",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Tend\xEAncia",
        tagType: "trend",
        activities: "Tecnologia, Culin\xE1ria, Tradi\xE7\xE3o",
        type: "cidade",
        description: "T\xF3quio \xE9 uma metr\xF3pole ultramoderna que combina arranha-c\xE9us futuristas com templos tradicionais."
      },
      {
        name: "Santorini",
        country: "Gr\xE9cia",
        continent: "europa",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Rom\xE2ntico",
        tagType: "romantic",
        activities: "Praias, Vistas, Gastronomia",
        type: "ilha",
        description: "Santorini encanta com suas casas brancas, c\xFApulas azuis e vistas espetaculares do Mar Egeu."
      },
      {
        name: "Bali",
        country: "Indon\xE9sia",
        continent: "\xE1sia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Popular",
        tagType: "popular",
        activities: "Praias, Templos, Natureza",
        type: "ilha",
        description: "Bali oferece praias paradis\xEDacas, templos milenares e uma cultura rica em tradi\xE7\xF5es."
      },
      {
        name: "Machu Picchu",
        country: "Peru",
        continent: "am\xE9rica do sul",
        image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Aventura",
        tagType: "trend",
        activities: "Montanhas, Hist\xF3ria, Aventura",
        type: "natureza",
        description: "Machu Picchu, a cidade perdida dos Incas, \xE9 um dos mais impressionantes s\xEDtios arqueol\xF3gicos do mundo."
      }
    ];
    destinations2.forEach((destination) => {
      this.createDestination(destination);
    });
  }
  initializeExchangeRates() {
    const rates = [
      ["USD", "1"],
      ["BRL", "5.19"],
      ["EUR", "0.92"],
      ["GBP", "0.8"],
      ["JPY", "150.23"],
      ["CAD", "1.36"],
      ["AUD", "1.52"],
      ["CHF", "0.89"],
      ["CNY", "7.22"]
    ];
    rates.forEach(([code, rate]) => {
      this.updateExchangeRate(code, rate);
    });
  }
};
var storage = new MemStorage();

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true
});
var destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  continent: text("continent").notNull(),
  image: text("image").notNull(),
  tag: text("tag"),
  tagType: text("tag_type"),
  activities: text("activities"),
  type: text("type").notNull(),
  description: text("description")
});
var insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true
});
var itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  mainDestination: text("main_destination").notNull(),
  otherDestinations: text("other_destinations"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  interests: text("interests"),
  preferences: text("preferences"),
  itineraryData: jsonb("itinerary_data"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertItinerarySchema = createInsertSchema(itineraries).omit({
  id: true,
  createdAt: true
});
var checklists = pgTable("checklists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  destination: text("destination").notNull(),
  climate: text("climate").notNull(),
  duration: integer("duration").notNull(),
  tripType: text("trip_type").notNull(),
  confirmedItems: text("confirmed_items"),
  checklistData: jsonb("checklist_data"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertChecklistSchema = createInsertSchema(checklists).omit({
  id: true,
  createdAt: true
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true
});
var exchangeRates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  currencyCode: text("currency_code").notNull().unique(),
  rate: text("rate").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow()
});
var insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true
});
var destinationSearchSchema = z.object({
  searchTerm: z.string().optional(),
  continent: z.string().optional(),
  type: z.string().optional()
});
var currencyConvertSchema = z.object({
  from: z.string().min(3).max(3),
  to: z.string().min(3).max(3),
  amount: z.number().positive()
});
var chatMessageSchema = z.object({
  message: z.string().min(1)
});
var itineraryParamsSchema = z.object({
  mainDestination: z.string().min(1),
  otherDestinations: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string(),
  interests: z.array(z.string()),
  preferences: z.string()
});
var checklistParamsSchema = z.object({
  destination: z.string().min(1),
  climate: z.string().min(1),
  duration: z.number().positive(),
  tripType: z.string().min(1),
  confirmedItems: z.array(z.string())
});

// server/services/openai.ts
import OpenAI from "openai";
import "dotenv/config";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
var MODEL = "gpt-3.5-turbo";
var ROTEIRO_ASSISTANT_ID = "asst_orz98VXa4zht5BF5fvHd7TxL";
var CHECKLIST_ASSISTANT_ID = "asst_lGYYrCgs2YomNqb1mgFmvFz5";
async function sendMessage(message) {
  try {
    const systemMessage = "Voc\xEA \xE9 um especialista s\xE1bio em viagens internacionais. Suas respostas s\xE3o informativas, objetivas e cheias de conhecimento pr\xE1tico. Fale como um guia experiente, mantendo suas respostas em portugu\xEAs.";
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    return response.choices[0].message.content || "Desculpe, n\xE3o consegui processar sua pergunta. Por favor, tente novamente.";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Falha ao comunicar com o assistente de viagem.");
  }
}
async function generateItinerary(params) {
  try {
    const {
      mainDestination,
      otherDestinations,
      startDate,
      endDate,
      interests,
      preferences
    } = params;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24)) + 1;
    const mensagem_usuario = `
    Crie um roteiro detalhado de ${duration} dias em ${mainDestination}${otherDestinations.length > 0 ? ", incluindo visitas a " + otherDestinations.join(", ") : ""}.
    Data de in\xEDcio: ${new Date(startDate).toLocaleDateString("pt-BR")}
    Data de fim: ${new Date(endDate).toLocaleDateString("pt-BR")}
    Interesses: ${interests.join(", ")}
    Prefer\xEAncias: ${preferences}
    
    Formato obrigat\xF3rio:
    - Organize por dias (Dia 1, Dia 2, etc.) com data espec\xEDfica
    - Para cada dia, liste atividades com hor\xE1rios espec\xEDficos
    - Inclua sugest\xF5es de caf\xE9 da manh\xE3, almo\xE7o e jantar
    - Mencione pontos tur\xEDsticos espec\xEDficos de ${mainDestination}
    - Adicione dicas \xFAteis quando relevante
    
    Formate sua resposta como um JSON com a seguinte estrutura:
    [
      {
        "date": "Dia 1 - DD/MM/AAAA",
        "title": "T\xEDtulo descritivo para o dia",
        "activities": [
          { "id": "1-1", "time": "09:00 - 12:00", "description": "Descri\xE7\xE3o da atividade" },
          ...
        ],
        "tip": "Dica \xFAtil para o dia (opcional)"
      },
      ...
    ]
    `;
    console.log("Criando thread para gera\xE7\xE3o de roteiro...");
    const thread = await openai.beta.threads.create();
    console.log("Enviando mensagem para o assistente...");
    await openai.beta.threads.messages.create(
      thread.id,
      { role: "user", content: mensagem_usuario }
    );
    console.log("Executando o assistente...");
    const run = await openai.beta.threads.runs.create(
      thread.id,
      { assistant_id: ROTEIRO_ASSISTANT_ID }
    );
    console.log("Aguardando resposta do assistente...");
    let runStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      console.log(`Status atual: ${runStatus.status}`);
    } while (runStatus.status !== "completed" && runStatus.status !== "failed");
    if (runStatus.status === "failed") {
      throw new Error(`O assistente falhou: ${runStatus.last_error?.message || "Erro desconhecido"}`);
    }
    console.log("Obtendo resposta do assistente...");
    const messages = await openai.beta.threads.messages.list(
      thread.id
    );
    let roteiro_texto = "";
    for (const msg of messages.data) {
      if (msg.role === "assistant") {
        if (msg.content && msg.content.length > 0 && msg.content[0].type === "text") {
          roteiro_texto = msg.content[0].text.value;
          break;
        }
      }
    }
    if (!roteiro_texto) {
      throw new Error("O assistente n\xE3o retornou um roteiro.");
    }
    let jsonMatch = roteiro_texto.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      const startIndex = roteiro_texto.indexOf("[");
      const endIndex = roteiro_texto.lastIndexOf("]");
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        jsonMatch = [roteiro_texto.substring(startIndex, endIndex + 1)];
      } else {
        throw new Error("N\xE3o foi poss\xEDvel encontrar um JSON v\xE1lido na resposta.");
      }
    }
    try {
      const itineraryData = JSON.parse(jsonMatch[0]);
      return itineraryData;
    } catch (parseError) {
      console.error("Erro ao analisar JSON:", parseError);
      throw new Error("Formato de resposta inv\xE1lido do assistente.");
    }
  } catch (error) {
    console.error("Erro ao gerar roteiro:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    throw new Error(`Falha ao gerar o roteiro de viagem: ${errorMessage}`);
  }
}
async function generateChecklist(params) {
  try {
    const {
      destination,
      climate,
      duration,
      tripType,
      confirmedItems
    } = params;
    const mensagem_usuario = `
    Gere um checklist inteligente de viagem com base nos seguintes par\xE2metros:
    
    - Destino: ${destination}
    - Clima esperado: ${climate}
    - Dura\xE7\xE3o da viagem: ${duration} dias
    - Tipo de viagem: ${tripType}
    - Itens j\xE1 confirmados pelo usu\xE1rio: ${confirmedItems.join(", ")}
    
    O checklist deve ser dividido por categorias:
    - Documentos (ex: passaporte, RG, seguro viagem)
    - Roupas adequadas ao clima (ex: casaco, bermuda, biqu\xEDni)
    - Higiene pessoal (ex: escova de dente, shampoo)
    - Eletr\xF4nicos (ex: carregador, adaptador de tomada, power bank)
    - Sa\xFAde (ex: rem\xE9dios, protetor solar, repelente)
    - Espec\xEDficos por tipo de viagem (ex: roupa social, t\xEAnis de trilha, guia tur\xEDstico)
    - Transporte (ex: reserva de carro, passagens)
    - Hotel (ex: confirma\xE7\xE3o de reserva)
    - Outros essenciais (cart\xF5es, dinheiro, snacks, etc.)
    
    Cada categoria deve ter pelo menos 4-5 itens relevantes.
    
    Formate sua resposta como um JSON com a seguinte estrutura:
    [
      { "id": "1", "text": "Passaporte", "category": "Documentos", "checked": false },
      { "id": "2", "text": "Seguro viagem", "category": "Documentos", "checked": false },
      ...
    ]
    
    Obs: Os itens que j\xE1 est\xE3o na lista de "Itens j\xE1 confirmados pelo usu\xE1rio" devem ser marcados como "checked": true.
    `;
    console.log("Criando thread para gera\xE7\xE3o de checklist...");
    const thread = await openai.beta.threads.create();
    console.log("Enviando mensagem para o assistente de checklist...");
    await openai.beta.threads.messages.create(
      thread.id,
      { role: "user", content: mensagem_usuario }
    );
    console.log("Executando o assistente de checklist...");
    const run = await openai.beta.threads.runs.create(
      thread.id,
      { assistant_id: CHECKLIST_ASSISTANT_ID }
    );
    console.log("Aguardando resposta do assistente de checklist...");
    let runStatus;
    do {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      console.log(`Status atual do checklist: ${runStatus.status}`);
    } while (runStatus.status !== "completed" && runStatus.status !== "failed");
    if (runStatus.status === "failed") {
      throw new Error(`O assistente de checklist falhou: ${runStatus.last_error?.message || "Erro desconhecido"}`);
    }
    console.log("Obtendo resposta do assistente de checklist...");
    const messages = await openai.beta.threads.messages.list(
      thread.id
    );
    let checklist_texto = "";
    for (const msg of messages.data) {
      if (msg.role === "assistant") {
        if (msg.content && msg.content.length > 0 && msg.content[0].type === "text") {
          checklist_texto = msg.content[0].text.value;
          break;
        }
      }
    }
    if (!checklist_texto) {
      throw new Error("O assistente n\xE3o retornou um checklist.");
    }
    let jsonMatch = checklist_texto.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      const startIndex = checklist_texto.indexOf("[");
      const endIndex = checklist_texto.lastIndexOf("]");
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        jsonMatch = [checklist_texto.substring(startIndex, endIndex + 1)];
      } else {
        throw new Error("N\xE3o foi poss\xEDvel encontrar um JSON v\xE1lido na resposta do assistente de checklist.");
      }
    }
    try {
      const checklistData = JSON.parse(jsonMatch[0]);
      return checklistData;
    } catch (parseError) {
      console.error("Erro ao analisar JSON do checklist:", parseError);
      throw new Error("Formato de resposta inv\xE1lido do assistente de checklist.");
    }
  } catch (error) {
    console.error("Erro ao gerar checklist:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    throw new Error(`Falha ao gerar o checklist de viagem: ${errorMessage}`);
  }
}

// server/services/currency.ts
var API_KEY = process.env.CURRENCY_API_KEY || "";
async function getExchangeRates() {
  try {
    const ratesList = await storage.getExchangeRates();
    const rates = {};
    ratesList.forEach((rate) => {
      rates[rate.currencyCode] = parseFloat(rate.rate);
    });
    return rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return {
      USD: 1,
      BRL: 5.19,
      EUR: 0.92,
      GBP: 0.8,
      JPY: 150.23,
      CAD: 1.36,
      AUD: 1.52,
      CHF: 0.89,
      CNY: 7.22
    };
  }
}
async function convertCurrency(from, to, amount) {
  try {
    const rates = await getExchangeRates();
    if (!rates[from] || !rates[to]) {
      throw new Error(`Taxa de c\xE2mbio n\xE3o encontrada para ${from} ou ${to}`);
    }
    const inUSD = amount / rates[from];
    const result = inUSD * rates[to];
    const rate = rates[to] / rates[from];
    return {
      amount: parseFloat(result.toFixed(2)),
      from,
      to,
      rate: parseFloat(rate.toFixed(4))
    };
  } catch (error) {
    console.error("Error converting currency:", error);
    throw new Error(`Falha ao converter de ${from} para ${to}.`);
  }
}
async function getDolarRate() {
  try {
    const rates = await getExchangeRates();
    return {
      rate: rates.BRL,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      change: 0.1
      // Mock change percentage
    };
  } catch (error) {
    console.error("Error fetching USD rate:", error);
    return {
      rate: 5.19,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      change: 0.1
    };
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  app2.post("/api/chat", async (req, res) => {
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
  app2.post("/api/itinerary", async (req, res) => {
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
  app2.post("/api/checklist", async (req, res) => {
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
  app2.get("/api/currency/rates", async (_req, res) => {
    try {
      const rates = await getExchangeRates();
      return res.status(200).json(rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return res.status(500).json({
        message: "Erro ao buscar as taxas de c\xE2mbio. Por favor, tente novamente."
      });
    }
  });
  app2.post("/api/currency/convert", async (req, res) => {
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
  app2.get("/api/currency/dolar", async (_req, res) => {
    try {
      const rate = await getDolarRate();
      return res.status(200).json(rate);
    } catch (error) {
      console.error("Error fetching USD rate:", error);
      return res.status(500).json({
        message: "Erro ao buscar a cota\xE7\xE3o do d\xF3lar. Por favor, tente novamente."
      });
    }
  });
  app2.get("/api/destinations", async (req, res) => {
    try {
      const searchTerm = req.query.search || "";
      const continent = req.query.continent || "";
      const type = req.query.type || "";
      const destinations2 = await storage.searchDestinations(searchTerm, continent, type);
      return res.status(200).json(destinations2);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      return res.status(500).json({
        message: "Erro ao buscar destinos. Por favor, tente novamente."
      });
    }
  });
  app2.get("/api/user/itineraries", async (req, res) => {
    try {
      const userId = 1;
      const itineraries2 = await storage.getItinerariesByUserId(userId);
      return res.status(200).json(itineraries2);
    } catch (error) {
      console.error("Error fetching user itineraries:", error);
      return res.status(500).json({
        message: "Erro ao buscar roteiros do usu\xE1rio. Por favor, tente novamente."
      });
    }
  });
  app2.get("/api/user/checklists", async (req, res) => {
    try {
      const userId = 1;
      const checklists2 = await storage.getChecklistsByUserId(userId);
      return res.status(200).json(checklists2);
    } catch (error) {
      console.error("Error fetching user checklists:", error);
      return res.status(500).json({
        message: "Erro ao buscar listas do usu\xE1rio. Por favor, tente novamente."
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
import dotenv from "dotenv";
import http from "http";
import path3 from "path";
dotenv.config();
var app = express2();
var PORT = process.env.PORT || 5e3;
var HOST = process.env.HOST || "0.0.0.0";
var ENV = process.env.NODE_ENV || "development";
var IS_DEV = ENV === "development";
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  res.on("finish", () => {
    const duration = Date.now() - start;
    const contentLength = res.get("Content-Length") || 0;
    log(`${method} ${originalUrl} [${res.statusCode}] ${contentLength}bytes - ${duration}ms - ${ip}`);
  });
  next();
});
(async () => {
  try {
    await registerRoutes(app);
    if (IS_DEV) {
      const server = http.createServer(app);
      await setupVite(app, server);
      startServer(server);
    } else {
      app.use(express2.static(path3.join(__dirname, "public"), {
        maxAge: "1y",
        immutable: true
      }));
      app.get("*", (req, res) => {
        res.sendFile(path3.join(__dirname, "public", "index.html"));
      });
      startServer(app);
    }
  } catch (error) {
    log(`\u274C Falha cr\xEDtica ao iniciar o servidor: ${error instanceof Error ? error.stack : error}`);
    process.exit(1);
  }
})();
function startServer(server) {
  const httpServer = server instanceof http.Server ? server : http.createServer(server);
  httpServer.listen(PORT, HOST, () => {
    log(`\u{1F680} Servidor rodando em http://${HOST}:${PORT}`);
    log(`\u26A1 Ambiente: ${ENV}`);
    log(`\u26A1 PID: ${process.pid}`);
  });
  const shutdown = async () => {
    log("\n\u{1F6D1} Desligando servidor graciosamente...");
    try {
      httpServer.close(() => {
        log("\u2705 Servidor encerrado com sucesso");
        process.exit(0);
      });
      setTimeout(() => {
        log("\u26A0\uFE0F Encerramento for\xE7ado ap\xF3s timeout");
        process.exit(1);
      }, 5e3);
    } catch (err) {
      log(`\u274C Erro durante shutdown: ${err instanceof Error ? err.stack : err}`);
      process.exit(1);
    }
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("unhandledRejection", (reason) => {
    log(`\u26A0\uFE0F Rejei\xE7\xE3o n\xE3o tratada: ${reason instanceof Error ? reason.stack : reason}`);
  });
}
