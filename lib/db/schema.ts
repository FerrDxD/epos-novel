import { pgTable, uuid, text, timestamp, integer, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum — M0: cegah category ngawur
export const categoryEnum = pgEnum("category", [
  "characters",
  "locations",
  "factions",
  "events",
  "concepts",
  "monsters",
]);

export const importStatusEnum = pgEnum("import_status", ["pending", "processing", "done", "failed"]);
export const sourceTypeEnum = pgEnum("source_type", ["docx", "pdf", "md", "json", "gdocs", "gdrive"]);

// 1. Table: users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").unique(),
  email: text("email").unique().notNull(),
  password: text("password"),
  name: text("name"),
  image: text("image"),
  provider: text("provider").notNull().default("credentials"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Table: codexes
export const codexes = pgTable("codexes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  genre: text("genre"),
  coverColor: text("cover_color").notNull().default("#7B2FBE"),
  entryCount: integer("entry_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Table: entries
export const entries = pgTable(
  "entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    codexId: uuid("codex_id")
      .notNull()
      .references(() => codexes.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    category: categoryEnum("category").notNull(),
    title: text("title").notNull(),
    summary: text("summary"),
    content: text("content"),
    tags: text("tags").array().notNull(),
    imageUrl: text("image_url"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    codexIdx: index("entries_codex_idx").on(t.codexId),
    userIdx: index("entries_user_idx").on(t.userId),
    categoryIdx: index("entries_category_idx").on(t.category),
    codexCategoryIdx: index("entries_codex_category_idx").on(t.codexId, t.category),
  })
);

// 4. Table: entry relations
export const entryRelations = pgTable(
  "relations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    codexId: uuid("codex_id")
      .notNull()
      .references(() => codexes.id, { onDelete: "cascade" }),
    sourceEntryId: uuid("source_entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    targetEntryId: uuid("target_entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    relationLabel: text("relation_label").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    codexIdx: index("relations_codex_idx").on(t.codexId),
    sourceIdx: index("relations_source_idx").on(t.sourceEntryId),
    targetIdx: index("relations_target_idx").on(t.targetEntryId),
  })
);

// 5. Table: importLogs
export const importLogs = pgTable(
  "import_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    codexId: uuid("codex_id")
      .notNull()
      .references(() => codexes.id, { onDelete: "cascade" }),
    sourceType: text("source_type").notNull(),
    sourceName: text("source_name").notNull(),
    entriesExtracted: integer("entries_extracted").notNull().default(0),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("import_logs_user_idx").on(t.userId),
    codexIdx: index("import_logs_codex_idx").on(t.codexId),
  })
);

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  codexes: many(codexes),
  entries: many(entries),
  importLogs: many(importLogs),
}));

export const codexesRelations = relations(codexes, ({ one, many }) => ({
  user: one(users, {
    fields: [codexes.userId],
    references: [users.id],
  }),
  entries: many(entries),
  relations: many(entryRelations),
  importLogs: many(importLogs),
}));

export const entriesRelations = relations(entries, ({ one, many }) => ({
  codex: one(codexes, {
    fields: [entries.codexId],
    references: [codexes.id],
  }),
  user: one(users, {
    fields: [entries.userId],
    references: [users.id],
  }),
  outgoingRelations: many(entryRelations, { relationName: "sourceRelations" }),
  incomingRelations: many(entryRelations, { relationName: "targetRelations" }),
}));

export const entryRelationsRelations = relations(entryRelations, ({ one }) => ({
  codex: one(codexes, {
    fields: [entryRelations.codexId],
    references: [codexes.id],
  }),
  sourceEntry: one(entries, {
    fields: [entryRelations.sourceEntryId],
    references: [entries.id],
    relationName: "sourceRelations",
  }),
  targetEntry: one(entries, {
    fields: [entryRelations.targetEntryId],
    references: [entries.id],
    relationName: "targetRelations",
  }),
}));

export const importLogsRelations = relations(importLogs, ({ one }) => ({
  user: one(users, {
    fields: [importLogs.userId],
    references: [users.id],
  }),
  codex: one(codexes, {
    fields: [importLogs.codexId],
    references: [codexes.id],
  }),
}));
