import { z } from "zod";

export const GroupMemberSchema = z.object({
  id: z.string(),
  username: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
}).describe('GroupMemberSchema');

export const GroupSummarySchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
  owner: GroupMemberSchema.optional(),
  memberCount: z.number(),
  members: z.array(GroupMemberSchema).optional(),
  createdAt: z.string(),
}).describe('GroupSummarySchema');

export type GroupMember = z.infer<typeof GroupMemberSchema>;
export type GroupSummary = z.infer<typeof GroupSummarySchema>;

