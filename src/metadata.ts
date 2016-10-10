import { Request, Response, NextFunction, Handler, RequestHandler } from 'express';
import { HttpMethod, RouteConfig, RouteConfigDecorator, routeConfigMetadataKey } from './interfaces';

export function makeRouteConfigDecorator(httpMethod: HttpMethod): RouteConfigDecorator {
    return function(api: string, ...middleware: Handler[]): MethodDecorator {
        return function(classPrototype: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
            let routeConfig: RouteConfig = { 
                httpMethod: httpMethod,
                api,
                middleware: <RequestHandler[]>middleware,
                getMethod: ctrl => ctrl[propertyKey].bind(ctrl)
            };
            let routeConfigs = Reflect.getMetadata(routeConfigMetadataKey, classPrototype) || {};

            routeConfigs[propertyKey] = routeConfig;
            
            Reflect.defineMetadata(routeConfigMetadataKey, routeConfigs, classPrototype);

            return descriptor;
        }
    }
}


export const Get = makeRouteConfigDecorator('get');
export const Post = makeRouteConfigDecorator('post');
export const Put = makeRouteConfigDecorator('put');
export const Patch = makeRouteConfigDecorator('patch');
export const Delete = makeRouteConfigDecorator('delete');
