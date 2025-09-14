/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "public"."User_email_key";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "role";

-- DropTable
DROP TABLE "public"."Post";

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TestPlan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TestSuite" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestSuite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TestCase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT[],
    "expectedResult" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TestPlanTestSuite" (
    "testPlanId" INTEGER NOT NULL,
    "testSuiteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestPlanTestSuite_pkey" PRIMARY KEY ("testPlanId","testSuiteId")
);

-- CreateTable
CREATE TABLE "public"."TestSuiteTestCase" (
    "testSuiteId" INTEGER NOT NULL,
    "testCaseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestSuiteTestCase_pkey" PRIMARY KEY ("testSuiteId","testCaseId")
);

-- AddForeignKey
ALTER TABLE "public"."TestPlan" ADD CONSTRAINT "TestPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestPlanTestSuite" ADD CONSTRAINT "TestPlanTestSuite_testPlanId_fkey" FOREIGN KEY ("testPlanId") REFERENCES "public"."TestPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestPlanTestSuite" ADD CONSTRAINT "TestPlanTestSuite_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "public"."TestSuite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestSuiteTestCase" ADD CONSTRAINT "TestSuiteTestCase_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "public"."TestSuite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestSuiteTestCase" ADD CONSTRAINT "TestSuiteTestCase_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "public"."TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
