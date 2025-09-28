"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.searchMovie = exports.updateMovie = exports.getAllMovies = exports.getSingleMovies = exports.createMovies = void 0;
const database_1 = __importDefault(require("../utils/config/database"));
const responseFormat_1 = require("../utils/config/responseFormat");
const createMovies = async (title, description, genre, rating, duration, releasedDate, language) => {
    try {
        const parsedDate = new Date(releasedDate);
        if (isNaN(parsedDate.getTime())) {
            return (0, responseFormat_1.errorResponse)(400, "Invalid releasedDate format", null);
        }
        const existing = await database_1.default.movie.findUnique({ where: { title } });
        if (existing) {
            return (0, responseFormat_1.errorResponse)(400, "Movie already exists", null);
        }
        const newMovie = await database_1.default.movie.create({
            data: {
                title,
                description,
                genre,
                releasedDate,
                rating,
                duration,
                language
            }
        });
        return (0, responseFormat_1.successResponse)(201, "Movie created successfully", { Movie: newMovie });
    }
    catch (error) {
        console.error("Creating movies Error", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to create movie", null, errorMessage);
    }
};
exports.createMovies = createMovies;
const getSingleMovies = async (movieId) => {
    try {
        const single = await database_1.default.movie.findUnique({
            where: { id: movieId },
            include: {
                showtime: true
            }
        });
        if (!single) {
            return (0, responseFormat_1.errorResponse)(404, "Movie not found,check if ID is correct", null);
        }
        return (0, responseFormat_1.successResponse)(200, "Movie found", { Movies: single });
    }
    catch (error) {
        console.error("Single movies Error", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to find single movie", null, errorMessage);
    }
};
exports.getSingleMovies = getSingleMovies;
const getAllMovies = async () => {
    try {
        const all = await database_1.default.movie.findMany({
            include: {
                showtime: true
            },
            orderBy: { created_at: "desc" }
        });
        if (all.length === 0) {
            return (0, responseFormat_1.errorResponse)(404, "No movie found", null);
        }
        return (0, responseFormat_1.successResponse)(200, "Movies found", { Movies: all });
    }
    catch (error) {
        console.error("SignUp Error", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to SignUp User", null, errorMessage);
    }
};
exports.getAllMovies = getAllMovies;
const updateMovie = async (movieId, title, description, email, genre, rating, duration, releasedDate, language) => {
    try {
        const exists = await database_1.default.movie.findUnique({ where: { id: movieId } });
        if (!exists) {
            return (0, responseFormat_1.errorResponse)(404, "Couldn't find movie", null);
        }
        const updatedMovie = await database_1.default.movie.update({
            where: { id: movieId },
            data: {
                title: title,
                description: description,
                genre: genre,
                releasedDate: releasedDate,
                rating: rating,
                duration: duration,
                language: language,
            }
        });
        return (0, responseFormat_1.successResponse)(200, "Updated successfully", { Updated: updatedMovie });
    }
    catch (error) {
        console.error("SignUp Error", error);
        const errorMessage = (error instanceof Error) ? error : null;
        return (0, responseFormat_1.errorResponse)(500, "Failed to SignUp User", null, errorMessage);
    }
};
exports.updateMovie = updateMovie;
const searchMovie = async (query) => {
    try {
        const terms = query.split(" ");
        const movies = await database_1.default.movie.findMany({
            where: {
                OR: terms.flatMap((term) => [
                    { title: { contains: term, mode: "insensitive" } },
                    { genre: { contains: term, mode: "insensitive" } }
                ])
            }
        });
        console.log("Prisma results", movies);
        if (!movies.length) {
            return (0, responseFormat_1.errorResponse)(404, "No movies found", []);
        }
        return (0, responseFormat_1.successResponse)(200, "Movies found", { movies });
    }
    catch (error) {
        console.error("Search Error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to search movies", null, error);
    }
};
exports.searchMovie = searchMovie;
const deleteMovie = async (movieId) => {
    try {
        const movie = await database_1.default.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            return (0, responseFormat_1.errorResponse)(404, "movie not found", null);
        }
        await database_1.default.movie.delete({ where: { id: movieId } });
        return (0, responseFormat_1.successResponse)(200, "Movie deleted succesffully", { Deleted: movie });
    }
    catch (error) {
        console.error("Delete Movie Error", error);
        return (0, responseFormat_1.errorResponse)(500, "Failed to delete movie", null, error);
    }
};
exports.deleteMovie = deleteMovie;
