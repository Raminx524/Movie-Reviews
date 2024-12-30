import { Router } from "express";
import { createGenre, getGenres } from "../controllers/genreController";
import {
  createUser,
  getUser,
  loginUser,
  updateUser,
} from "../controllers/userController";
import {
  createMovie,
  deleteMovie,
  getMovies,
  getReviews,
  getSingleMovie,
  updateMovie,
} from "../controllers/movieController";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../controllers/reviewController";
import {
  resetDatabase,
  seedGenres,
  seedMovies,
} from "../controllers/seedController";
import { verifyAdmin, verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Completed marked as //?Blue

//? Genre Routes
router.get("/genre", getGenres);
router.post("/genre", verifyAdmin, createGenre); //! Admin only

//? Auth/User Routes
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/user/:id", verifyToken, getUser);
router.patch("/user/:id", verifyToken, updateUser);

//? Movie Routes
router.get("/movies", getMovies);
router.get("/movies/:id", getSingleMovie);
router.get("/movies/:id/reviews", getReviews);
router.post("/movies", verifyAdmin, createMovie); //! Admin only
router.patch("/movies/:id", verifyAdmin, updateMovie); //! Admin only
router.delete("/movies/:id", verifyAdmin, deleteMovie); //! Admin only

//? Seed Routes
router.get("/seed", verifyAdmin, seedMovies); //! Admin only
router.get("/seedGenres", verifyAdmin, seedGenres); //! Admin only
router.get("/reset", verifyAdmin, resetDatabase); //! Admin only

//? Review Routes
router.post("/reviews", verifyToken, createReview);
router.patch("/reviews/:id", verifyToken, updateReview);
router.delete("/reviews/:id", verifyToken, deleteReview);

export default router;
