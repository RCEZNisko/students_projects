"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogout = exports.handleSignIn = void 0;
const crypto_1 = require("crypto");
const constants_1 = require("../constants");
const db_1 = __importDefault(require("../lib/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const handleSignIn = async (req, res) => {
    try {
        const login = req.body.login && req.body.login.trim();
        const passwd = req.body.password && req.body.password.trim();
        const authStore = await db_1.default.auth();
        if (login == authStore.data.login && bcrypt_1.default.compareSync(passwd, authStore.data.passwd)) {
            const token = jsonwebtoken_1.default.sign({
                key: (0, crypto_1.randomBytes)(5).toString('hex'),
                time: Date.now()
            }, constants_1.JWT_SECRET, {
                algorithm: 'HS384',
                expiresIn: Date.now() + 1000 * 60 * 60 * 24
            });
            await authStore.update(state => {
                return {
                    ...state,
                    token
                };
            });
            res.success({
                authenticated: true,
                token
            });
        }
        else
            res.error("Niepoprawny login lub hasło", 401);
    }
    catch (err) {
        console.log(err);
        res.error();
    }
    ``;
};
exports.handleSignIn = handleSignIn;
const handleLogout = async (req, res) => {
    try {
        const authStore = await db_1.default.auth();
        await authStore.update((state) => {
            return {
                ...state,
                token: ''
            };
        });
        res.success();
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleLogout = handleLogout;
