import express from "express"
import morgan from "morgan";
import dotenv from "dotenv";
import { connectRedis } from "./utils/config/redis";
import prisma from "./utils/config/database";
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';
import theatreRoutes from './routes/theatreRoutes'

dotenv.config()

const app = express()

app.use(morgan("dev"))
app.use(express.json());
app.use(express.urlencoded({extended:false}));

const API_PREFIX = process.env.API_PREFIX
const API_VERSION = process.env.API_VERSION

app.use(`${API_PREFIX}/${API_VERSION}/auth`,authRoutes)
app.use(`${API_PREFIX}/${API_VERSION}/movie`,movieRoutes)
app.use(`${API_PREFIX}/${API_VERSION}/theatre`,theatreRoutes);

export const initApp = async() => {
    try {
        await connectRedis();
        console.log("Redis connected");

        await prisma.$connect();
        console.log("Prisma connected");
    } catch (error) {
        console.error("Failed to start server",error);
        process.exit(1);
    }
};

export default app;