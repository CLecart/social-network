import { z } from "zod";
import { GroupMemberSchema } from "./summary";

export const GroupLastMessageSchema = z
  .object({
    message: z.string(),
    sender: z.string(),
    timestamp: z.string(),
  })
  .describe("GroupLastMessageSchema");

export const GroupListItemSchema = z
  .object({
    id: z.string(),
    title: z.string().nullable().optional(),
    memberCount: z.number(),
    members: z.array(GroupMemberSchema),
    lastMessage: GroupLastMessageSchema.nullable().optional(),
    createdAt: z.string(),
  })
  .describe("GroupListItemSchema");

export const GroupListResponseSchema = z
  .object({
    groups: z.array(GroupListItemSchema),
  })
  .describe("GroupListResponseSchema");

export type GroupListItem = z.infer<typeof GroupListItemSchema>;
export type GroupListResponse = z.infer<typeof GroupListResponseSchema>;

