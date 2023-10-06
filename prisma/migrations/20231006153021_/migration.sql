/*
  Warnings:

  - A unique constraint covering the columns `[path,userId]` on the table `Files` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Files_path_key` ON `Files`;

-- CreateIndex
CREATE UNIQUE INDEX `Files_path_userId_key` ON `Files`(`path`, `userId`);
