/*
  Warnings:

  - Made the column `repliedtoid` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_repliedtoid_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "repliedtoid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_repliedtoid_fkey" FOREIGN KEY ("repliedtoid") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
