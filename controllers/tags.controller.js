"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRenameTag = exports.handleRemoveTag = exports.handleAddTag = exports.handleUpdateTags = exports.handleListTags = void 0;
const db_1 = __importDefault(require("../lib/db"));
const handleListTags = async (req, res) => {
    try {
        const tagsStore = await db_1.default.tags();
        const type = req.params.type;
        const tags = type ? tagsStore.data[type] : tagsStore.data;
        res.success(tags);
    }
    catch (err) {
        res.error();
    }
};
exports.handleListTags = handleListTags;
const handleUpdateTags = async (req, res) => {
    try {
        let { tagType, tagName, tagId } = req.body;
        const tagsStore = await db_1.default.tags();
        const action = req.params && String(req.params.action);
        if (!tagType)
            return res.error("No tag type was provided.");
        tagType = tagType.substring(0, tagType.length - 1) + "ies";
        switch (action) {
            case "add":
                if (!tagName || !tagType)
                    throw new Error();
                await tagsStore.update((state) => {
                    return {
                        ...state,
                        [tagType]: {
                            ...state[tagType],
                            [Object.keys(state[tagType]).length]: tagName
                        }
                    };
                });
                return res.success({
                    added: true
                });
            case "remove":
                if (!tagId || !tagType)
                    throw new Error();
                await tagsStore.update((state) => {
                    delete state[tagType][tagId];
                    return state;
                });
                return res.success({
                    removed: true
                });
            case "update":
                if (!tagName || !tagId || !tagType)
                    throw new Error();
                await tagsStore.update((state) => {
                    state[tagType][tagId] = tagName;
                    return state;
                });
                return res.success({
                    updated: true
                });
        }
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleUpdateTags = handleUpdateTags;
const handleAddTag = async (req, res) => {
    try {
        let { tagName, tagType } = req.body;
        const tagsStore = await db_1.default.tags();
        tagType = tagType.substring(0, tagType.length - 1) + "ies";
        let tagId = null;
        await tagsStore.update(state => {
            tagId = Number(Object.keys(state[tagType])[Object.keys(state[tagType]).length - 1]) + 1;
            return {
                ...state,
                [tagType]: {
                    ...state[tagType],
                    [tagId]: tagName
                }
            };
        });
        res.success({
            tagId
        });
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleAddTag = handleAddTag;
const handleRemoveTag = async (req, res) => {
    try {
        let { tagType, tagId } = req.body;
        const tagsStore = await db_1.default.tags();
        tagType = tagType.substring(0, tagType.length - 1) + "ies";
        await tagsStore.update(state => {
            delete state[tagType][tagId];
            return state;
        });
        res.success();
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleRemoveTag = handleRemoveTag;
const handleRenameTag = async (req, res) => {
    try {
    }
    catch (err) {
        console.log(err);
        res.error();
    }
};
exports.handleRenameTag = handleRenameTag;
