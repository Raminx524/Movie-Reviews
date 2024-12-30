import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prismaClient = new PrismaClient();
export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prismaClient.genre.findMany();
    res.status(200).json(genres);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const createGenre = async (req: Request, res: Response) => {
  const { name, id } = req.body;
  try {
    const response = await prismaClient.genre.create({ data: { id, name } });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};
