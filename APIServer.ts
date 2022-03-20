import bodyParser from "body-parser";
import express, { Express } from "express";
import * as http from "http";

export default class APIServer {
    private _app: Express;

    get app(): Express {
        return this._app;
    }

    private _server: http.Server;

    get server(): http.Server {
        return this._server;
    }

    constructor() {
        this._app = express();

        // Set port
        this._app.set("port", process.env.Port || 3000);

        // Add MiddleWare
        this.configureMiddleWare();
    }

    public configureMiddleWare(): void {
        // Setup body parsing - required from POST requests
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));

        // Setup CORSE
        this._app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
            );
            next();
        });
    }

    public start(): void {
        // Start the server instance
        this._server = this._app.listen(this._app.get("port"), () => {
            console.log("Server is running on port " + this._app.get("port"));
        });
    }
}
