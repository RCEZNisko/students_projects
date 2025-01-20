"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRemoveUploadCode = exports.handleListUploadCodes = exports.handleGenerateUploadCodes = void 0;
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../lib/db"));
const generateRandomBytes = (length) => (0, crypto_1.randomBytes)(length).toString('hex');
const handleGenerateUploadCodes = async (req, res) => {
    try {
        const { note, quantity = 1, exp } = req.body;
        const generatedUploadCodes = {};
        const uploadCodesStore = await db_1.default.uploadCodes();
        if (!exp)
            return res.error("No expiration time was provided.", 417);
        for (let i = 0; i < quantity; i++) {
            const uploadCode = `${generateRandomBytes(3)}-${generateRandomBytes(3)}-${generateRandomBytes(2)}`;
            generatedUploadCodes[uploadCode] = {
                exp,
                note
            };
        }
        await uploadCodesStore.update((state) => {
            return {
                ...state,
                ...generatedUploadCodes
            };
        });
        res.success({ uploadCodes: Object.keys(generatedUploadCodes) });
    }
    catch (err) {
        console.error(err);
        res.error();
    }
};
exports.handleGenerateUploadCodes = handleGenerateUploadCodes;
const handleListUploadCodes = async (req, res) => {
    try {
        const uploadCodes = [];
        const uploadCodesStore = await db_1.default.uploadCodes();
        await Promise.all(Object.keys(uploadCodesStore.data).map(async (uploadCode) => {
            const { exp, note } = await uploadCodesStore.data[uploadCode];
            uploadCodes.push([uploadCode, exp, note]);
        }));
        res.success(uploadCodes);
    }
    catch (err) {
        console.error(err);
        res.error();
    }
};
exports.handleListUploadCodes = handleListUploadCodes;
const handleRemoveUploadCode = async (req, res) => {
    try {
        const { code } = req.body;
        const uploadCodesStore = await db_1.default.uploadCodes();
        await uploadCodesStore.update(state => {
            delete state[code];
            return state;
        });
        res.success();
    }
    catch (err) {
        console.error(err);
        res.error();
    }
};
exports.handleRemoveUploadCode = handleRemoveUploadCode;
