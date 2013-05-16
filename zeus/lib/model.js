/// <reference path="../ref/_references.d.ts" />
var utils = require('./utils');
var ConfigSetting = (function () {
    function ConfigSetting(template, required) {
        if (typeof template == 'boolean') {
            required = template;
            template = '';
        } else if (typeof template !== 'string') {
            throw new TypeError("'template' must be a string");
        }
        if (typeof required === 'undefined') {
            required = true;
        }
        this.template = template;
        this.required = required;
    }
    ConfigSetting.revive = function revive(obj) {
        if (!obj) {
            return new ConfigSetting('', true);
        } else if (typeof obj === 'string') {
            return new ConfigSetting(obj, true);
        } else if (typeof obj === 'object') {
            return new ConfigSetting(obj.template, obj.required);
        } else {
            throw new TypeError("'obj' must be a string or object");
        }
    };
    ConfigSetting.prototype.cryofreeze = /** Returns a copy of the object designed for cleaner JSON serialization */
    function () {
        if (!this.template && this.required) {
            return null;
        } else if (this.template && this.required) {
            return this.template;
        } else {
            var frozen = {};
            if (this.template) {
                frozen.template = this.template;
            }
            if (!this.required) {
                frozen.required = false;
            }
            return frozen;
        }
    };
    return ConfigSetting;
})();
exports.ConfigSetting = ConfigSetting;
var ZeusService = (function () {
    function ZeusService(type, config) {
        this.type = type;
        this.config = config;
    }
    ZeusService.revive = function revive(obj) {
        return new ZeusService(obj.type, utils.mapObject(obj.config, ConfigSetting.revive));
    };
    ZeusService.prototype.cryofreeze = function () {
        return {
            type: this.type,
            // the value is the default context, so using the prototype method works!
            config: utils.mapObject(this.config, ConfigSetting.prototype.cryofreeze)
        };
    };
    return ZeusService;
})();
exports.ZeusService = ZeusService;
var Zeusfile = (function () {
    function Zeusfile(name, services) {
        this.name = name;
        this.services = services;
    }
    Zeusfile.revive = function revive(obj) {
        return new Zeusfile(obj.name, utils.mapObject(obj.services, ZeusService.revive));
    };
    Zeusfile.prototype.cryofreeze = /** Returns a copy of the object designed for cleaner JSON serialization */
    function () {
        return {
            name: this.name,
            // the value is the default context, so using the prototype method works!
            services: utils.mapObject(this.services, ZeusService.prototype.cryofreeze)
        };
    };
    return Zeusfile;
})();
exports.Zeusfile = Zeusfile;
var ServiceInstance = (function () {
    function ServiceInstance(config) {
        this.config = config;
    }
    ServiceInstance.revive = function revive(obj) {
        return new ServiceInstance(obj.config);
    };
    ServiceInstance.prototype.cryofreeze = /** Returns a copy of the object designed for cleaner JSON serialization */
    function () {
        return {
            config: this.config
        };
    };
    return ServiceInstance;
})();
exports.ServiceInstance = ServiceInstance;
//@ sourceMappingURL=model.js.map
