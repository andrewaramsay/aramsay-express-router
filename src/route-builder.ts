import { Router, Request, Response, NextFunction, RequestHandler } from 'express';

import { RouteConfig, ClassFactory, routeConfigMetadataKey } from './interfaces';

export class RouteBuilder {
    classFactory: ClassFactory;
    
    constructor(classFactory?: ClassFactory) {
        this.classFactory = classFactory || defaultClassFactory;
    }
    
    buildRoutes(Class: any, router: Router) {
        let routeConfigs: { [key: string]: RouteConfig} = Reflect.getMetadata(routeConfigMetadataKey, Class.prototype);

        Reflect.ownKeys(routeConfigs).forEach(key => {
            let route = routeConfigs[key];
            router[route.httpMethod](route.api, ...route.middleware, (req: Request, res: Response, next: NextFunction) => {
                let controller = this.classFactory(Class);
                route.getMethod(controller)(req, res, next);
            });
        });
    }
}

function defaultClassFactory(Class: any) {
    return new Class();
}
