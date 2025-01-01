-- CreateTable
CREATE TABLE "LastSeenMessages" (
    "id" TEXT NOT NULL,
    "fromid" TEXT NOT NULL,
    "toid" TEXT NOT NULL,
    "lastseenmessageid" TEXT NOT NULL,

    CONSTRAINT "LastSeenMessages_pkey" PRIMARY KEY ("id")
);
