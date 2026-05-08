"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middlewares/error.middleware");
const logger_1 = __importDefault(require("./utils/logger"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const interview_routes_1 = __importDefault(require("./routes/interview.routes"));
const workflow_routes_1 = __importDefault(require("./routes/workflow.routes"));
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const permission_routes_1 = __importDefault(require("./routes/permission.routes"));
const document_routes_1 = __importDefault(require("./routes/document.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const hotel_routes_1 = __importDefault(require("./routes/hotel.routes"));
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Parsing Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging Middleware
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.default.info(message.trim())
    }
}));
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/applications', application_routes_1.default);
app.use('/api/interviews', interview_routes_1.default);
app.use('/api/workflow', workflow_routes_1.default);
app.use('/api/activity', activity_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/permissions', permission_routes_1.default);
app.use('/api/documents', document_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/hotels', hotel_routes_1.default);
// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running successfully' });
});
// Error Handling Middlewares
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
