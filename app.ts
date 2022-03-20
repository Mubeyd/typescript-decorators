import { Request, Response } from "express";
import APIServer from "./APIServer";

const server = new APIServer();

class APIroutes {

    @route('get', '/')
    @logRoute()
    public indexRoute(req: Request, res: Response) {
        return {
            "Hello": "World"
        }
    }

}

function route(method: string, path: string): MethodDecorator {

    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {

        server.app[method](path, (req: Request, res: Response) => {
            res.status(200).json(descriptor.value(req, res));
        })
    }
}

function logRoute(): MethodDecorator {

    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
        const original = descriptor.value;
        descriptor.value = function (...args: any[]) {
            let req = args[0] as Request;
            console.log(`${req?.url} and ${req?.method} and ${req?.ip} and ${req?.originalUrl}  called`);
            return original.apply(this, args);
        };

    };
};

server.start();
