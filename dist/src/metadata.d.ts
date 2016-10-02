import 'core-js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
export declare type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
export interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
}
export interface RouteConfig {
    httpMethod: HttpMethod;
    api: string;
    middleware: RequestHandler[];
    callMethod: (instance: any) => RequestHandler;
}
export interface RouteConfigDecorator {
    (api: string, ...middelware: RequestHandler[]): MethodDecorator;
}
export declare const Get: RouteConfigDecorator;
export declare const Post: RouteConfigDecorator;
export declare const Put: RouteConfigDecorator;
export declare const Patch: RouteConfigDecorator;
export declare const Delete: RouteConfigDecorator;
