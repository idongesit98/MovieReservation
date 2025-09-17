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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const showTimeController = __importStar(require("../controllers/showTimeController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/create", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["ADMIN"]), showTimeController.createShow);
router.get("/allShows", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["ADMIN"]), showTimeController.getAllShowsTimes);
router.get("/:showId/single", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["ADMIN"]), showTimeController.getShowById);
router.put("/:showId/update", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["ADMIN"]), showTimeController.updateShow);
router.delete("/:showId/delete", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["ADMIN"]), showTimeController.deleteShow);
router.get("/movie/:movieId", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["ADMIN"]), showTimeController.getTimeByMovie);
router.get("/auditorium/:screenId", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["ADMIN"]), showTimeController.getShowTimeAuditorium);
router.get("/:showId/alternatives", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["ADMIN"]), showTimeController.getAlternativeShowTimes);
router.get("/upcoming/list", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["ADMIN"]), showTimeController.getUpcomingShowTimes);
exports.default = router;
