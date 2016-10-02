"use strict";
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
        var routeConfigs = Reflect.getMetadata('routeConfig', Class.prototype);
        Object.keys(routeConfigs).forEach(function (key) {
            var route = routeConfigs[key];
            (_a = _this.router)[route.httpMethod].apply(_a, [route.api].concat(route.middleware, [function (req, res, next) {
                var controller = _this.classFactory(Class);
                route.callMethod(controller)(req, res, next);
            }]));
            var _a;
        });
    };
    return RouteBuilder;
}());
exports.RouteBuilder = RouteBuilder;
//# sourceMappingURL=route-builder.js.map