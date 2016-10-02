"use strict";
require('core-js');
require('reflect-metadata');
var interfaces_1 = require('./interfaces');
function defaultClassFactory(Class) {
    return new Class();
}
var RouteBuilder = (function () {
    function RouteBuilder(router, classFactory) {
        this.router = router;
        this.classFactory = classFactory || defaultClassFactory;
    }
    RouteBuilder.prototype.buildRoutes = function (Class) {
        var _this = this;
        var routeConfigs = Reflect.getMetadata(interfaces_1.routeConfigMetadataKey, Class.prototype);
        Object.keys(routeConfigs).forEach(function (key) {
            var route = routeConfigs[key];
            (_a = _this.router)[route.httpMethod].apply(_a, [route.api].concat(route.middleware, [function (req, res, next) {
                var controller = _this.classFactory(Class);
                route.getMethod(controller)(req, res, next);
            }]));
            var _a;
        });
    };
    return RouteBuilder;
}());
exports.RouteBuilder = RouteBuilder;
//# sourceMappingURL=route-builder.js.map