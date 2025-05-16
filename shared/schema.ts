import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Destinations Schema
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  continent: text("continent").notNull(),
  image: text("image").notNull(),
  tag: text("tag"),
  tagType: text("tag_type"),
  activities: text("activities"),
  type: text("type").notNull(),
  description: text("description"),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

// Itineraries Schema
export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  mainDestination: text("main_destination").notNull(),
  otherDestinations: text("other_destinations"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  interests: text("interests"),
  preferences: text("preferences"),
  itineraryData: jsonb("itinerary_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).omit({
  id: true,
  createdAt: true,
});

// Checklists Schema
export const checklists = pgTable("checklists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  destination: text("destination").notNull(),
  climate: text("climate").notNull(),
  duration: integer("duration").notNull(),
  tripType: text("trip_type").notNull(),
  confirmedItems: text("confirmed_items"),
  checklistData: jsonb("checklist_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChecklistSchema = createInsertSchema(checklists).omit({
  id: true,
  createdAt: true,
});

// Chat Messages Schema
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull(),
  isUser: boolean("is_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
});

// Exchange Rates Schema
export const exchangeRates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  currencyCode: text("currency_code").notNull().unique(),
  rate: text("rate").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type Itinerary = typeof itineraries.$inferSelect;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;

export type Checklist = typeof checklists.$inferSelect;
export type InsertChecklist = z.infer<typeof insertChecklistSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;

// Validation Schemas
export const destinationSearchSchema = z.object({
  searchTerm: z.string().optional(),
  continent: z.string().optional(),
  type: z.string().optional(),
});

export const currencyConvertSchema = z.object({
  from: z.string().min(3).max(3),
  to: z.string().min(3).max(3),
  amount: z.number().positive(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1),
});

export const itineraryParamsSchema = z.object({
  mainDestination: z.string().min(1),
  otherDestinations: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string(),
  interests: z.array(z.string()),
  preferences: z.string(),
});

export const checklistParamsSchema = z.object({
  destination: z.string().min(1),
  climate: z.string().min(1),
  duration: z.number().positive(),
  tripType: z.string().min(1),
  confirmedItems: z.array(z.string()),
});
