"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDownloadProject = exports.handleGetPendingProjects = exports.handleGetPendingProjectInfo = exports.handleGetProjectInfo = exports.handleDeleteProject = exports.handleApproveProject = exports.handleListProjects = exports.handleUploadProject = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const constants_1 = require("../constants");
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("../lib/db"));
const archiver_1 = __importDefault(require("archiver"));
const tokenStatus_1 = __importDefault(require("../lib/enums/tokenStatus"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const generateRandomPastelColor = () => {
    const r = () => Math.floor(Math.random() * 152 + 103);
    const toHex = (value) => value.toString(16).padStart(2, '0');
    return `#${toHex(r())}${toHex(r())}${toHex(r())}`;
};
const sanitizeFileName = (fileName) => {
    let isRestricted = false;
    return !isRestricted && fileName.split('/').map(name => {
        name = name.replace(/[^a-zA-Z0-9_\-.\\/]+/g, '_');
        if (constants_1.RESTRICTED_FILENAMES.includes(name)) {
            isRestricted = true;
        }
        return name;
    }).join('/') || null;
};
const handleUploadProject = async (req, res) => {
    let projectRoot = "";
    try {
        const projectsStore = await db_1.default.projects();
        const tagsStore = await db_1.default.tags();
        const uploadCodesStore = await db_1.default.uploadCodes();
        const sanitizedFiles = [];
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
        const authorized = await (0, auth_middleware_1.validateToken)(token) == tokenStatus_1.default.VALID || false;
        let { name, author, description, technologies, category, uploadCode, files } = req.body;
        if (!name || !author || (!authorized && !uploadCode) || !category || !technologies || !files)
            return res.error("Some of required inputs are empty", 417);
        if (!authorized && (!Object.keys(uploadCodesStore.data).includes(uploadCode) || uploadCodesStore.data[uploadCode].exp < Date.now()))
            return res.error("Invalid or expired upload code.", 401);
        category = Number(category) < Number(Object.keys(tagsStore.data.categories).slice(-1)) && Number(category);
        const projectId = (0, crypto_1.randomBytes)(8).toString('hex');
        projectRoot = path_1.default.join(constants_1.PENDING_PROJECTS_DIR, projectId);
        await fs_1.default.promises.mkdir(projectRoot);
        const writeFile = async (fileName, fileContent, filePath) => {
            if (fileName.includes('/')) {
                const dirName = fileName.split('/')[0];
                filePath = path_1.default.join(filePath, dirName);
                await fs_1.default.promises.mkdir(filePath, {
                    recursive: true
                });
                await writeFile(fileName.substring(dirName.length + 1), fileContent, filePath);
            }
            else {
                await fs_1.default.promises.writeFile(path_1.default.join(filePath, fileName), fileContent, {
                    encoding: 'utf8',
                    mode: 0o666,
                    flag: 'w'
                });
            }
        };
        await Promise.all(Object.keys(files).map(async (fileName) => {
            fileName = sanitizeFileName(fileName);
            sanitizedFiles.push(fileName);
            fileName && await writeFile(fileName, files[fileName] || '', projectRoot);
        }));
        await projectsStore.update(state => {
            const project = {
                name,
                id: projectId,
                author,
                description,
                date: Date.now(),
                color: generateRandomPastelColor(),
                tags: {
                    technologies: technologies,
                    category,
                },
                stats: {
                    views: 0,
                    downloads: 0
                },
                files: sanitizedFiles
            };
            return {
                ...state,
                pendingProjects: {
                    ...state.pendingProjects,
                    [projectId]: project
                }
            };
        });
        if (!authorized)
            await uploadCodesStore.update(state => {
                delete state[uploadCode];
                return state;
            });
        res.success();
    }
    catch (err) {
        if (projectRoot) {
            await fs_1.default.promises.rm(projectRoot, {
                force: true,
                recursive: true
            });
        }
        console.error(err);
        res.error();
    }
};
exports.handleUploadProject = handleUploadProject;
const handleListProjects = async (req, res) => {
    try {
        const projectsStore = await db_1.default.projects();
        const sortingMethod = req.query.sortingMethod && Number(req.query.sortingMethod) || 0;
        const technologiesFilter = req.query.technologies && req.query.technologies.toString().split(',').map(v => Number(v));
        const categoriesFilter = req.query.categories && req.query.categories.toString().split(',').map(v => Number(v));
        const queryFilter = req.query.query && req.query.query.toString().toLowerCase();
        const page = req.query.page && Number(req.query.page) || 0;
        const projects = [];
        Object.entries(projectsStore.data.projects).filter(([projectId, projectData]) => {
            if (technologiesFilter && !technologiesFilter.every(tagId => projectData.tags.technologies.includes(tagId)))
                return false;
            if (categoriesFilter && !categoriesFilter.includes(projectData.tags.category))
                return false;
            if (queryFilter && !projectData.name.toLowerCase().includes(queryFilter) && !projectData.author.toLowerCase().includes(queryFilter))
                return false;
            return true;
        }).map(([projectId, projectData]) => {
            projects.push({
                ...projectData,
                id: projectId
            });
        });
        switch (sortingMethod) {
            case 0:
                projects.sort((a, b) => b.date - a.date);
                break;
            case 1:
                projects.sort((a, b) => a.date - b.date);
                break;
            case 2:
                projects.sort((a, b) => b.stats.views - a.stats.views);
                break;
            case 3:
                projects.sort((a, b) => a.stats.views - b.stats.views);
                break;
            case 4:
                projects.sort((a, b) => b.stats.downloads - a.stats.downloads);
                break;
            case 5:
                projects.sort((a, b) => a.stats.downloads - b.stats.downloads);
                break;
        }
        res.success({
            projects: projects.slice(page * constants_1.PROJECTS_PER_PAGE, page * constants_1.PROJECTS_PER_PAGE + constants_1.PROJECTS_PER_PAGE),
            end: (page + 1) * constants_1.PROJECTS_PER_PAGE >= projects.length
        });
    }
    catch (err) {
        console.error(err);
        res.error();
    }
};
exports.handleListProjects = handleListProjects;
const handleApproveProject = async (req, res) => {
    try {
        const approved = req.query.approved === 'true';
        const projectId = req.params.projectId;
        const projectsStore = await db_1.default.projects();
        if (!approved) {
            await fs_1.default.promises.rm(path_1.default.join(constants_1.PENDING_PROJECTS_DIR, projectId), {
                recursive: true,
                force: true
            });
            await projectsStore.update(state => {
                const pendingProjects = { ...state.pendingProjects };
                delete pendingProjects[projectId];
                return {
                    ...state,
                    pendingProjects
                };
            });
            return res.success({ approved });
        }
        if (!fs_1.default.existsSync(path_1.default.join(constants_1.PENDING_PROJECTS_DIR, projectId)))
            return res.error("No project found", 404);
        await projectsStore.update((state) => {
            const project = { ...state.pendingProjects[projectId] };
            delete state.pendingProjects[projectId];
            return {
                ...state,
                projects: {
                    ...state.projects,
                    [projectId]: project
                }
            };
        });
        await fs_1.default.promises.rename(path_1.default.join(constants_1.PENDING_PROJECTS_DIR, projectId), path_1.default.join(constants_1.PROJECTS_DIR, projectId));
        res.success();
    }
    catch (err) {
        console.error(err);
        res.error();
    }
};
exports.handleApproveProject = handleApproveProject;
const handleDeleteProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projectsStore = await db_1.default.projects();
        if (!Object.keys(projectsStore.data.projects).includes(projectId))
            return res.error("No project found.", 404);
        await fs_1.default.promises.rm(path_1.default.join(constants_1.PROJECTS_DIR, projectId), {
            recursive: true,
            force: true
        });
        await projectsStore.update(state => {
            delete state.projects[projectId];
            return state;
        });
        res.success();
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleDeleteProject = handleDeleteProject;
const handleGetProjectInfo = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projectsStore = await db_1.default.projects();
        if (!Object.keys(projectsStore.data.projects).includes(projectId))
            return res.error("No projects found.", 404);
        const projectData = projectsStore.data.projects[projectId];
        await projectsStore.update(state => ({
            ...state,
            projects: {
                ...state.projects,
                [projectId]: {
                    ...state.projects[projectId],
                    stats: {
                        ...state.projects[projectId].stats,
                        views: state.projects[projectId].stats.views + 1
                    }
                }
            }
        }));
        res.success(projectData);
    }
    catch (err) {
        console.error(err);
        res.error();
    }
};
exports.handleGetProjectInfo = handleGetProjectInfo;
const handleGetPendingProjectInfo = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projectsStore = await db_1.default.projects();
        if (!Object.keys(projectsStore.data.pendingProjects).includes(projectId))
            return res.error("No projects found.", 404);
        const projectData = projectsStore.data.pendingProjects[projectId];
        res.success(projectData);
    }
    catch (err) {
        console.error(err);
        res.error();
    }
};
exports.handleGetPendingProjectInfo = handleGetPendingProjectInfo;
const handleGetPendingProjects = async (req, res) => {
    try {
        const pendingProjects = {};
        const projectsStore = await db_1.default.projects();
        const tagsStore = await db_1.default.tags();
        Object.keys(projectsStore.data.pendingProjects).map(projectId => {
            const { author, date, name, tags } = projectsStore.data.pendingProjects[projectId];
            const _tags = [];
            _tags.push(tagsStore.data.categories[tags.category]);
            Object.keys(tags.technologies).map(tagId => {
                _tags.push(tagsStore.data.technologies[tagId]);
            });
            pendingProjects[projectId] = {
                name,
                author,
                date,
                tags: _tags
            };
        });
        res.success(pendingProjects);
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleGetPendingProjects = handleGetPendingProjects;
const handleDownloadProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const projectsStore = await db_1.default.projects();
        if (!Object.keys(projectsStore.data.projects).includes(projectId))
            return res.error('No project found.');
        const projectData = projectsStore.data.projects[projectId];
        const projectFiles = projectData.files;
        const archive = (0, archiver_1.default)('zip', { zlib: { level: 9 } });
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Disposition', `attachment; filename="${projectId.toString()}.zip"`);
        archive.pipe(res);
        await Promise.all(projectFiles.map(async (fileName) => {
            const filePath = path_1.default.join(constants_1.PROJECTS_DIR, projectId, fileName);
            try {
                const buffer = await fs_1.default.promises.readFile(filePath);
                if (!buffer)
                    return;
                archive.append(buffer, { name: fileName });
            }
            catch (err) { }
        }));
        archive.finalize();
        await projectsStore.update(state => ({
            ...state,
            projects: {
                ...state.projects,
                [projectId]: {
                    ...state.projects[projectId],
                    stats: {
                        ...state.projects[projectId].stats,
                        downloads: state.projects[projectId].stats.downloads + 1
                    }
                }
            }
        }));
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleDownloadProject = handleDownloadProject;
