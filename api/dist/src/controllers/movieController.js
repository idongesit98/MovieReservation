"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieDeleted = exports.moviesSearch = exports.movieUpdate = exports.allMovies = exports.singleMovies = exports.addMovies = void 0;
const service = __importStar(require("../services/movieServices"));
const addMovies = async (req, res) => {
    const { title, description, genre, rating, duration, releasedDate, language } = req.body;
    const parsedDate = new Date(`${releasedDate}T00:00:00.000Z`);
    // if (isNaN(parsedDate.getTime())) {
    //   return res.status(400).json({ message: "Invalid release date" });
    // }
    const response = await service.createMovies(title, description, genre, rating, duration, parsedDate, language);
    res.status(response.code).json(response);
};
exports.addMovies = addMovies;
const singleMovies = async (req, res) => {
    const { movieId } = req.params;
    const response = await service.getSingleMovies(movieId);
    res.status(response.code).json(response);
};
exports.singleMovies = singleMovies;
const allMovies = async (req, res) => {
    const response = await service.getAllMovies();
    res.status(response.code).json(response);
};
exports.allMovies = allMovies;
const movieUpdate = async (req, res) => {
    const { title, description, email, genre, rating, duration, releasedDate, language } = req.body;
    const { movieId } = req.params;
    const response = await service.updateMovie(movieId, title, description, email, genre, rating, duration, releasedDate, language);
    res.status(response.code).json(response);
};
exports.movieUpdate = movieUpdate;
const moviesSearch = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: "Search query is required" });
    }
    const response = await service.searchMovie(query);
    res.status(response.code).json(response);
};
exports.moviesSearch = moviesSearch;
const movieDeleted = async (req, res) => {
    const { movieId } = req.params;
    const response = await service.deleteMovie(movieId);
    res.status(response.code).json(response);
};
exports.movieDeleted = movieDeleted;
