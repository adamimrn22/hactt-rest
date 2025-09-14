/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ProjectRolePermission" DROP CONSTRAINT "ProjectRolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectRolePermission" DROP CONSTRAINT "ProjectRolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestPlan" DROP CONSTRAINT "TestPlan_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestPlan_Suites" DROP CONSTRAINT "TestPlan_Suites_testPlanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestPlan_Suites" DROP CONSTRAINT "TestPlan_Suites_testSuiteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestSuite_Cases" DROP CONSTRAINT "TestSuite_Cases_testCaseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestSuite_Cases" DROP CONSTRAINT "TestSuite_Cases_testSuiteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProjectEnrollment" DROP CONSTRAINT "UserProjectEnrollment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserProjectEnrollment" DROP CONSTRAINT "UserProjectEnrollment_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "bio" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "public"."UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProjectEnrollment" ADD CONSTRAINT "UserProjectEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProjectEnrollment" ADD CONSTRAINT "UserProjectEnrollment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectRolePermission" ADD CONSTRAINT "ProjectRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."ProjectRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectRolePermission" ADD CONSTRAINT "ProjectRolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestPlan" ADD CONSTRAINT "TestPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestPlan_Suites" ADD CONSTRAINT "TestPlan_Suites_testPlanId_fkey" FOREIGN KEY ("testPlanId") REFERENCES "public"."TestPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestPlan_Suites" ADD CONSTRAINT "TestPlan_Suites_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "public"."TestSuite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestSuite_Cases" ADD CONSTRAINT "TestSuite_Cases_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "public"."TestSuite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestSuite_Cases" ADD CONSTRAINT "TestSuite_Cases_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "public"."TestCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
