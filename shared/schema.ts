import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  mode: varchar("mode").notNull(), // planner, architect, coder, auto, debug
  status: varchar("status").default("active"), // active, completed, paused
  config: json("config").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  path: text("path").notNull(),
  content: text("content"),
  language: varchar("language"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").references(() => projects.id),
  mode: varchar("mode").notNull(),
  role: varchar("role").notNull(), // user, assistant
  content: text("content").notNull(),
  metadata: json("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const openrouterConfig = pgTable("openrouter_config", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apiKey: text("api_key"),
  selectedModel: text("selected_model").default("anthropic/claude-3.5-sonnet"),
  modelConfigs: json("model_configs").default({}),
  isConnected: boolean("is_connected").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertOpenRouterConfigSchema = createInsertSchema(openrouterConfig).omit({
  id: true,
  updatedAt: true,
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type OpenRouterConfig = typeof openrouterConfig.$inferSelect;
export type InsertOpenRouterConfig = z.infer<typeof insertOpenRouterConfigSchema>;
