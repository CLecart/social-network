import { z } from "zod";

export const UserSearchSchema = z.object({
  id: z.string(),
  username: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
}).describe('UserSearchSchema');

export const UserSearchResponseSchema = z.object({
  users: z.array(UserSearchSchema),
}).describe('UserSearchResponseSchema');

export type UserSearch = z.infer<typeof UserSearchSchema>;
export type UserSearchResponse = z.infer<typeof UserSearchResponseSchema>;

