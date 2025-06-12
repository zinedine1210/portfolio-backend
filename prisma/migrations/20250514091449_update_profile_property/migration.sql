/*
  Warnings:

  - Added the required column `age` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MAN', 'WOMAN', 'OTHER');

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MAN',
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "resume_url" TEXT,
ADD COLUMN     "telephone" TEXT NOT NULL,
ADD COLUMN     "website_url" TEXT;
