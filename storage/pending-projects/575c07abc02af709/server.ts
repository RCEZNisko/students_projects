import express, { Application } from "express";
import cors from "cors";
import logger from "utils/logger";
import { APP_PORT } from "lib/constants";
import { MainRouter } from "routes";
import responseHandler from "middleware/responseHandler.middleware";
import db from "lib/db";
import errorHandler from "middleware/errorHandler.middleware";

const app: Application = express();

db.connect();

app.use(responseHandler);
app.set('x-powered-by', false);
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(errorHandler);
app.use(MainRouter);

app.listen(APP_PORT, () => {
    logger.info(`Starting server on port ${APP_PORT}`);
});