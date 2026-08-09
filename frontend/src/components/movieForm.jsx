import React, { useEffect, useMemo, useCallback } from "react";
import Joi from "joi";
import useForm from "../hooks/useForm";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { Link } from "react-router-dom";
import FormSkeleton from "./common/formSkeleton";

const MovieForm = ({ match, history }) => {
  const { user } = useAuth();
  const isAdmin = user && user.isAdmin;

  const schema = useMemo(() => ({
    _id: Joi.string().allow(""),
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().min(0).max(100).required().label("Stock"),
    dailyRentalRate: Joi.number().min(0).max(10).required().label("Rate"),
  }), []);

  const validateForm = useCallback((data) => {
    // Exclude file fields from validation
    const { poster, posterUrl, ...dataToValidate } = data;

    const options = { abortEarly: false };
    const { error } = Joi.object(schema).validate(dataToValidate, options);
    if (!error) return {};

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  }, [schema]);

  const mapToViewModel = useCallback((movie) => ({
    _id: movie._id,
    title: movie.title,
    genreId: movie.genre._id,
    numberInStock: movie.numberInStock,
    dailyRentalRate: movie.dailyRentalRate,
    posterUrl: movie.posterUrl || '',
  }), []);

  const { data, renderInput, renderSelect, renderImageUpload, renderButton, handleChange, handleSubmit, errors, setErrors, setData } = useForm(
    {
      _id: "",
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
      poster: null,
      posterUrl: "",
    },
    validateForm
  );

  const { data: genresData, loading: genresLoading } = useFetch(
    async () => {
      const { data } = await getGenres();
      return data;
    },
    []
  );

  const movieId = match.params.id;
  const { data: movieData, loading: movieLoading } = useFetch(
    async () => {
      if (movieId === "new") return null;
      const { data } = await getMovie(movieId);
      return data;
    },
    [movieId]
  );

  useEffect(() => {
    if (movieData) {
      const viewModel = mapToViewModel(movieData);
      setData(viewModel);
    }
  }, [movieData, setData, mapToViewModel]);

  useEffect(() => {
    if (movieData === null && movieId !== "new" && !movieLoading) {
      history.replace("/not-found");
    }
  }, [movieData, movieId, movieLoading, history]);

  const loading = genresLoading || (movieId !== "new" && movieLoading);

  const doSubmit = useCallback(async () => {
    try {
      // Validate poster is required for new movies
      if (!data._id && !data.poster) {
        setErrors((prevErrors) => ({ ...prevErrors, poster: "Poster is required for new movies" }));
        return;
      }

      const movie = {
        _id: data._id,
        title: data.title,
        genreId: data.genreId,
        numberInStock: Number(data.numberInStock),
        dailyRentalRate: Number(data.dailyRentalRate),
        poster: data.poster, // File object for upload (null for updates without new image)
      };

      await saveMovie(movie);
      history.push("/movies");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errorMessage = ex.response.data;
        // Check if it's a validation error for poster
        if (errorMessage.includes("poster") || errorMessage.includes("Poster")) {
          setErrors((prevErrors) => ({ ...prevErrors, poster: errorMessage }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, title: errorMessage }));
        }
      } else {
        console.error("Error saving movie:", ex);
      }
    }
  }, [data, history, setErrors]);

  if (loading) return <FormSkeleton />;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {isAdmin ? (movieId === "new" ? "Add New Movie" : "Edit Movie") : "Movie Details"}
        </h1>
        {isAdmin && <p className="mt-1 text-sm text-gray-400">Manage movie information and availability.</p>}
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {/* Movie Poster Display */}
        {(data.posterUrl || data.poster) && (
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl transition-transform hover:scale-[1.02]">
              <img
                src={data.posterUrl || (data.poster && URL.createObjectURL(data.poster))}
                alt={data.title || "Movie Poster"}
                className="w-full object-cover"
                style={{ aspectRatio: '2/3' }}
              />
              {!isAdmin && user && (
                <div className="p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                  <Link
                    to={`/rentals/new?movieId=${data._id}`}
                    className="block w-full rounded-lg bg-green-600 px-4 py-3 text-center font-bold text-white shadow-lg transition hover:bg-green-500 hover:shadow-green-500/25 no-underline"
                  >
                    🎬 Rent Movie
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={`w-full ${data.posterUrl || data.poster ? "md:w-2/3" : ""}`}>
          {!isAdmin && data.posterUrl && (
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/80 p-8 shadow-xl backdrop-blur-md">
              <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {data.title}
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700/50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Genre</p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    {genresData?.find(g => g._id === data.genreId)?.name || 'N/A'}
                  </p>
                </div>
                
                <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700/50">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Availability</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-xl font-semibold text-white">{data.numberInStock}</p>
                    <p className="text-sm text-gray-400">in stock</p>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-800/50 p-5 border border-gray-700/50 sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Daily Rental Rate</p>
                  <p className="mt-1 text-3xl font-bold text-emerald-400">
                    Rs {data.dailyRentalRate}
                    <span className="text-lg font-normal text-gray-400"> / day</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {user && !isAdmin && !data.posterUrl && (
            <Link
              to={`/rentals/new?movieId=${data._id}`}
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-base font-bold text-white shadow-lg transition hover:bg-green-500 hover:shadow-green-500/25 no-underline mb-6"
            >
              🎬 Rent Movie
            </Link>
          )}

          {isAdmin && (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
              <form onSubmit={handleSubmit(doSubmit)}>
                {renderInput("title", "Title")}
                {renderSelect("genreId", "Genre", genresData || [], "_id", "name")}
                {renderInput("numberInStock", "Stock", "number")}
                {renderInput("dailyRentalRate", "Rate", "number")}
                {renderImageUpload("poster", "Movie Poster")}
                {renderButton("Save")}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
