/// <reference path="../typings/index.d.ts" />
import { Request, Response, NextFunction } from 'express';

import { Get, Post, Put, Patch, Delete, makeRouteConfigDecorator } from './metadata';
import { routeConfigMetadataKey, RouteConfig, RouteConfigDecorator } from './interfaces';

interface Middlewares {
    middleware1(): void;
    middleware2(): void;
}

interface MetadataTarget {
    getMethod(): void;
}

describe('metadata', () => {
    let metadataTarget: MetadataTarget;
    let middlewares: Middlewares;
    let req: Request;
    let res: Response;
    let next: NextFunction;
    
    beforeEach(() => {
        metadataTarget = {
            getMethod() {}
        };
        middlewares = {
            middleware1() {},
            middleware2() {}
        };
        
        req = <Request>{ url: 'this is a req' };
        res = <Response>{ charset: 'this is a res' };
        next = function () {};
    })
    
    describe('makeRouteConfigDecorator', () => {
        let target: RouteConfigDecorator;

        beforeEach(() => {
            target = makeRouteConfigDecorator('get');
        });
        
        it('creates a routeConfig metadata for the method', () => {
            target('some api')(metadataTarget, 'getMethod', {});
            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            expect(metadata).toBeTruthy('metadata does not exist');
            expect(metadata.getMethod).toBeTruthy('metadata does not contain getMethod');
        });

        it('does not overwrite existing route config metadata when applied to different methods', () => {
            target('some api')(metadataTarget, 'getMethod', {});
            target('some other api')(metadataTarget, 'otherGetMethod', {});
            
            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            expect(metadata.getMethod).toBeTruthy('metadata does not contain getMethod');
            expect(metadata.otherGetMethod).toBeTruthy('metadata does not contain otherGetMethod');
            expect(metadata.getMethod).not.toBe(metadata.otherGetMethod, 'otherGetMethod overwrote getMethod');
        });

        it('sets the route info on the routeConfig metadata', () => {
            target('some api')(metadataTarget, 'getMethod', {});

            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            let routeConfig: RouteConfig = metadata.getMethod;

            expect(routeConfig.api).toBe('some api');
            expect(routeConfig.httpMethod).toBe('get');
        });

        it('sets the middleware on the routeConfig metadata', () => {
            target('some api', middlewares.middleware1, middlewares.middleware2)(metadataTarget, 'getMethod', {});

            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            let routeConfig: RouteConfig = metadata.getMethod;

            expect(routeConfig.api).toBe('some api');
            expect(routeConfig.middleware[0]).toBe(middlewares.middleware1);
            expect(routeConfig.middleware[1]).toBe(middlewares.middleware2);
            expect(routeConfig.httpMethod).toBe('get');
        });

        it('sets a method getter which binds the method name to an object', () => {
            spyOn(metadataTarget, 'getMethod');
            target('some api')(metadataTarget, 'getMethod', {});

            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            let routeConfig: RouteConfig = metadata.getMethod;

            let boundMethod = routeConfig.getMethod(metadataTarget);
            boundMethod(req, res, next);
            expect(metadataTarget.getMethod).toHaveBeenCalledWith(req, res, next);
            expect((<jasmine.Spy>metadataTarget.getMethod).calls.first().object).toBe(metadataTarget, "'this' was not bound correctly.");
        });
    });

    describe('Get', () => {
        it('sets the httpMethod to "get"', () => {
            Get('some api')(metadataTarget, 'getMethod', {});

            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            let routeConfig: RouteConfig = metadata.getMethod;

            expect(routeConfig.httpMethod).toBe('get');
        });
    });

    describe('Post', () => {
        it('sets the httpMethod to "post"', () => {
            Post('some api')(metadataTarget, 'getMethod', {});

            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            let routeConfig: RouteConfig = metadata.getMethod;

            expect(routeConfig.httpMethod).toBe('post');
        });
    });

    describe('Put', () => {
        it('sets the httpMethod to "put"', () => {
            Put('some api')(metadataTarget, 'getMethod', {});

            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            let routeConfig: RouteConfig = metadata.getMethod;

            expect(routeConfig.httpMethod).toBe('put');
        });
    });

    describe('Patch', () => {
        it('sets the httpMethod to "patch"', () => {
            Patch('some api')(metadataTarget, 'getMethod', {});

            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            let routeConfig: RouteConfig = metadata.getMethod;

            expect(routeConfig.httpMethod).toBe('patch');
        });
    });

    describe('Delete', () => {
        it('sets the httpMethod to "delete"', () => {
            Delete('some api')(metadataTarget, 'getMethod', {});

            let metadata = Reflect.getMetadata(routeConfigMetadataKey, metadataTarget);
            let routeConfig: RouteConfig = metadata.getMethod;

            expect(routeConfig.httpMethod).toBe('delete');
        });
    });
});
