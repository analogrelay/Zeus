/// <reference path="../ref/_references.d.ts" />

import utils = module('./utils');
import model = module('./model');
import ui = module('./ui');

export interface IPlugin {
    collectGlobalConfiguration(callback: (config: utils.IMap<any>) => void ): void;
    createServiceInstance(environmentName: string, service: model.ZeusService, callback: ResultCallback<model.ServiceInstance>): void;
    provision(environment: model.Environment, service: model.ZeusService, instance: model.ServiceInstance, callback: Callback): void;
}

class PluginBase implements IPlugin {
    constructor(private context: ctx.Context, private ui: ui.IUIService);
}

//function Plugin(context, ui) {
//    this.context = context;
//    this.ui = ui;

//    this.serviceTypes = {};
//}

//Plugin.prototype.collectGlobalConfiguration = function (callback) {
//    // Nothing to do by default
//};

//Plugin.prototype.createServiceInstance = function (zeusfile, environmentName, service, serviceName, type, callback) {
//    if (this.serviceTypes.hasOwnProperty(type)) {
//        this.serviceTypes[type].createInstance(zeusfile, environmentName, service, serviceName, callback);
//    } else {
//        callback(new Error("No handler for service type '" + type + "' registered."));
//    }
//};

//Plugin.prototype.provision = function (zeusfile, env, type, service, instance, callback) {
//    if (this.serviceTypes.hasOwnProperty(type)) {
//        this.serviceTypes[type].provision(zeusfile, env, service, instance, callback);
//    } else {
//        callback(new Error("No handler for service type '" + type + "' registered."));
//    }
//};

//module.exports = exports = Plugin;