import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import helmet from "helmet";
import { logger } from "./middleware/logger";
const dotenv = require("dotenv");
dotenv.config();

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(logger);
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());
    app.use(cookieParser());

    app.use("/", routes);

    app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  })
  .catch((error) => console.log(error));
