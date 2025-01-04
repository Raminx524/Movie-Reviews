import { useEffect, useState } from "react";
import { IMovie } from "../Types/DataTypes";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { BASE_URL } from "../constants";

function MoviesPage() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/movies`);
        setMovies(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h1>Movies</h1>
      {movies.map((movie) => {
        return (
          <div key={movie.id}>
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p>{movie.release_date}</p>
            <img src={movie.poster_url} alt={movie.title} />
          </div>
        );
      })}
    </div>
  );
}

export default MoviesPage;
