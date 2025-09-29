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
exports.theatreDeleted = exports.alltheatre = exports.theatreUpdate = exports.singleTheatre = exports.addTheatre = void 0;
const service = __importStar(require("../services/theatreService"));
const addTheatre = async (req, res) => {
    const { theatre_name, location, contact_info } = req.body;
    const response = await service.createTheatre(theatre_name, location, contact_info);
    res.status(response.code).json(response);
};
exports.addTheatre = addTheatre;
const singleTheatre = async (req, res) => {
    const { theatreId } = req.params;
    const response = await service.singleTheatre(theatreId);
    res.status(response.code).json(response);
};
exports.singleTheatre = singleTheatre;
const theatreUpdate = async (req, res) => {
    const { theatre_name, location, contact_info } = req.body;
    const { theatreId } = req.params;
    const response = await service.updateTheatre(theatreId, theatre_name, location, contact_info);
    res.status(response.code).json(response);
};
exports.theatreUpdate = theatreUpdate;
const alltheatre = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const response = await service.getAllTheatres(page, limit);
    res.status(response.code).json(response);
};
exports.alltheatre = alltheatre;
const theatreDeleted = async (req, res) => {
    const { theatreId } = req.params;
    const response = await service.deleteTheatre(theatreId);
    res.status(response.code).json(response);
};
exports.theatreDeleted = theatreDeleted;
