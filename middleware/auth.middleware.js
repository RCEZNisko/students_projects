"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const tokenStatus_1 = __importDefault(require("../lib/enums/tokenStatus"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../lib/db"));
const constants_1 = require("../constants");
const validateToken = async (token) => {
    try {
        const authStore = await db_1.default.auth();
        if (authStore.data.token != token)
            throw new Error();
        if (jsonwebtoken_1.default.decode(token).exp <= Date.now())
            return tokenStatus_1.default.EXPIRED;
        jsonwebtoken_1.default.verify(token, constants_1.JWT_SECRET);
        return tokenStatus_1.default.VALID;
    }
    catch (err) {
        return tokenStatus_1.default.INVALID;
    }
};
exports.validateToken = validateToken;
const requireAuth = async (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (await (0, exports.validateToken)(token) != tokenStatus_1.default.VALID)
        return res.unauthorized();
    next();
};
exports.default = requireAuth;
