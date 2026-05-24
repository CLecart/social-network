import { z } from "zod";
import { UserPublicSchema } from "@/lib/schemas/user/public";
import { InvitationStatus } from "@prisma/client";

export const InvitationStatusSchema = z.nativeEnum(InvitationStatus).describe('InvitationStatusSchema');

export const ProfileRelationshipSchema = z.object({
  followStatus: InvitationStatusSchema.nullable().optional(),
  friendshipStatus: InvitationStatusSchema.nullable(),
}).describe('ProfileRelationshipSchema');

export const ProfileStatsSchema = z.object({
  follower: z.number(),
  following: z.number(),
}).describe('ProfileStatsSchema');

export const ProfilePermissionsSchema = z.object({
  canViewPosts: z.boolean(),
}).describe('ProfilePermissionsSchema');

export const ProfileSummarySchema = z.object({
  user: UserPublicSchema,
  relationship: ProfileRelationshipSchema,
  stats: ProfileStatsSchema,
  permissions: ProfilePermissionsSchema,
  isOwnProfile: z.boolean(),
}).describe('ProfileSummarySchema');

export type ProfileSummary = z.infer<typeof ProfileSummarySchema>;
