"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsRouter = void 0;
const tags_controller_1 = require("../controllers/tags.controller");
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.get("/:type?", tags_controller_1.handleListTags);
router.post("/update", auth_middleware_1.default, tags_controller_1.handleAddTag);
router.delete("/update", auth_middleware_1.default, tags_controller_1.handleRemoveTag);
exports.tagsRouter = router;
