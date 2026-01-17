/*
  Warnings:

  - You are about to drop the column `conuntry` on the `Click` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Click" DROP COLUMN "conuntry",
ADD COLUMN     "coununtry" TEXT,
ALTER COLUMN "userAgent" DROP NOT NULL;
