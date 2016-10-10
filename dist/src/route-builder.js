"use strict";
var interfaces_1 = require('./interfaces');
var RouteBuilder = (function () {
    function RouteBuilder(classFactory) {
        this.classFactory = classFactory || defaultClassFactory;
    }
    RouteBuilder.prototype.buildRoutes = function (Class, router) {
        var _this = this;
        var routeConfigs = Reflect.getMetadata(interfaces_1.routeConfigMetadataKey, Class.prototype);
        Reflect.ownKeys(routeConfigs).forEach(function (key) {
            var route = routeConfigs[key];
            router[route.httpMethod].apply(router, [route.api].concat(route.middleware, [function (req, res, next) {
                var controller = _this.classFactory(Class);
                route.getMethod(controller)(req, res, next);
            }]));
        });
    };
    return RouteBuilder;
}());
exports.RouteBuilder = RouteBuilder;
function defaultClassFactory(Class) {
    return new Class();
}
//# sourceMappingURL=route-builder.js.map