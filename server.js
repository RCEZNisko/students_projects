"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("./constants");
const cors_1 = __importDefault(require("cors"));
const backup_1 = __importDefault(require("./lib/cron/backup"));
const expired_upload_codes_remover_1 = __importDefault(require("./lib/cron/expired-upload-codes-remover"));
const routes_1 = require("./routes");
const responseHandler_middleware_1 = __importDefault(require("./middleware/responseHandler.middleware"));
const errorHandler_middleware_1 = __importDefault(require("./middleware/errorHandler.middleware"));
const path_1 = __importDefault(require("path"));
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const app = (0, express_1.default)();
app.use((0, responseHandler_middleware_1.default)());
app.set('x-powered-by', false);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json({
    limit: '1gb'
}));
app.use((0, errorHandler_middleware_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH']
}));
app.use('/api', routes_1.mainRouter);
app.use('/cdn/projects', express_1.default.static(constants_1.PROJECTS_DIR));
app.use('/cdn/pending-projects', auth_middleware_1.default, express_1.default.static(constants_1.PENDING_PROJECTS_DIR));
if (constants_1.DEV) {
    app.get('/', (req, res) => res.redirect('http://localhost:5173/'));
}
else {
    app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    app.get('*', (req, res) => res.sendFile(path_1.default.join(__dirname, 'public/index.html')));
}
(0, backup_1.default)();
(0, expired_upload_codes_remover_1.default)();
app.listen(constants_1.SERVER_PORT, () => {
    console.log(`Starting server on port ${constants_1.SERVER_PORT}`);
});
exports.default = app;
