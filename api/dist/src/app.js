"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initApp = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("./utils/config/redis");
const database_1 = __importDefault(require("./utils/config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
const theatreRoutes_1 = __importDefault(require("./routes/theatreRoutes"));
const auditoriumRoutes_1 = __importDefault(require("./routes/auditoriumRoutes"));
const seatRoutes_1 = __importDefault(require("./routes/seatRoutes"));
const reservationRoutes_1 = __importDefault(require("./routes/reservationRoutes"));
const showTimeRoutes_1 = __importDefault(require("./routes/showTimeRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const API_PREFIX = process.env.API_PREFIX;
const API_VERSION = process.env.API_VERSION;
app.use(`${API_PREFIX}/${API_VERSION}/auth`, authRoutes_1.default);
app.use(`${API_PREFIX}/${API_VERSION}/movie`, movieRoutes_1.default);
app.use(`${API_PREFIX}/${API_VERSION}/theatre`, theatreRoutes_1.default);
app.use(`${API_PREFIX}/${API_VERSION}/auditorium`, auditoriumRoutes_1.default);
app.use(`${API_PREFIX}/${API_VERSION}/seat`, seatRoutes_1.default);
app.use(`${API_PREFIX}/${API_VERSION}/reservation`, reservationRoutes_1.default);
app.use(`${API_PREFIX}/${API_VERSION}/showtime`, showTimeRoutes_1.default);
app.use(`${API_PREFIX}/${API_VERSION}/payment`, paymentRoutes_1.default);
const initApp = async () => {
    try {
        await (0, redis_1.connectRedis)();
        console.log("Redis connected");
        await database_1.default.$connect();
        console.log("Prisma connected");
    }
    catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
};
exports.initApp = initApp;
exports.default = app;
