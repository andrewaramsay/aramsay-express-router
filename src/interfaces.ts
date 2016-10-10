import { Request, Response, NextFunction, Handler, RequestHandler } from 'express';

export const routeConfigMetadataKey = 'aramsay-express-router:routeConfig';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface RouteConfigDecorator {
    (api: string, ...middelware: Handler[]): MethodDecorator;
}

export interface RouteConfig {
    httpMethod: HttpMethod;
    api: string;
    middleware: RequestHandler[];
    getMethod: (instance: any) => RequestHandler;
}

export interface ClassFactory {
    (Class: any): any;
}