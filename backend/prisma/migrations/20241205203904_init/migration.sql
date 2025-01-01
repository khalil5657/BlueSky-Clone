-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_repliedtoid_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "repliedtoid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_repliedtoid_fkey" FOREIGN KEY ("repliedtoid") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
