/// <reference path="../ref/_references.d.ts" />

import utils = module('./utils');

export class ConfigSetting {
    public template: string;
    public required: boolean;

    constructor();
    constructor(required: boolean);
    constructor(template: string);
    constructor(template: string, required: boolean);
    constructor(template?: any, required?: boolean) {
        if (typeof template == 'boolean') {
            required = <boolean>template;
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

    public static revive(obj: any): ConfigSetting {
        if (!obj) {
            return new ConfigSetting('', true);
        } else if (typeof obj === 'string') {
            return new ConfigSetting(obj, true);
        } else if (typeof obj === 'object') {
            return new ConfigSetting(obj.template, obj.required);
        } else {
            throw new TypeError("'obj' must be a string or object");
        }
    }

    /** Returns a copy of the object designed for cleaner JSON serialization */
    public cryofreeze(): any {
        if (!this.template && this.required) {
            return null;
        } else if (this.template && this.required) {
            return this.template;
        } else {
            var frozen: any = {};
            if (this.template) {
                frozen.template = this.template;
            }
            if (!this.required) {
                frozen.required = false;
            }
            return frozen;
        }
    }
}

export interface IZeusService {
    type: string;
    config: {};
}

export class ZeusService implements IZeusService {
    constructor();
    constructor(type: string);
    constructor(type: string, config: utils.IMap<ConfigSetting>);
    constructor(public type?: string, public config?: utils.IMap<ConfigSetting>) {
    }

    static revive(obj: IZeusService): ZeusService {
        return new ZeusService(
            obj.type,
            utils.mapObject(obj.config, ConfigSetting.revive));
    }

    public cryofreeze(): IZeusService {
        return {
            type: this.type,

            // the value is the default context, so using the prototype method works!
            config: utils.mapObject(this.config, ConfigSetting.prototype.cryofreeze)
        };
    }
}

export interface IZeusfile {
    name: string;
    services: Object
}

export class Zeusfile {
    constructor();
    constructor(name: string);
    constructor(name: string, services: utils.IMap<ZeusService>);
    constructor(public name?: string, public services?: utils.IMap<ZeusService>) {
    }

    static revive(obj: IZeusfile) {
        return new Zeusfile(
            obj.name,
            utils.mapObject(obj.services, ZeusService.revive));
    }

    /** Returns a copy of the object designed for cleaner JSON serialization */
    public cryofreeze(): IZeusfile {
        return {
            name: this.name,

            // the value is the default context, so using the prototype method works!
            services: utils.mapObject(this.services, ZeusService.prototype.cryofreeze)
        };
    }
}

export interface IServiceInstance {
    config: utils.IMap<any>;
}

export class ServiceInstance {
    constructor();
    constructor(config: utils.IMap<any>);
    constructor(public config?: utils.IMap<any>) { }

    static revive (obj : IServiceInstance) {
        return new ServiceInstance(obj.config);
    }

    /** Returns a copy of the object designed for cleaner JSON serialization */
    public cryofreeze() : IServiceInstance {
        return {
            config: this.config
        };
    }
}