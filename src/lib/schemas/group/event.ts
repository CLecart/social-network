import { z } from "zod";

export const GroupEventOwnerSchema = z.object({
  id: z.string(),
  username: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
}).describe('GroupEventOwnerSchema');

export const GroupEventGroupSchema = z.object({
  id: z.string(),
  title: z.string().nullable().optional(),
}).describe('GroupEventGroupSchema');

export const GroupEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  datetime: z.string(),
  owner: GroupEventOwnerSchema,
  group: GroupEventGroupSchema,
  rsvpCounts: z.object({
    yes: z.number(),
    no: z.number(),
    maybe: z.number(),
  }),
  userRsvp: z.union([z.literal('YES'), z.literal('NO'), z.literal('MAYBE')]).nullable(),
  createdAt: z.string(),
}).describe('GroupEventSchema');

export const GroupEventsResponseSchema = z.object({
  events: z.array(GroupEventSchema),
}).describe('GroupEventsResponseSchema');

export type GroupEvent = z.infer<typeof GroupEventSchema>;
export type GroupEventsResponse = z.infer<typeof GroupEventsResponseSchema>;

