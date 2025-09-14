/*
  Warnings:

  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestCase` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestPlan_Suites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestSuite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestSuite_Cases` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[channelName]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
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

-- AlterTable
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_pkey",
ADD COLUMN     "channelName" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Project_id_seq";

-- AlterTable
ALTER TABLE "public"."TestCase" DROP CONSTRAINT "TestCase_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestCase_id_seq";

-- AlterTable
ALTER TABLE "public"."TestPlan" DROP CONSTRAINT "TestPlan_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "projectId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestPlan_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestPlan_id_seq";

-- AlterTable
ALTER TABLE "public"."TestPlan_Suites" DROP CONSTRAINT "TestPlan_Suites_pkey",
ALTER COLUMN "testPlanId" SET DATA TYPE TEXT,
ALTER COLUMN "testSuiteId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestPlan_Suites_pkey" PRIMARY KEY ("testPlanId", "testSuiteId");

-- AlterTable
ALTER TABLE "public"."TestSuite" DROP CONSTRAINT "TestSuite_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestSuite_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestSuite_id_seq";

-- AlterTable
ALTER TABLE "public"."TestSuite_Cases" DROP CONSTRAINT "TestSuite_Cases_pkey",
ALTER COLUMN "testSuiteId" SET DATA TYPE TEXT,
ALTER COLUMN "testCaseId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestSuite_Cases_pkey" PRIMARY KEY ("testSuiteId", "testCaseId");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Project_channelName_key" ON "public"."Project"("channelName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."TestPlan" ADD CONSTRAINT "TestPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestPlan_Suites" ADD CONSTRAINT "TestPlan_Suites_testPlanId_fkey" FOREIGN KEY ("testPlanId") REFERENCES "public"."TestPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestPlan_Suites" ADD CONSTRAINT "TestPlan_Suites_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "public"."TestSuite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestSuite_Cases" ADD CONSTRAINT "TestSuite_Cases_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "public"."TestSuite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestSuite_Cases" ADD CONSTRAINT "TestSuite_Cases_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "public"."TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
