"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const fs_1 = __importDefault(require("fs"));
const JSONFileAdapter = async (path, schema) => {
    const loadData = async () => {
        try {
            return JSON.parse(await fs_1.default.promises.readFile(path, {
                encoding: 'utf-8'
            }));
        }
        catch (err) {
            return schema;
        }
    };
    let data = await loadData();
    const update = async (fn) => {
        data = fn(data);
        await fs_1.default.promises.writeFile(path, JSON.stringify(data, null, 4), {
            encoding: 'utf-8'
        });
    };
    return { data, update };
};
const db = {
    projects: () => JSONFileAdapter(path_1.default.join(__dirname, "../storage/projects.json"), {
        projects: {},
        pendingProjects: {}
    }),
    uploadCodes: () => JSONFileAdapter(path_1.default.join(__dirname, "../storage/upload-codes.json"), {}),
    tags: () => JSONFileAdapter(path_1.default.join(__dirname, "../storage/tags.json"), {
        technologies: {},
        categories: {}
    }),
    auth: () => JSONFileAdapter(path_1.default.join(__dirname, "../storage/auth.json"), {
        login: "admin",
        passwd: bcrypt_1.default.hashSync("admin", bcrypt_1.default.genSaltSync()),
        token: ""
    })
};
exports.default = db;
