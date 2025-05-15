-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "phone" TEXT,
    "status" TEXT,
    "provider" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_allowed" (
    "id_uuid" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" TEXT,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "avatar" TEXT,

    CONSTRAINT "usuario_allowed_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "organization" (
    "id_uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "user_organization" (
    "id_uuid" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "id_organization" UUID NOT NULL,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_organization_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "company" (
    "id_uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "company_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "user_company" (
    "id_uuid" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "id_company" UUID NOT NULL,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_company_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "commission" (
    "id_uuid" UUID NOT NULL,
    "id_company" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "President_id" UUID,

    CONSTRAINT "commission_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "membership_commission" (
    "id_uuid" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "id_commission" UUID NOT NULL,
    "role" TEXT,

    CONSTRAINT "membership_commission_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "spreadsheet_upload" (
    "id_uuid" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "id_commission" UUID NOT NULL,
    "href" TEXT,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "spreadsheet_upload_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "items" (
    "id_uuid" UUID NOT NULL,
    "id_commission" UUID NOT NULL,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "items_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "historic" (
    "id_uuid" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "id_items" UUID[],
    "action" TEXT,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historic_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "settings" (
    "id_uuid" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "theme" INTEGER DEFAULT 0,
    "acelerator" BOOLEAN DEFAULT true,
    "notification" BOOLEAN DEFAULT false,
    "create_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id_uuid")
);

-- CreateTable
CREATE TABLE "_HistoricToItem" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_HistoricToItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_allowed_id_user_key" ON "usuario_allowed"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "user_organization_id_user_id_organization_key" ON "user_organization"("id_user", "id_organization");

-- CreateIndex
CREATE UNIQUE INDEX "user_company_id_user_id_company_key" ON "user_company"("id_user", "id_company");

-- CreateIndex
CREATE UNIQUE INDEX "membership_commission_id_user_id_commission_key" ON "membership_commission"("id_user", "id_commission");

-- CreateIndex
CREATE UNIQUE INDEX "settings_id_user_key" ON "settings"("id_user");

-- CreateIndex
CREATE INDEX "_HistoricToItem_B_index" ON "_HistoricToItem"("B");

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "usuario_allowed"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_organization" ADD CONSTRAINT "user_organization_id_organization_fkey" FOREIGN KEY ("id_organization") REFERENCES "organization"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_company" ADD CONSTRAINT "user_company_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "usuario_allowed"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_company" ADD CONSTRAINT "user_company_id_company_fkey" FOREIGN KEY ("id_company") REFERENCES "company"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission" ADD CONSTRAINT "commission_id_company_fkey" FOREIGN KEY ("id_company") REFERENCES "company"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_commission" ADD CONSTRAINT "membership_commission_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "usuario_allowed"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_commission" ADD CONSTRAINT "membership_commission_id_commission_fkey" FOREIGN KEY ("id_commission") REFERENCES "commission"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spreadsheet_upload" ADD CONSTRAINT "spreadsheet_upload_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "usuario_allowed"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spreadsheet_upload" ADD CONSTRAINT "spreadsheet_upload_id_commission_fkey" FOREIGN KEY ("id_commission") REFERENCES "commission"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_id_commission_fkey" FOREIGN KEY ("id_commission") REFERENCES "commission"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historic" ADD CONSTRAINT "historic_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "usuario_allowed"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "usuario_allowed"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoricToItem" ADD CONSTRAINT "_HistoricToItem_A_fkey" FOREIGN KEY ("A") REFERENCES "historic"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HistoricToItem" ADD CONSTRAINT "_HistoricToItem_B_fkey" FOREIGN KEY ("B") REFERENCES "items"("id_uuid") ON DELETE CASCADE ON UPDATE CASCADE;
