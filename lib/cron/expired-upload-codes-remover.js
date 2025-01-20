"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const db_1 = __importDefault(require("../db"));
async function removeExpiredUploadCodes() {
    try {
        const uploadCodesStore = await db_1.default.uploadCodes();
        await Promise.all(Object.keys(uploadCodesStore.data).map(async (uploadCode) => {
            if (uploadCodesStore.data[uploadCode].exp >= Date.now()) {
                await uploadCodesStore.update((state) => {
                    delete uploadCodesStore.data[uploadCode];
                    return state;
                });
            }
        }));
    }
    catch (err) {
        console.error(err);
        process.exit(0);
    }
}
async function runExpiredUploadCodesRemover() {
    const job = new cron_1.CronJob(`15 * * * *`, removeExpiredUploadCodes);
    job.start();
}
exports.default = runExpiredUploadCodesRemover;
