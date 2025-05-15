/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_HistoricToItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `membership_commission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spreadsheet_upload` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario_allowed` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_HistoricToItem" DROP CONSTRAINT "_HistoricToItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_HistoricToItem" DROP CONSTRAINT "_HistoricToItem_B_fkey";

-- DropForeignKey
ALTER TABLE "commission" DROP CONSTRAINT "commission_id_company_fkey";

-- DropForeignKey
ALTER TABLE "historic" DROP CONSTRAINT "historic_id_user_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_id_commission_fkey";

-- DropForeignKey
ALTER TABLE "membership_commission" DROP CONSTRAINT "membership_commission_id_commission_fkey";

-- DropForeignKey
ALTER TABLE "membership_commission" DROP CONSTRAINT "membership_commission_id_user_fkey";

-- DropForeignKey
ALTER TABLE "settings" DROP CONSTRAINT "settings_id_user_fkey";

-- DropForeignKey
ALTER TABLE "spreadsheet_upload" DROP CONSTRAINT "spreadsheet_upload_id_commission_fkey";

-- DropForeignKey
ALTER TABLE "spreadsheet_upload" DROP CONSTRAINT "spreadsheet_upload_id_user_fkey";

-- DropForeignKey
ALTER TABLE "user_company" DROP CONSTRAINT "user_company_id_company_fkey";

-- DropForeignKey
ALTER TABLE "user_company" DROP CONSTRAINT "user_company_id_user_fkey";

-- DropForeignKey
ALTER TABLE "user_organization" DROP CONSTRAINT "user_organization_id_organization_fkey";

-- DropForeignKey
ALTER TABLE "user_organization" DROP CONSTRAINT "user_organization_id_user_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
DROP COLUMN "provider",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- DropTable
DROP TABLE "_HistoricToItem";

-- DropTable
DROP TABLE "commission";

-- DropTable
DROP TABLE "company";

-- DropTable
DROP TABLE "historic";

-- DropTable
DROP TABLE "items";

-- DropTable
DROP TABLE "membership_commission";

-- DropTable
DROP TABLE "organization";

-- DropTable
DROP TABLE "settings";

-- DropTable
DROP TABLE "spreadsheet_upload";

-- DropTable
DROP TABLE "user_company";

-- DropTable
DROP TABLE "user_organization";

-- DropTable
DROP TABLE "usuario_allowed";
