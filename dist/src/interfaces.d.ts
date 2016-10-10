import { Handler, RequestHandler } from 'express';
export declare const routeConfigMetadataKey: string;
export declare type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
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
