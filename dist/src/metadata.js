"use strict";
require('core-js');
require('reflect-metadata');
var interfaces_1 = require('./interfaces');
function makeRouteConfigDecorator(httpMethod) {
    return function (api) {
        var middleware = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            middleware[_i - 1] = arguments[_i];
        }
        return function (classPrototype, propertyKey, descriptor) {
            var routeConfig = {
                httpMethod: httpMethod,
                api: api,
                middleware: middleware,
                getMethod: function (ctrl) { return ctrl[propertyKey].bind(ctrl); }
            };
            var routeConfigs = Reflect.getMetadata(interfaces_1.routeConfigMetadataKey, classPrototype) || {};
            routeConfigs[propertyKey] = routeConfig;
            Reflect.defineMetadata(interfaces_1.routeConfigMetadataKey, routeConfigs, classPrototype);
            return descriptor;
        };
    };
}
exports.makeRouteConfigDecorator = makeRouteConfigDecorator;
exports.Get = makeRouteConfigDecorator('get');
exports.Post = makeRouteConfigDecorator('post');
exports.Put = makeRouteConfigDecorator('put');
exports.Patch = makeRouteConfigDecorator('patch');
exports.Delete = makeRouteConfigDecorator('delete');
//# sourceMappingURL=metadata.js.map