/*
  Warnings:

  - A unique constraint covering the columns `[absolutePath]` on the table `Files` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `absolutePath` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Files_path_userId_key` ON `Files`;

-- AlterTable
ALTER TABLE `Files` ADD COLUMN `absolutePath` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Files_absolutePath_key` ON `Files`(`absolutePath`);
