import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { IRequestWithUserId } from "../interfaces/dataTypes";

const prismaClient = new PrismaClient();
export const getReviews = async (req: Request, res: Response) => {
  const movieId = req.params.movieId;
  try {
    const reviews = await prismaClient.review.findMany({
      where: { movieId: Number(movieId) },
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const createReview = async (req: IRequestWithUserId, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const { rating, review_text, movieId } = req.body;
    const movie = await prismaClient.movie.findUnique({
      where: { id: Number(movieId) },
    });
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }
    const response = await prismaClient.review.create({
      data: { rating, review_text, movieId, userId: req.userId },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
};

export const updateReview = async (req: IRequestWithUserId, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const review = await prismaClient.review.update({
      where: { id: Number(req.params.id), userId: req.userId },
      data: req.body,
    });
    res.status(200).json(review);
  } catch (error: any) {
    if (error.code === "P2025") {
      // Handle case where no review matches the condition
      res.status(404).json({ error: "Review not found or unauthorized" });
    } else {
      res.status(503).json({ error: "Service unavailable" });
    }
  }
};

export const deleteReview = async (req: IRequestWithUserId, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const review = await prismaClient.review.delete({
      where: { id: Number(req.params.id), userId: req.userId },
    });
    res.status(200).json(review);
  } catch (error: any) {
    if (error.code === "P2025") {
      // Handle case where no review matches the condition
      res.status(404).json({ error: "Review not found or unauthorized" });
    } else {
      res.status(503).json({ error: "Service unavailable" });
    }
  }
};
