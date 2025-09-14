/*
  Warnings:

  - You are about to drop the column `bio` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `UserProjectEnrollment` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `UserProjectEnrollment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserProfile" DROP COLUMN "bio";

-- AlterTable
ALTER TABLE "public"."UserProjectEnrollment" DROP COLUMN "role",
ADD COLUMN     "roleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."UserProjectEnrollment" ADD CONSTRAINT "UserProjectEnrollment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."ProjectRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
