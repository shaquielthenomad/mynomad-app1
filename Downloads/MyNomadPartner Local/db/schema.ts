import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const travelPlans = pgTable("travel_plans", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  destination: text("destination").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  location: text("location").notNull(),
  content: text("content").notNull(),
  categories: text("categories").array(),
  sentiment: text("sentiment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packingLists = pgTable("packing_lists", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  destination: text("destination").notNull(),
  duration: text("duration").notNull(),
  season: text("season").notNull(),
  items: text("items").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type Definitions
export type User = InferSelectModel<typeof users>;
export type TravelPlan = InferSelectModel<typeof travelPlans>;
export type JournalEntry = InferSelectModel<typeof journalEntries>;
export type PackingList = InferSelectModel<typeof packingLists>;

// Zod Schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertTravelPlanSchema = createInsertSchema(travelPlans);
export const selectTravelPlanSchema = createSelectSchema(travelPlans);

export const insertJournalEntrySchema = createInsertSchema(journalEntries);
export const selectJournalEntrySchema = createSelectSchema(journalEntries);

export const insertPackingListSchema = createInsertSchema(packingLists);
export const selectPackingListSchema = createSelectSchema(packingLists);