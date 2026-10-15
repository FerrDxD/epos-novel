import { z } from "zod";

export const categoryEnum = z.enum([
  "characters",
  "locations",
  "factions",
  "events",
  "concepts",
  "monsters",
]);

export const uuidSchema = z.string().uuid("ID harus UUID valid");

export const codexCreateSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi").max(100, "Judul maksimal 100 karakter"),
  description: z.string().max(2000).optional().nullable(),
  genre: z.string().max(50).optional().nullable(),
  coverColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "coverColor harus hex #RRGGBB")
    .optional(),
});

export const codexPatchSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).optional().nullable(),
  genre: z.string().max(50).optional().nullable(),
  coverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const entryCreateSchema = z.object({
  codexId: uuidSchema,
  category: categoryEnum,
  title: z.string().min(1, "Judul entri wajib diisi").max(150),
  summary: z.string().max(500).optional().nullable().default(""),
  content: z.string().max(100000, "Konten terlalu panjang").optional().nullable().default(""),
  tags: z.array(z.string().max(30)).max(20, "Maksimal 20 tags").optional().default([]),
  metadata: z.record(z.any()).optional().default({}),
  imageUrl: z.string().url().optional().nullable(),
});

export const entryPatchSchema = z
  .object({
    title: z.string().min(1).max(150).optional(),
    summary: z.string().max(500).optional().nullable(),
    content: z.string().max(100000).optional().nullable(),
    tags: z.array(z.string().max(30)).max(20).optional(),
    metadata: z.record(z.any()).optional(),
    imageUrl: z.string().url().optional().nullable(),
    category: categoryEnum.optional(),
  })
  .strict();

export const relationCreateSchema = z.object({
  codexId: uuidSchema,
  sourceEntryId: uuidSchema,
  targetEntryId: uuidSchema,
  relationLabel: z.string().min(1).max(50),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(50),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, underscore"),
  email: z
    .string()
    .email("Email tidak valid")
    .transform((v: string) => v.toLowerCase().trim()),
  password: z.string().min(6, "Password minimal 6 karakter").max(100),
});

export const shareInviteSchema = z.object({
  email: z
    .string()
    .email("Email tidak valid")
    .transform((v: string) => v.toLowerCase().trim()),
  role: z.enum(["editor", "viewer"]).default("viewer"),
});

export const shareRoleSchema = z.object({
  userId: uuidSchema,
  role: z.enum(["editor", "viewer"]),
});

export const entryVersionRestoreSchema = z.object({
  versionId: uuidSchema,
});

export function formatZodError(error: any): string {
  const first = error?.issues?.[0];
  return first ? `${first.path.join(".")}: ${first.message}` : "Input tidak valid";
}
