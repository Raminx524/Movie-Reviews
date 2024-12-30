import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { queryBuilder } from "../utils/queryUtils";

const prismaClient = new PrismaClient();

export const getMovies = async (req: Request, res: Response) => {
  const { query } = req;
  const formattedQuery = queryBuilder(query);
  try {
    const movies = await prismaClient.movie.findMany({ where: formattedQuery });
    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const createMovie = async (req: Request, res: Response) => {
  try {
    const { title, description, genre, release_date, poster_url } = req.body;
    const response = await prismaClient.movie.create({
      data: {
        title,
        description,
        genres: { connect: genre },
        release_date,
        poster_url,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const getSingleMovie = async (req: Request, res: Response) => {
  try {
    const movie = await prismaClient.movie.findUnique({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const movie = await prismaClient.movie.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movie = await prismaClient.movie.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json(movie);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};
