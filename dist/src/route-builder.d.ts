import 'core-js';
import 'reflect-metadata';
import { Router } from 'express';
import { ClassFactory } from './interfaces';
export declare class RouteBuilder {
    private router;
    classFactory: ClassFactory;
    constructor(router: Router, classFactory?: ClassFactory);
    buildRoutes(Class: any): void;
}
