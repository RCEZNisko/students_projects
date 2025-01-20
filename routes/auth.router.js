"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const auth_controller_1 = require("../controllers/auth.controller");
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1000 * 60 * 15,
    limit: 10,
    message: {
        status: "unauthorized",
        message: "Zbyt dużo prób logowania, spróbuj ponownie za 15 min."
    }
});
router.post('/sign-in', loginLimiter, auth_controller_1.handleSignIn);
router.post('/logout', auth_middleware_1.default, auth_controller_1.handleLogout);
exports.authRouter = router;
