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


    @logRoute()
    @route('get', '/people')
    @authenticate('123456')
    public peopleRoute(req: Request, res: Response) {
        return {
            people: [
                {
                    "firstName": "David",
                    "lastName": "Tucker"
                },
                {
                    "firstName:": "Sammy",
                    "lastName": "Davis"
                }
            ]
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
            console.log(`${req?.url} and ${req?.method} called`);
            return original.apply(this, args);
        };

    };
};

function authenticate(key: string): MethodDecorator {

    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
        const original = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const req = args[0] as Request;
            const res = args[1] as Response;
            const headers = req.headers;

            if(headers.hasOwnProperty('apikey') && headers.apikey == key ) {
                return original.apply(this, args)
            }
            
            res.status(403).json({ error: "Not Authorized"})
        };

    };
};

server.start();
