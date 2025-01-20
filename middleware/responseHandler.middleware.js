"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandler = () => {
    return (req, res, next) => {
        res.error = (message = "Something went wrong.", code = 400) => {
            res.status(code).json({
                status: "ERRROR",
                message
            });
        };
        res.success = (data) => {
            res.status(200).json({
                status: "OK",
                data
            });
        };
        res.unauthorized = () => {
            res.status(401).json({
                status: "UNAUTHORIZED"
            });
        };
        next();
    };
};
exports.default = responseHandler;
