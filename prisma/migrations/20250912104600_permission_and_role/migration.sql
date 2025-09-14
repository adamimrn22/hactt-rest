/*
  Warnings:

  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "public"."RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "public"."RolePermission";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "public"."ProjectRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectRolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "ProjectRolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRole_name_key" ON "public"."ProjectRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRolePermission_roleId_permissionId_key" ON "public"."ProjectRolePermission"("roleId", "permissionId");

-- AddForeignKey
ALTER TABLE "public"."ProjectRolePermission" ADD CONSTRAINT "ProjectRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."ProjectRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectRolePermission" ADD CONSTRAINT "ProjectRolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
