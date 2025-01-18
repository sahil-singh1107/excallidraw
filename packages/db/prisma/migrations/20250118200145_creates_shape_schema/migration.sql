/*
  Warnings:

  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropTable
DROP TABLE "Chat";

-- CreateTable
CREATE TABLE "Shape" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rectangle" (
    "id" SERIAL NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "shapeId" INTEGER NOT NULL,

    CONSTRAINT "Rectangle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Line" (
    "id" INTEGER NOT NULL,
    "x1" INTEGER NOT NULL,
    "y1" INTEGER NOT NULL,
    "x2" INTEGER NOT NULL,
    "y2" INTEGER NOT NULL,
    "shapeId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Circle" (
    "id" INTEGER NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "radius" INTEGER NOT NULL,
    "shapeId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Text" (
    "id" INTEGER NOT NULL,
    "x1" INTEGER NOT NULL,
    "y1" INTEGER NOT NULL,
    "text" TEXT,
    "shapeId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Free" (
    "id" INTEGER NOT NULL,
    "path" JSONB NOT NULL,
    "shapeId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Rectangle_shapeId_key" ON "Rectangle"("shapeId");

-- CreateIndex
CREATE UNIQUE INDEX "Line_shapeId_key" ON "Line"("shapeId");

-- CreateIndex
CREATE UNIQUE INDEX "Circle_shapeId_key" ON "Circle"("shapeId");

-- CreateIndex
CREATE UNIQUE INDEX "Text_shapeId_key" ON "Text"("shapeId");

-- CreateIndex
CREATE UNIQUE INDEX "Free_shapeId_key" ON "Free"("shapeId");

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rectangle" ADD CONSTRAINT "Rectangle_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Circle" ADD CONSTRAINT "Circle_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Text" ADD CONSTRAINT "Text_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Free" ADD CONSTRAINT "Free_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
