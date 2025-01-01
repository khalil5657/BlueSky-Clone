/*
  Warnings:

  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `requestsreceived` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `requestssent` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PostImage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[commentid]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commentid` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostImage" DROP CONSTRAINT "PostImage_postid_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "repliedtoid" TEXT;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "commentid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "requestsreceived",
DROP COLUMN "requestssent";

-- DropTable
DROP TABLE "PostImage";

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userid" TEXT NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostImages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postid" TEXT NOT NULL,

    CONSTRAINT "PostImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Banner_userid_key" ON "Banner"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "PostImages_postid_key" ON "PostImages"("postid");

-- CreateIndex
CREATE UNIQUE INDEX "Image_commentid_key" ON "Image"("commentid");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_repliedtoid_fkey" FOREIGN KEY ("repliedtoid") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_commentid_fkey" FOREIGN KEY ("commentid") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostImages" ADD CONSTRAINT "PostImages_postid_fkey" FOREIGN KEY ("postid") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
