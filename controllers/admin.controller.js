"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChangePassword = exports.handleDownloadBackup = exports.handleForceBackup = void 0;
const backup_1 = require("../lib/cron/backup");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../lib/db"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
const handleForceBackup = async (req, res) => {
    try {
        await (0, backup_1.createBackup)();
        res.success();
    }
    catch (err) {
        console.error(err);
        res.error();
    }
};
exports.handleForceBackup = handleForceBackup;
const handleDownloadBackup = async (req, res) => {
    try {
        const backupFiles = await fs_1.default.promises.readdir(constants_1.BACKUPS_DIR);
        const latestBackup = backupFiles.find((file) => file.endsWith('-latest.zip'));
        if (!latestBackup)
            return res.error("Nie znaleziono backupu.");
        res.download(path_1.default.join(constants_1.BACKUPS_DIR, latestBackup), 'ostatni-backupt.zip');
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleDownloadBackup = handleDownloadBackup;
const handleChangePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const authStore = await db_1.default.auth();
        if (!bcrypt_1.default.compareSync(currentPassword, authStore.data.passwd))
            return res.error("Niepoprawne hasło.");
        if (bcrypt_1.default.compareSync(newPassword, authStore.data.passwd))
            return res.error("Nowe hasło nie może być takie samo jak stare.");
        await authStore.update((state) => {
            return {
                ...state,
                passwd: bcrypt_1.default.hashSync(newPassword, bcrypt_1.default.genSaltSync())
            };
        });
        return res.success({
            changed: true
        });
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleChangePassword = handleChangePassword;
