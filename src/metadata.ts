import 'core-js';
import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

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

function makeRouteConfigDecorator(httpMethod: HttpMethod): RouteConfigDecorator {
    return function(api: string, ...middleware: RequestHandler[]): MethodDecorator {
        return function(classPrototype: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
            let routeConfig: RouteConfig = { 
                httpMethod: httpMethod,
                api,
                middleware,
                callMethod: ctrl => ctrl[propertyKey].bind(ctrl)
            };
            let routeConfigs = Reflect.getMetadata('routeConfig', classPrototype) || {};

            routeConfigs[propertyKey] = routeConfig;
            
            Reflect.defineMetadata('routeConfig', routeConfigs, classPrototype);

            return descriptor;
        }
    }
}


export const Get = makeRouteConfigDecorator('get');
export const Post = makeRouteConfigDecorator('post');
export const Put = makeRouteConfigDecorator('put');
export const Patch = makeRouteConfigDecorator('patch');
export const Delete = makeRouteConfigDecorator('delete');
