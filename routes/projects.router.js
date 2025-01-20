"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsRouter = void 0;
const projects_controller_1 = require("../controllers/projects.controller");
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = (0, express_1.Router)();
router.post("/upload", projects_controller_1.handleUploadProject);
router.post("/pending-project/:projectId", auth_middleware_1.default, projects_controller_1.handleApproveProject);
router.get("/pending-projects", auth_middleware_1.default, projects_controller_1.handleGetPendingProjects);
router.get("/download/:projectId", projects_controller_1.handleDownloadProject);
router.get('/pending-project/:projectId', auth_middleware_1.default, projects_controller_1.handleGetPendingProjectInfo);
router.delete('/:projectId', auth_middleware_1.default, projects_controller_1.handleDeleteProject);
router.get("/:projectId", projects_controller_1.handleGetProjectInfo);
router.get("/", projects_controller_1.handleListProjects);
exports.projectsRouter = router;
