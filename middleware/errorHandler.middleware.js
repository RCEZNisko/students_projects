"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
function errorHandler() {
    return (err, req, res, next) => {
        res.error("Coś poszło nie tak...", 417);
    };
}
