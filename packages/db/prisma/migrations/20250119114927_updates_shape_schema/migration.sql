/*
  Warnings:

  - You are about to drop the `Circle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Free` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Line` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rectangle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Text` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `data` to the `Shape` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Circle" DROP CONSTRAINT "Circle_shapeId_fkey";

-- DropForeignKey
ALTER TABLE "Free" DROP CONSTRAINT "Free_shapeId_fkey";

-- DropForeignKey
ALTER TABLE "Line" DROP CONSTRAINT "Line_shapeId_fkey";

-- DropForeignKey
ALTER TABLE "Rectangle" DROP CONSTRAINT "Rectangle_shapeId_fkey";

-- DropForeignKey
ALTER TABLE "Text" DROP CONSTRAINT "Text_shapeId_fkey";

-- AlterTable
ALTER TABLE "Shape" ADD COLUMN     "data" JSONB NOT NULL;

-- DropTable
DROP TABLE "Circle";

-- DropTable
DROP TABLE "Free";

-- DropTable
DROP TABLE "Line";

-- DropTable
DROP TABLE "Rectangle";

-- DropTable
DROP TABLE "Text";
