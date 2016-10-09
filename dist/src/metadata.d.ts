import { HttpMethod, RouteConfigDecorator } from './interfaces';
export declare function makeRouteConfigDecorator(httpMethod: HttpMethod): RouteConfigDecorator;
export declare const Get: RouteConfigDecorator;
export declare const Post: RouteConfigDecorator;
export declare const Put: RouteConfigDecorator;
export declare const Patch: RouteConfigDecorator;
export declare const Delete: RouteConfigDecorator;
