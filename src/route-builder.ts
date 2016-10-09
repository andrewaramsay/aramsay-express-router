import 'core-js';
import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';

import { RouteConfig, ClassFactory, routeConfigMetadataKey } from './interfaces';

export class RouteBuilder {
    classFactory: ClassFactory;
    private routeConfigs: RouteConfigForClass[] = [];
    
    constructor(classFactory?: ClassFactory) {
        this.classFactory = classFactory || defaultClassFactory;
    }
    
    buildRoutes(Class: any, router: Router) {
        let routeConfigs: { [key: string]: RouteConfig} = Reflect.getMetadata(routeConfigMetadataKey, Class.prototype);

        Object.keys(routeConfigs).forEach(key => {
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


interface RouteConfigForClass {
    routeConfigs: { [key: string]: RouteConfig };
    class: any;
}
