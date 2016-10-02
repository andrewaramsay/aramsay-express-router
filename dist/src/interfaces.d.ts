import { Request, Response, NextFunction } from 'express';
export declare const routeConfigMetadataKey: string;
export declare type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
export interface RouteConfigDecorator {
    (api: string, ...middelware: RequestHandler[]): MethodDecorator;
}
export interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
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
