/*
  Warnings:

  - You are about to drop the column `coununtry` on the `Click` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Click" DROP COLUMN "coununtry",
ADD COLUMN     "country" TEXT;
