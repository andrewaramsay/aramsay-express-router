import { Router } from 'express';
import { ClassFactory } from './interfaces';
export declare class RouteBuilder {
    classFactory: ClassFactory;
    constructor(classFactory?: ClassFactory);
    buildRoutes(Class: any, router: Router): void;
}
