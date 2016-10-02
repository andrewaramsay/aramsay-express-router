import { Router } from 'express';
export interface ClassFactory {
    (Class: any): any;
}
export declare class RouteBuilder {
    private router;
    classFactory: ClassFactory;
    constructor(router: Router, classFactory: ClassFactory);
    buildRoutes(Class: any): void;
}
