/*
  Warnings:

  - Added the required column `role` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- Add the new column with a default value
ALTER TABLE "Customer" ADD COLUMN "role" VARCHAR(255) DEFAULT 'customer';

-- Optional: Update existing rows with the default value
UPDATE "Customer" SET "role" = 'customer' WHERE "role" IS NULL;
