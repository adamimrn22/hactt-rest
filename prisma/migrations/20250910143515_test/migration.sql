/*
  Warnings:

  - You are about to drop the `TestPlanTestSuite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestSuiteTestCase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TestPlanTestSuite" DROP CONSTRAINT "TestPlanTestSuite_testPlanId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestPlanTestSuite" DROP CONSTRAINT "TestPlanTestSuite_testSuiteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestSuiteTestCase" DROP CONSTRAINT "TestSuiteTestCase_testCaseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TestSuiteTestCase" DROP CONSTRAINT "TestSuiteTestCase_testSuiteId_fkey";

-- DropTable
DROP TABLE "public"."TestPlanTestSuite";

-- DropTable
DROP TABLE "public"."TestSuiteTestCase";

-- CreateTable
CREATE TABLE "public"."TestPlan_Suites" (
    "testPlanId" INTEGER NOT NULL,
    "testSuiteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestPlan_Suites_pkey" PRIMARY KEY ("testPlanId","testSuiteId")
);

-- CreateTable
CREATE TABLE "public"."TestSuite_Cases" (
    "testSuiteId" INTEGER NOT NULL,
    "testCaseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestSuite_Cases_pkey" PRIMARY KEY ("testSuiteId","testCaseId")
);

-- AddForeignKey
ALTER TABLE "public"."TestPlan_Suites" ADD CONSTRAINT "TestPlan_Suites_testPlanId_fkey" FOREIGN KEY ("testPlanId") REFERENCES "public"."TestPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestPlan_Suites" ADD CONSTRAINT "TestPlan_Suites_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "public"."TestSuite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestSuite_Cases" ADD CONSTRAINT "TestSuite_Cases_testSuiteId_fkey" FOREIGN KEY ("testSuiteId") REFERENCES "public"."TestSuite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestSuite_Cases" ADD CONSTRAINT "TestSuite_Cases_testCaseId_fkey" FOREIGN KEY ("testCaseId") REFERENCES "public"."TestCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
