/// <reference path="../ref/_references.d.ts" />

export interface IMap<T> extends Object {
    [key: string]: T;
}

export function mapObject(object: Object, callback: () => any);
export function mapObject(object: Object, callback: (value: any) => any);
export function mapObject(object: Object, callback: (value: any, key: string) => any);
export function mapObject(object: Object, callback: (value: any, key: string, object: Object) => any);
export function mapObject(object: Object, callback: () => any, context: any);
export function mapObject(object: Object, callback: (value: any) => any, context: any);
export function mapObject(object: Object, callback: (value: any, key: string) => any, context: any);
export function mapObject(object: Object, callback: (value: any, key: string, object: Object) => any, context: any);
export function mapObject(object: Object, callback: (value: any, key: string, object: Object) => any, context?: any) {
    if (!callback) {
        return object;
    }
    if (!object) {
        return object;
    }
    
    var result = {};
    Object.keys(object).forEach(function (key) {
        var value = object[key];
        result[key] = callback.call(context || value, value, key, object);
    });
    return result;
};