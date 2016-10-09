import 'core-js';
import 'reflect-metadata';
import { Router } from 'express';
import { ClassFactory } from './interfaces';
export declare class RouteBuilder {
    classFactory: ClassFactory;
    private routeConfigs;
    constructor(classFactory?: ClassFactory);
    buildRoutes(Class: any, router: Router): void;
}
