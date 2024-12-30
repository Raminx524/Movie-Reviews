/*
  Warnings:

  - You are about to drop the `_MovieGenres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MovieGenres" DROP CONSTRAINT "_MovieGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieGenres" DROP CONSTRAINT "_MovieGenres_B_fkey";

-- DropTable
DROP TABLE "_MovieGenres";

-- CreateTable
CREATE TABLE "_MovieGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MovieGenre_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MovieGenre_B_index" ON "_MovieGenre"("B");

-- AddForeignKey
ALTER TABLE "_MovieGenre" ADD CONSTRAINT "_MovieGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieGenre" ADD CONSTRAINT "_MovieGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
