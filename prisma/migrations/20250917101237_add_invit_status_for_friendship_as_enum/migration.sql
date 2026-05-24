/*
  Warnings:

  - The values [DECLINED] on the enum `InvitationStatus` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `status` on the `Friendship` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvitationStatus_new" AS ENUM ('PENDING', 'ACCEPTED');
ALTER TABLE "GroupInvitation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "GroupJoinRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Friendship" ALTER COLUMN "status" TYPE "InvitationStatus_new" USING ("status"::text::"InvitationStatus_new");
ALTER TABLE "GroupInvitation" ALTER COLUMN "status" TYPE "InvitationStatus_new" USING ("status"::text::"InvitationStatus_new");
ALTER TABLE "GroupJoinRequest" ALTER COLUMN "status" TYPE "InvitationStatus_new" USING ("status"::text::"InvitationStatus_new");
ALTER TYPE "InvitationStatus" RENAME TO "InvitationStatus_old";
ALTER TYPE "InvitationStatus_new" RENAME TO "InvitationStatus";
DROP TYPE "InvitationStatus_old";
ALTER TABLE "GroupInvitation" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "GroupJoinRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "status",
ADD COLUMN     "status" "InvitationStatus" NOT NULL;
