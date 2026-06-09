/*
  Warnings:

  - You are about to drop the column `stats` on the `players` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "players" DROP COLUMN "stats",
ADD COLUMN     "blocks" INTEGER DEFAULT 0,
ADD COLUMN     "cleanSheets" INTEGER DEFAULT 0,
ADD COLUMN     "clearances" INTEGER DEFAULT 0,
ADD COLUMN     "dribbles" INTEGER DEFAULT 0,
ADD COLUMN     "goalsAgainst" INTEGER DEFAULT 0,
ADD COLUMN     "interceptions" INTEGER DEFAULT 0,
ADD COLUMN     "passCompletion" INTEGER DEFAULT 0,
ADD COLUMN     "passes" INTEGER DEFAULT 0,
ADD COLUMN     "saves" INTEGER DEFAULT 0,
ADD COLUMN     "shotAccuracy" INTEGER DEFAULT 0,
ADD COLUMN     "shots" INTEGER DEFAULT 0,
ADD COLUMN     "tackles" INTEGER DEFAULT 0,
ALTER COLUMN "assists" DROP NOT NULL,
ALTER COLUMN "goals" DROP NOT NULL;
