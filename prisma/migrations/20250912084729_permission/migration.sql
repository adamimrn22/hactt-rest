-- CreateTable
CREATE TABLE "public"."UserProjectEnrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "UserProjectEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RolePermission" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProjectEnrollment_userId_projectId_key" ON "public"."UserProjectEnrollment"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "public"."Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_permissionId_key" ON "public"."RolePermission"("role", "permissionId");

-- AddForeignKey
ALTER TABLE "public"."UserProjectEnrollment" ADD CONSTRAINT "UserProjectEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProjectEnrollment" ADD CONSTRAINT "UserProjectEnrollment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
