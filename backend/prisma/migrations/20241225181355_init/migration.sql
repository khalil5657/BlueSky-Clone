-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fromid" TEXT NOT NULL,
    "toid" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lastseennotification" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "lastseennotificationid" TEXT,

    CONSTRAINT "Lastseennotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lastseennotification_userid_key" ON "Lastseennotification"("userid");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_fromid_fkey" FOREIGN KEY ("fromid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_toid_fkey" FOREIGN KEY ("toid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lastseennotification" ADD CONSTRAINT "Lastseennotification_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
