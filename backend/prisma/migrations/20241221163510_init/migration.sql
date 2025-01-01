-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "quotespostid" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_quotespostid_fkey" FOREIGN KEY ("quotespostid") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
