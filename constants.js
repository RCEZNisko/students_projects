"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RESTRICTED_FILENAMES = exports.BACKUP_CRON_TIME = exports.BACKUPS_DIR = exports.JWT_SECRET = exports.PROJECTS_PER_PAGE = exports.TEMP_DIR = exports.PENDING_PROJECTS_DIR = exports.PROJECTS_DIR = exports.DEV = exports.SERVER_PORT = void 0;
const path_1 = __importDefault(require("path"));
exports.SERVER_PORT = 3010;
exports.DEV = false;
exports.PROJECTS_DIR = path_1.default.join(__dirname, "./storage/projects");
exports.PENDING_PROJECTS_DIR = path_1.default.join(__dirname, "./storage/pending-projects");
exports.TEMP_DIR = path_1.default.join(__dirname, "./temp");
exports.PROJECTS_PER_PAGE = 10;
exports.JWT_SECRET = "asdlpoajdo,.32r=3209-_JDFG(*(34tg";
exports.BACKUPS_DIR = path_1.default.join(__dirname, "./backups");
exports.BACKUP_CRON_TIME = "0 14 * * *";
exports.RESTRICTED_FILENAMES = [
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
    "CLOCK$",
    "nul",
    "con",
    "prn",
    "aux",
    "com1",
    "com2",
    "com3",
    "com4",
    "com5",
    "com6",
    "com7",
    "com8",
    "com9",
    "lpt1",
    "lpt2",
    "lpt3",
    "lpt4",
    "lpt5",
    "lpt6",
    "lpt7",
    "lpt8",
    "lpt9",
    ".",
    ".."
];
