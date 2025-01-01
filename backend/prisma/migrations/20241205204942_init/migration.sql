/*
  Warnings:

  - You are about to drop the column `commentid` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_commentid_fkey";

-- DropIndex
DROP INDEX "Image_commentid_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "commentid";

-- CreateTable
CREATE TABLE "CommentImage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "commentid" TEXT NOT NULL,

    CONSTRAINT "CommentImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentImage_commentid_key" ON "CommentImage"("commentid");

-- AddForeignKey
ALTER TABLE "CommentImage" ADD CONSTRAINT "CommentImage_commentid_fkey" FOREIGN KEY ("commentid") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
