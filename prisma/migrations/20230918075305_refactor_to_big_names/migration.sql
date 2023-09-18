/*
  Warnings:

  - You are about to drop the column `created_at` on the `Files` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Files` table. All the data in the column will be lost.
  - You are about to drop the column `creation_date` on the `User` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creationDate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Files` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `creation_date`,
    ADD COLUMN `creationDate` BIGINT NOT NULL;
