"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCodesRouter = void 0;
const uploadCodes_controller_1 = require("../controllers/uploadCodes.controller");
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/", uploadCodes_controller_1.handleGenerateUploadCodes);
router.delete("/", auth_middleware_1.default, uploadCodes_controller_1.handleRemoveUploadCode);
router.get("/", auth_middleware_1.default, uploadCodes_controller_1.handleListUploadCodes);
exports.uploadCodesRouter = router;
