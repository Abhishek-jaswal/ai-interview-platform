-- CreateTable
CREATE TABLE "UserCredit" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attemptsRemaining" INTEGER NOT NULL DEFAULT 1,
    "totalPurchased" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL
);
