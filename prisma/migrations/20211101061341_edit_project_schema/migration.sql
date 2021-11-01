/*
  Warnings:

  - You are about to drop the column `path` on the `project` table. All the data in the column will be lost.
  - Added the required column `viewCode` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xmlCode` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `path`,
    ADD COLUMN `viewCode` MEDIUMTEXT NOT NULL,
    ADD COLUMN `xmlCode` MEDIUMTEXT NOT NULL;
