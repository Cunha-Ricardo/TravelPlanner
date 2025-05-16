import { 
  User, InsertUser, 
  Destination, InsertDestination,
  Itinerary, InsertItinerary,
  Checklist, InsertChecklist,
  ChatMessage, InsertChatMessage,
  ExchangeRate, InsertExchangeRate
} from "@shared/schema";

// Interface defining all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Destination operations
  getDestination(id: number): Promise<Destination | undefined>;
  getDestinations(): Promise<Destination[]>;
  searchDestinations(searchTerm?: string, continent?: string, type?: string): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Itinerary operations
  getItinerary(id: number): Promise<Itinerary | undefined>;
  getItinerariesByUserId(userId: number): Promise<Itinerary[]>;
  createItinerary(itinerary: InsertItinerary): Promise<Itinerary>;
  
  // Checklist operations
  getChecklist(id: number): Promise<Checklist | undefined>;
  getChecklistsByUserId(userId: number): Promise<Checklist[]>;
  createChecklist(checklist: InsertChecklist): Promise<Checklist>;
  
  // Chat message operations
  getChatMessagesByUserId(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Exchange rate operations
  getExchangeRates(): Promise<ExchangeRate[]>;
  getExchangeRate(currencyCode: string): Promise<ExchangeRate | undefined>;
  updateExchangeRate(currencyCode: string, rate: string): Promise<ExchangeRate>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private itineraries: Map<number, Itinerary>;
  private checklists: Map<number, Checklist>;
  private chatMessages: Map<number, ChatMessage>;
  private exchangeRates: Map<string, ExchangeRate>;
  
  private userCurrentId: number;
  private destinationCurrentId: number;
  private itineraryCurrentId: number;
  private checklistCurrentId: number;
  private chatMessageCurrentId: number;
  private exchangeRateCurrentId: number;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.itineraries = new Map();
    this.checklists = new Map();
    this.chatMessages = new Map();
    this.exchangeRates = new Map();
    
    this.userCurrentId = 1;
    this.destinationCurrentId = 1;
    this.itineraryCurrentId = 1;
    this.checklistCurrentId = 1;
    this.chatMessageCurrentId = 1;
    this.exchangeRateCurrentId = 1;
    
    // Initialize with some destinations
    this.initializeDestinations();
    // Initialize with some exchange rates
    this.initializeExchangeRates();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Destination operations
  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }
  
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }
  
  async searchDestinations(searchTerm: string = "", continent: string = "", type: string = ""): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(destination => {
      const matchesSearch = searchTerm === "" || 
        destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (destination.activities && destination.activities.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesContinent = continent === "" || destination.continent === continent;
      const matchesType = type === "" || destination.type === type;
      
      return matchesSearch && matchesContinent && matchesType;
    });
  }
  
  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = this.destinationCurrentId++;
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }
  
  // Itinerary operations
  async getItinerary(id: number): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }
  
  async getItinerariesByUserId(userId: number): Promise<Itinerary[]> {
    return Array.from(this.itineraries.values()).filter(
      itinerary => itinerary.userId === userId
    );
  }
  
  async createItinerary(insertItinerary: InsertItinerary): Promise<Itinerary> {
    const id = this.itineraryCurrentId++;
    const itinerary: Itinerary = { 
      ...insertItinerary, 
      id, 
      createdAt: new Date() 
    };
    this.itineraries.set(id, itinerary);
    return itinerary;
  }
  
  // Checklist operations
  async getChecklist(id: number): Promise<Checklist | undefined> {
    return this.checklists.get(id);
  }
  
  async getChecklistsByUserId(userId: number): Promise<Checklist[]> {
    return Array.from(this.checklists.values()).filter(
      checklist => checklist.userId === userId
    );
  }
  
  async createChecklist(insertChecklist: InsertChecklist): Promise<Checklist> {
    const id = this.checklistCurrentId++;
    const checklist: Checklist = { 
      ...insertChecklist, 
      id, 
      createdAt: new Date() 
    };
    this.checklists.set(id, checklist);
    return checklist;
  }
  
  // Chat message operations
  async getChatMessagesByUserId(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(
      message => message.userId === userId
    );
  }
  
  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageCurrentId++;
    const chatMessage: ChatMessage = { 
      ...insertChatMessage, 
      id,
      timestamp: new Date()
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }
  
  // Exchange rate operations
  async getExchangeRates(): Promise<ExchangeRate[]> {
    return Array.from(this.exchangeRates.values());
  }
  
  async getExchangeRate(currencyCode: string): Promise<ExchangeRate | undefined> {
    return this.exchangeRates.get(currencyCode);
  }
  
  async updateExchangeRate(currencyCode: string, rate: string): Promise<ExchangeRate> {
    const existingRate = this.exchangeRates.get(currencyCode);
    
    if (existingRate) {
      const updatedRate: ExchangeRate = {
        ...existingRate,
        rate,
        lastUpdated: new Date()
      };
      this.exchangeRates.set(currencyCode, updatedRate);
      return updatedRate;
    } else {
      const id = this.exchangeRateCurrentId++;
      const newRate: ExchangeRate = {
        id,
        currencyCode,
        rate,
        lastUpdated: new Date()
      };
      this.exchangeRates.set(currencyCode, newRate);
      return newRate;
    }
  }
  
  // Initialize sample data
  private initializeDestinations() {
    const destinations: InsertDestination[] = [
      {
        name: "Rio de Janeiro",
        country: "Brasil",
        continent: "américa do sul",
        image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Popular",
        tagType: "popular",
        activities: "Praias, Cultura, Diversão",
        type: "cidade",
        description: "Rio de Janeiro é uma cidade vibrante conhecida por suas belas praias, o Cristo Redentor e o Carnaval."
      },
      {
        name: "Paris",
        country: "França",
        continent: "europa",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Romântico",
        tagType: "romantic",
        activities: "Arte, Gastronomia, Arquitetura",
        type: "cidade",
        description: "Paris, a Cidade Luz, encanta com a Torre Eiffel, museus de classe mundial e gastronomia requintada."
      },
      {
        name: "Tóquio",
        country: "Japão",
        continent: "ásia",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Tendência",
        tagType: "trend",
        activities: "Tecnologia, Culinária, Tradição",
        type: "cidade",
        description: "Tóquio é uma metrópole ultramoderna que combina arranha-céus futuristas com templos tradicionais."
      },
      {
        name: "Santorini",
        country: "Grécia",
        continent: "europa",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Romântico",
        tagType: "romantic",
        activities: "Praias, Vistas, Gastronomia",
        type: "ilha",
        description: "Santorini encanta com suas casas brancas, cúpulas azuis e vistas espetaculares do Mar Egeu."
      },
      {
        name: "Bali",
        country: "Indonésia",
        continent: "ásia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Popular",
        tagType: "popular",
        activities: "Praias, Templos, Natureza",
        type: "ilha",
        description: "Bali oferece praias paradisíacas, templos milenares e uma cultura rica em tradições."
      },
      {
        name: "Machu Picchu",
        country: "Peru",
        continent: "américa do sul",
        image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
        tag: "Aventura",
        tagType: "trend",
        activities: "Montanhas, História, Aventura",
        type: "natureza",
        description: "Machu Picchu, a cidade perdida dos Incas, é um dos mais impressionantes sítios arqueológicos do mundo."
      }
    ];
    
    destinations.forEach(destination => {
      this.createDestination(destination);
    });
  }
  
  private initializeExchangeRates() {
    const rates: [string, string][] = [
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
}

export const storage = new MemStorage();
