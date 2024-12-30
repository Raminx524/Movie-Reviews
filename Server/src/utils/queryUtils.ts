import { ParsedQs } from "qs";
import { Prisma } from "@prisma/client";

export function queryBuilder(query: ParsedQs): Prisma.MovieWhereInput {
  const prismaQuery: Prisma.MovieWhereInput = {};

  // Handle title
  if (query.title) {
    prismaQuery.title = {
      contains: query.title as string, // Partial match
      mode: "insensitive", // Case insensitive search
    };
  }

  // Handle release_date (stored as a string in the database)
  if (query.release_date) {
    const releaseDate = query.release_date as string;

    // Validate the release_date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(releaseDate)) {
      prismaQuery.release_date = releaseDate; // Exact string match
    } else {
      console.warn("Invalid release_date format. Expected YYYY-MM-DD.");
    }
  }

  return prismaQuery;
}
