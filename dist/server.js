"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 5000;
// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
    logger_1.default.error('UNCAUGHT EXCEPTION! Shutting down...', err);
    process.exit(1);
});
// Start Server
const startServer = async () => {
    try {
        // Connect to Database
        await (0, db_1.connectDB)();
        const server = app_1.default.listen(PORT, () => {
            logger_1.default.info(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
        // Handle Unhandled Rejections
        process.on('unhandledRejection', (err) => {
            logger_1.default.error('UNHANDLED REJECTION! Shutting down...', err);
            server.close(() => {
                process.exit(1);
            });
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
