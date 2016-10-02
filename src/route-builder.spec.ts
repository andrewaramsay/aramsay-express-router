/// <reference path="../typings/index.d.ts" />
import { Request, Response, NextFunction, Router } from 'express';

import { RouteBuilder } from './route-builder';
import { routeConfigMetadataKey, RouteConfig, RequestHandler, ClassFactory } from './interfaces';

function spy(method: any) {
    return <jasmine.Spy>method;
}

interface Middlewares {
    middleware1(): void;
    middleware2(): void;
}

interface MetadataTarget {
    getMethod(): void;
}


fdescribe('RouteBuilder', () => {
    let middlewares: Middlewares;
    let target: RouteBuilder;
    let router: Router;
    let classFactory: ClassFactory;
    let routeConfig: RouteConfig;
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        middlewares = {
            middleware1() {},
            middleware2() {}
        };
        req = <Request>{ url: 'this is a req' };
        res = <Response>{ charset: 'this is a res' };
        next = function () {};
        
        router = jasmine.createSpyObj<Router>('router', ['get', 'post', 'put', 'patch', 'delete']);
        classFactory = jasmine.createSpy('classFactory', (C: any) => new C());
        target = new RouteBuilder(router, classFactory);
        routeConfig = {
            api: 'some api',
            getMethod: c => c.getMethod.bind(c),
            httpMethod: 'get',
            middleware: [middlewares.middleware1, middlewares.middleware2]
        };
        
        defineMetadata(routeConfig);
    });

    it('defines the method with the api and middleware', () => {
        spy(classFactory).and.callThrough();
        target.buildRoutes(TestClass);

        expect(router.get).toHaveBeenCalledWith('some api', middlewares.middleware1, middlewares.middleware2, jasmine.anything());
    });

    it('sets the final handler of the route to call the getMethod for the route', () => {
        spy(classFactory).and.callThrough();
        spy(router.get).and.callFake((api: string, m1:any, m2:any, handler: RequestHandler) => {
            handler(req, res, next);
        });
        spyOn(TestClass.prototype, 'getMethod');

        target.buildRoutes(TestClass);

        expect(TestClass.prototype.getMethod).toHaveBeenCalledWith(req, res, next);
        expect(spy(TestClass.prototype.getMethod).calls.first().object).toBeTruthy();
    });

    it('calls classFactory to get a new instance of the class', () => {
        spy(classFactory).and.callThrough();
        spy(router.get).and.callFake((api: string, m1:any, m2:any, handler: RequestHandler) => {
            handler(req, res, next);
        });

        target.buildRoutes(TestClass);

        expect(classFactory).toHaveBeenCalledWith(TestClass);
    });

    it('uses route config getMethod to bind the method', () => {
        let instance = new TestClass();
        spy(classFactory).and.returnValue(instance);
        spy(router.get).and.callFake((api: string, m1:any, m2:any, handler: RequestHandler) => {
            handler(req, res, next);
        });
        spyOn(routeConfig, 'getMethod').and.callThrough();

        target.buildRoutes(TestClass);

        expect(spy(routeConfig.getMethod).calls.first().args[0]).toBe(instance);
    });

    it('calls router method for each defined route config', () => {
        defineMultipleMetadata({
            method1: routeConfig,
            method2: { api: 'other api', middleware: [], getMethod: c => c.getMethod.bind(c), httpMethod: 'get' }
        });

        target.buildRoutes(TestClass);

        expect(router.get).toHaveBeenCalledTimes(2);
        expect(router.get).toHaveBeenCalledWith('some api', middlewares.middleware1, middlewares.middleware2, jasmine.anything());
        expect(router.get).toHaveBeenCalledWith('other api', jasmine.anything());
    });

    function defineMetadata(routeConfig: RouteConfig): void {
        Reflect.deleteMetadata(routeConfigMetadataKey, TestClass.prototype);
        Reflect.defineMetadata(routeConfigMetadataKey, { method: routeConfig }, TestClass.prototype)
    }

    function defineMultipleMetadata(routeConfigs: { [key: string]: RouteConfig}) {
        Reflect.deleteMetadata(routeConfigMetadataKey, TestClass.prototype);
        Reflect.defineMetadata(routeConfigMetadataKey, routeConfigs, TestClass.prototype)
    }
});

class TestClass {
    getMethod() {}
}
