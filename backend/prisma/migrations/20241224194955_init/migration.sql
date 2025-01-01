-- CreateTable
CREATE TABLE "MessageImage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "messageid" TEXT NOT NULL,

    CONSTRAINT "MessageImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageImage_messageid_key" ON "MessageImage"("messageid");

-- AddForeignKey
ALTER TABLE "MessageImage" ADD CONSTRAINT "MessageImage_messageid_fkey" FOREIGN KEY ("messageid") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
