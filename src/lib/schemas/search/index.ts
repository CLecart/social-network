import { z } from "zod";

export const SearchAccountSchema = z.object({
  id: z.string(),
  type: z.literal("accounts"),
  username: z.string(),
  displayName: z.string(),
  image: z.string().nullable().optional(),
}).describe('SearchAccountSchema');

export const SearchPostSchema = z.object({
  id: z.string(),
  type: z.literal("posts"),
  content: z.string(),
  createdAt: z.string(),
  images: z.string().nullable().optional(),
  user: z.object({
    id: z.string(),
    username: z.string(),
    displayName: z.string(),
    image: z.string().nullable().optional(),
  }),
  stats: z.object({
    likes: z.number(),
    comments: z.number(),
  }),
}).describe('SearchPostSchema');

// Optional tag support if added later
export const SearchTagSchema = z.object({
  id: z.number(),
  type: z.literal("tags"),
  name: z.string(),
  postCount: z.number(),
}).describe('SearchTagSchema');

export const SearchItemSchema = z.union([
  SearchAccountSchema,
  SearchPostSchema,
  // SearchTagSchema // Uncomment when API returns tags
]).describe('SearchItemSchema');

export type SearchAccount = z.infer<typeof SearchAccountSchema>;
export type SearchPost = z.infer<typeof SearchPostSchema>;
export type SearchTag = z.infer<typeof SearchTagSchema>;
export type SearchItem = z.infer<typeof SearchItemSchema>;
