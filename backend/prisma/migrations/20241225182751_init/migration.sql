/*
  Warnings:

  - You are about to drop the `Lastseennotification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lastseennotification" DROP CONSTRAINT "Lastseennotification_userid_fkey";

-- DropTable
DROP TABLE "Lastseennotification";

-- CreateTable
CREATE TABLE "LastSeenNotification" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "lastseennotificationid" TEXT,

    CONSTRAINT "LastSeenNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LastSeenNotification_userid_key" ON "LastSeenNotification"("userid");

-- AddForeignKey
ALTER TABLE "LastSeenNotification" ADD CONSTRAINT "LastSeenNotification_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
