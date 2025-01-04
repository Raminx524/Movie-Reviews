import { IMovie, TempMovie } from "./../interfaces/dataTypes";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const { API_KEY, TMDB_TOKEN } = process.env;
const prismaClient = new PrismaClient();

// export const seedMovies = async (req: Request, res: Response) => {
// let page = 1;
// const moviesToSeed: IMovie[] = [];

// try {
//   while (moviesToSeed.length < 500) {
//     const response = await fetch(
//       `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`,
//       {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//           Authorization: `Bearer ${TMDB_TOKEN}`,
//         },
//       }
//     );

//     const moviesData = await response.json();

//     if (moviesData.results.length === 0) {
//       break;
//     }

//       const tempMovies: TempMovie[] = moviesData.results
//         .filter((movie: any) => movie.genre_ids.length > 0) // Filter out movies without genres
//         .map((movie: any) => ({
//           title: movie.title,
//           description: movie.overview,
//           release_date: movie.release_date,
//           poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
//           genre_ids: movie.genre_ids,
//         }));

//       // Create movies for seeding
//       const movies: IMovie[] = tempMovies.map((movie) => ({
//         title: movie.title,
//         description: movie.description,
//         release_date: movie.release_date,
//         poster_url: movie.poster_url,
//       }));

//       // Fetch genres from the database
//       const genres = await prismaClient.genre.findMany();
//       const validGenreIds = genres.map((genre) => genre.id);

//       // Save movies to the database
//       await prismaClient.movie.createMany({
//         data: movies,
//         skipDuplicates: true, // Avoid duplicates
//       });

//       // Fetch newly created movies
//       const createdMovieRecords = await prismaClient.movie.findMany({
//         where: {
//           title: { in: movies.map((movie) => movie.title) },
//         },
//       });

//       // Add movie-genre relationships
//       for (let i = 0; i < createdMovieRecords.length; i++) {
//         const genreIds = tempMovies[i]?.genre_ids || [];
//         const validGenreIdsForMovie = genreIds.filter((id: number) =>
//           validGenreIds.includes(id)
//         );

//         if (validGenreIdsForMovie.length > 0) {
//           await prismaClient.movieGenre.createMany({
//             data: validGenreIdsForMovie.map((genreId: number) => ({
//               movieId: createdMovieRecords[i].id,
//               genreId,
//             })),
//             skipDuplicates: true, // Avoid unique constraint errors
//           });
//         }
//       }

//       moviesToSeed.push(...movies);
//       page++;
//     }

//     res
//       .status(200)
//       .json({ message: "Movies seeded successfully!", movies: moviesToSeed });
//   } catch (error) {
//     console.error("Error seeding movies:", error);
//     res.status(500).json({ error: "Failed to seed movies" });
//   }
// };

export const seedGenres = async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?language=en`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    );

    const genresData = await response.json();
    const genres = genresData.genres.map((genre: any) => ({
      id: genre.id,
      name: genre.name,
    }));
    const savedGenres = await prismaClient.genre.createMany({
      data: genres,
    });
    res.status(200).json(savedGenres);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const resetDatabase = async (req: Request, res: Response) => {
  try {
    await prismaClient.review.deleteMany();
    await prismaClient.movie.deleteMany();
    await prismaClient.genre.deleteMany();
    await prismaClient.user.deleteMany();

    console.log("Successfully cleared Movie and MovieGenre tables.");
    res.status(200).json({ message: "Database reset successfully!" });
  } catch (error) {
    console.error("Error resetting database:", error);
    res.status(500).json({ error: "Failed to reset database" });
  }
};

export const seedMovies = async (req: Request, res: Response) => {
  let page = 1;
  const movies = [];

  try {
    while (movies.length < 500) {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_TOKEN}`,
          },
        }
      );

      const moviesData = await response.json();

      if (moviesData.results.length !== 0) {
        const mappedMovies = moviesData.results
          .filter((movie: any) => movie.genre_ids.length > 0) // Filter out movies without genres
          .map((movie: any) => ({
            title: movie.title,
            description: movie.overview,
            release_date: movie.release_date,
            poster_url: movie.poster_path,
            genres: movie.genre_ids,
          }));

        movies.push(...mappedMovies);
        page++;
      }
    }
    const dbMovies = movies.map((movie: any) => ({
      title: movie.title,
      description: movie.description,
      release_date: movie.release_date,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_url}`,
      genres: {
        connect: movie.genres.map((genre: number) => ({ id: genre })),
      },
    }));

    const dbEntries = dbMovies.map((movie) => {
      return prismaClient.movie.create({
        data: movie,
      });
    });

    const dbRes = await Promise.all(dbEntries);

    res.status(201).json({ message: "Movies seeded successfully!", dbRes });
  } catch (error) {
    console.error("Error seeding movies:", error);
    res.status(500).json({ error: "Failed to seed movies" });
  }
};
