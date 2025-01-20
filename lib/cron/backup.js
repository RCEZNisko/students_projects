"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBackup = void 0;
const archiver_1 = __importDefault(require("archiver"));
const fs_1 = __importDefault(require("fs"));
const cron_1 = require("cron");
const path_1 = __importDefault(require("path"));
const constants_1 = require("../../constants");
const console_1 = require("console");
function formatNumber(number) {
    return number % 2 == 1 ? '0' + number : number.toString();
}
const createBackup = async () => {
    await fs_1.default.promises.mkdir(constants_1.BACKUPS_DIR, {
        recursive: true
    });
    const backupFiles = await fs_1.default.promises.readdir(constants_1.BACKUPS_DIR);
    const latestBackup = backupFiles.find((file) => file.endsWith('-latest.zip'));
    if (latestBackup) {
        await fs_1.default.promises.rename(path_1.default.join(constants_1.BACKUPS_DIR, latestBackup), path_1.default.join(constants_1.BACKUPS_DIR, latestBackup.replace('-latest', '')));
    }
    const now = new Date();
    const backupName = `${formatNumber(now.getDate())}-${formatNumber(now.getMonth() + 1)}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}-latest.zip`;
    const outputWS = fs_1.default.createWriteStream(path_1.default.join(constants_1.BACKUPS_DIR, backupName));
    const archive = (0, archiver_1.default)('zip', {
        zlib: { level: 9 }
    });
    archive.pipe(outputWS);
    archive.directory(path_1.default.join(__dirname, '../../storage'), false);
    archive.finalize();
    archive.on('end', () => {
        (0, console_1.log)(`Successfully created backup ${backupName}`);
    });
};
exports.createBackup = createBackup;
async function runBackupWorker() {
    const cron = new cron_1.CronJob(constants_1.BACKUP_CRON_TIME, createBackup);
    cron.start();
}
exports.default = runBackupWorker;
