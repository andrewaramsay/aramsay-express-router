import { Router, Request, Response, NextFunction } from 'express';
import { RouteConfig } from './metadata';

export interface ClassFactory {
    (Class: any): any;
}

function defaultClassFactory(Class: any) {
    return new Class();
}

export class RouteBuilder {
    classFactory: ClassFactory;
    
    constructor(private router: Router, classFactory: ClassFactory) {
        this.classFactory = classFactory || defaultClassFactory;
    }
    
    buildRoutes(Class: any) {
        let routeConfigs: { [key: string]: RouteConfig} = Reflect.getMetadata('routeConfig', Class.prototype);
        Object.keys(routeConfigs).forEach(key => {
            let route = routeConfigs[key];
            this.router[route.httpMethod](route.api, ...route.middleware, (req: Request, res: Response, next: NextFunction) => {
                let controller = this.classFactory(Class);
                route.callMethod(controller)(req, res, next);
            });
        })
    }
}
