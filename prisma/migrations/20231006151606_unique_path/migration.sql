/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Files_path_key` ON `Files`(`path`);
