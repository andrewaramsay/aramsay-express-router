"use strict";
require('core-js');
require('reflect-metadata');
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
                callMethod: function (ctrl) { return ctrl[propertyKey].bind(ctrl); }
            };
            var routeConfigs = Reflect.getMetadata('routeConfig', classPrototype) || {};
            routeConfigs[propertyKey] = routeConfig;
            Reflect.defineMetadata('routeConfig', routeConfigs, classPrototype);
            return descriptor;
        };
    };
}
exports.Get = makeRouteConfigDecorator('get');
exports.Post = makeRouteConfigDecorator('post');
exports.Put = makeRouteConfigDecorator('put');
exports.Patch = makeRouteConfigDecorator('patch');
exports.Delete = makeRouteConfigDecorator('delete');
//# sourceMappingURL=metadata.js.map