/// <reference path="lib.d.ts" />

// Underscore 1.4.2

// http://underscorejs.org
// http://github.com/documentcloud/underscore

// NOTE:
// Typescript doesn't currently support generics. This library definition
// will benefit largely with generics when available.

// Collections
declare module "underscore" {
    export function each(list: any[], iterator: (item: any) => void , context?: any): void;
    export function each(list: any, iterator: (item: any, key: any) => void , context?: any): void;

    export function forEach(list: any[], iterator: (item: any) => void , context?: any): void;
    export function forEach(list: any, iterator: (item: any, key: any) => void , context?: any): void;

    export function map(list, iterator, context?);

    export function collect(list, iterator, context?);
    
    export function reduce(list, iterator, memo, context?);
    export function inject(list, iterator, memo, context?);
    export function foldl(list, iterator, memo, context?);

    
    export function reduceRight(list, iterator, memo, context?);
    export function foldr(list, iterator, memo, context?);
    
    export function find(list: any[], iterator: (item) => bool, context?): any;
    export function detect(list: any[], iterator: (item) => bool, context?): any;

    export function filter<T>(list: IMap<T>, iterator: (value: T) => bool, context?: any): T[];
    export function filter<T>(list: IMap<T>, iterator: (value: T, key: string) => bool, context?: any): T[];
    export function filter<T>(list: IMap<T>, iterator: (value: T, key: string, list: IMap<T>) => bool, context?: any): T[];

    export function select(list: any[], iterator: (item) => bool, context?): any[];

    export function where(list: any[], properties: any): any[];
    export function reject(list: any[], iterator: (item) => bool, context?): any[];
    
    export function all(list: any[], iterator: (item) => bool, context?): bool;
    export function every(list: any[], iterator: (item) => bool, context?): bool;

    export function any(list: any[], iterator: (item) => bool, context?): bool;
    export function some(list: any[], iterator: (item) => bool, context?): bool;

    export function contains(list: any[], value: any): bool;
    export function include(list: any[], value: any): bool;

    export function invoke(list: any[], methodName: string, ...arguments: any[]): bool;
    export function invoke(list: any[], method: Function, ...arguments: any[]): bool;

    export function pluck(list: any[], propertyName: string): any[];
    export function max(list: any[], iterator: (item) => any, context?): any;
    export function min(list: any[], iterator: (item) => any, context?): any;
    
    export function sortBy(list: any[], iterator: (item) => any, context?): any[];
    export function groupBy(list: any[], iterator: (item) => any): any;
    export function countBy(list: any[], iterator: (item) => string): any;

    export function shuffle(list: any[]): any[];

    export function toArray(list: any): any[];
    export function size(list: any): number;

}

// Array Functions
declare module "underscore" {
    export function first(array: any[]): any;
    export function first(array: any[], n: number): any[];
    export function head(array: any[]): any;
    export function head(array: any[], n: number): any[];
    export function take(array: any[]): any;
    export function take(array: any[], n: number): any[];

    export function initial(array: any[], n?: number): any[];

    export function last(array: any[]): any;
    export function last(array: any[], n?: number): any[];

    export function rest(array: any[], index?: number): any[];

    export function compact(array: any[]): any[];

    export function flatten(array: any[], shallow?: bool): any[];

    export function without(array: any[], ...values: any[]): any[];
    export function without(array: any[], values: any[]): any[];

    export function union(...arrays: any[][]): any[];
    export function intersection(...arrays: any[][]): any[];
    export function difference(array: any[], ...others: any[][]): any[];
    export function uniq<T>(array: T[], isSorted?: bool, iterator?: (item: T) => bool): T[];
    export function zip(...arrays: any[][]): any[][];
    
    export function object(list: any[][]): any;
    export function object(list: any[], values: any[]): any;

    export function indexOf(list: any[], value: any, isSorted?: bool): number;
    export function lastIndexOf(list: any[], value: any, isSorted?: bool): number;
    export function sortedIndex(list: any[], value: any, iterator?: (item) => any): number;
    
    export function range(count: number): number[];
    export function range(start: number, stop: number, step?: number): number[];
}

// Function Functions
declare module "underscore" {
    export function bind(_function: Function, object: any, ...arguments: any[]): () => any;
    export function bindAll(object: any, ...methodNames: any[]): void;
    export function memoize(_function: Function, hashFunction?: (value: any) => any): any;
    export function delay(_function, _wait: number, ...arguments: any[]): void;
    export function defer(_function, ...arguments: any[]): void;
    export function throttle(_function, wait: number): Function;
    export function debounce(_function, wait: number, immediate?): Function;
    export function once(_function: () => any): () => any;
    export function after(count, _function);
    export function wrap(_function: Function, wrapper: Function): Function;
    export function compose(functions: Function[]): Function;
}

// Object Functions
declare module "underscore" {
    export function keys(object: any): any[];
    export function values(object: any): any[];
    export function pairs(object: any): any[];
    export function invert(object: any): any;

    export function functions(object: any): string[];
    export function methods(object: any): string[];

    export function extend(destination: any, ...sources: any[]): any;
    export function pick(object: any, ...keys: string[]): any;
    export function omit(object: any, ...keys: string[]): any;

    export function defaults(object: any, ...defaults: any[]): any;
    export function clone(object: any): any;

    export function tap(object: any, interceptor: (object: any) => void ): any;
    export function has(object: any, key: string): bool;
    export function isEqual(object: any, key: string): bool;
    export function isEmpty(object: any): bool;
    export function isElement(object: any): bool;
    export function isArray(object: any): bool;
    export function isObject(object: any): bool;
    export function isArguments(object: any): bool;
    export function isFunction(object: any): bool;
    export function isString(object: any): boolean;
    export function isNumber(object: any): bool;
    export function isFinite(object: any): bool;
    export function isBoolean(object: any): bool;
    export function isDate(object: any): bool;
    export function isRegExp(object: any): bool;
    export function isNaN(object: any): bool;
    export function isNull(object: any): bool;
    export function isUndefined(object: any): bool;
}

// Utility Functions
declare module "underscore" {
    export function noConflict(): any;
    export function identity(value: any): any;
    export function times(n: number, iterator: (value: any) => void , context?);
    export function random(min: number, max: number): number;
    export function mixin(object: any): void;
    export function uniqueId(prefix?: string): string;
    export function escape(string: string): string;
    export function result(object: any, property: any): any;
    export function template(templateString: string, data?: any, settings?: any): string;
}

// Chaining Functions
declare module "underscore" {
    interface Projector<K, T, L, R> {
        (value: T): R;
        (value: T, key: K): R;
        (value: T, key: K, map: L): R;
    }

    interface Iterator<K, T, L> extends Projector<K, T, L, void > {
        (value: T);
        (value: T, key: K);
        (value: T, key: K, map: L);
    }

    interface MapProjector<T, R> extends Projector<string, T, Map<T>, R> {
        (value: T): R;
        (value: T, key: string): R;
        (value: T, key: string, map: Map<T>): R;
    }

    interface ArrayProjector<T, R> extends Projector<number, T, Array<T>, R> {
        (value: T): R;
        (value: T, key: number): R;
        (value: T, key: number, map: Array<T>): R;
    }

    interface MapIterator<T> extends Iterator<string, T, Map<T>> {
        (value: T);
        (value: T, key: string);
        (value: T, key: string, map: Map<T>);
    }

    interface ArrayIterator<T> extends Iterator<number, T, Array<T>> {
        (value: T);
        (value: T, key: number);
        (value: T, key: number, map: Array<T>);
    }

    export interface Wrapped<T> {
        value(): T;
    }

    export interface Chain<K, T, L> {
        // Collection
        each(iterator: Iterator<K, T, L>, context?: any): Chain<K, T, L>;
        forEach(iterator: Iterator<K, T, L>, context?: any): Chain<K, T, L>;

        map<R>(iterator: Projector<K, T, L, R>, context?: any): ArrayChain<R>;
        collect<R>(iterator: Projector<K, T, L, R>, context?: any): ArrayChain<R>;

        reduce<R>(iterator: Projector<K, T, L, R>, memo: R, context?: any): Wrapped<R>;
        inject<R>(iterator: Projector<K, T, L, R>, memo: R, context?: any): Wrapped<R>;
        foldl<R>(iterator: Projector<K, T, L, R>, memo: R, context?: any): Wrapped<R>;

        reduceRight<R>(iterator: Projector<K, T, L, R>, memo: R, context?: any): Wrapped<R>;
        foldr<R>(iterator: Projector<K, T, L, R>, memo: R, context?: any): Wrapped<R>;

        find(iterator: Projector<K, T, L, boolean>, context?: any): Wrapped<T>;
        detect(iterator: Projector<K, T, L, boolean>, context?: any): Wrapped<T>;

        filter(iterator: Projector<K, T, L, boolean>, context?: any): ArrayChain<T>;
        select(iterator: Projector<K, T, L, boolean>, context?: any): ArrayChain<T>;

        where(properties: any): ArrayChain<T>;

        findWhere(properties: any): Wrapped<T>;

        reject(iterator: Projector<K, T, L, boolean>, context?: any): ArrayChain<T>;

        all(iterator: Projector<K, T, L, boolean>, context?): Wrapped<boolean>;
        every(iterator: Projector<K, T, L, boolean>, context?): Wrapped<boolean>;

        any(iterator: Projector<K, T, L, boolean>, context?): Wrapped<boolean>;
        some(iterator: Projector<K, T, L, boolean>, context?): Wrapped<boolean>;

        contains(value: T): Wrapped<boolean>;
        include(value: T): Wrapped<boolean>;

        invoke(methodName: string, ...arguments: any[]): Chain<K, T, L>;
        invoke(method: Function, ...arguments: any[]): Chain<K, T, L>;

        pluck<R>(propertyName: string): ArrayChain<R>;
        max(iterator: Projector<K, T, L, any>, context?): Wrapped<T>;
        min(iterator: Projector<K, T, L, any>, context?): Wrapped<T>;

        sortBy(iterator: Projector<K, T, L, any>, context?): ArrayChain<T>;
        groupBy<R>(iterator: Projector<K, T, L, R>, context?): Chain<string, T[], Map<T[]>>;
        countBy<R>(iterator: Projector<K, T, L, R>, context?): Chain<string, number, Map<number>>;

        shuffle(): Chain<K, T, L>;

        toArray(): ArrayChain<T>;
        size(): Wrapped<number>;
    }

    interface ArrayChain<T> extends ArrayChain<T> {
        // Array
        first(): Wrapped<T>;
        first(n: number): ArrayChain<T>;
        head(): Wrapped<T>;
        head(n: number): ArrayChain<T>;
        take(): Wrapped<T>;
        take(n: number): ArrayChain<T>;

        initial(): Wrapped<T>;
        initial(n: number): ArrayChain<T>;

        last(): Wrapped<T>;
        last(n: number): ArrayChain<T>;

        rest(): Wrapped<T>;
        rest(index: number): ArrayChain<T>;

        compact(): ArrayChain<T>;

        flatten(shallow?: bool): ArrayChain<T>;

        without(...values: T[]): ArrayChain<T>;
        without(values: T[]): ArrayChain<T>;

        union(...arrays: T[][]): ArrayChain<T>;
        intersection(...arrays: T[][]): ArrayChain<T>;
        difference(...others: T[][]): ArrayChain<T>;

        uniq(isSorted?: bool, iterator?: Projector<number, T, T[], any>): ArrayChain<T>;
        unique(isSorted?: bool, iterator?: Projector<number, T, T[], any>): ArrayChain<T>;

        zip(...arrays: any[][]): ArrayChain<any>;

        object(pairs: any[][]): Wrapped<Object>;
        object(keys: any[], values: any[]): Wrapped<Object>;

        indexOf(value: T, isSorted?: bool): Wrapped<number>;
        lastIndexOf(value: T, isSorted?: bool): Wrapped<number>;
        sortedIndex(value: T, iterator?: Projector<number, T, T[], any>): Wrapped<number>;

        range(stop: number): ArrayChain<number>;
        range(start: number, stop: number): ArrayChain<number>;
        range(start: number, stop: number, step: number): ArrayChain<number>;
    }

    interface FunctionChain<F> {
        // Functions
        bind(object: any, ...arguments: any[]): F;
        bindAll(...methodNames: any[]): Chain;
        memoize(hashFunction: (value: any) => any): Chain;
        delay(_wait: number, ...arguments: any[]): Chain;
        defer(...arguments: any[]): Chain;
        throttle(wait: number): Chain;
        debounce(wait: number, immediate?): Chain;
        once(): Chain;
        after(_function): Chain;
        wrap(wrapper: Function): Chain;
        compose(): Chain;

        // Object
        keys(): Chain;
        values(): Chain;
        pairs(): Chain;
        invert(): Chain;

        functions(): Chain;
        methods(): Chain;

        extend(...sources: any[]): Chain;
        pick(...keys: string[]): Chain;
        omit(...keys: string[]): Chain;

        defaults(...defaults: any[]): Chain;
        clone(): Chain;

        tap(interceptor: (object: any) => void ): Chain;
        has(key: string): Chain;
        isEqual(key: string): Chain;
        isEmpty(): Chain;
        isElement(): Chain;
        isArray(): Chain;
        isObject(): Chain;
        isArguments(): Chain;
        isFunction(): Chain;
        isString(): Chain;
        isNumber(): Chain;
        isFinite(): Chain;
        isBoolean(): Chain;
        isDate(): Chain;
        isRegExp(): Chain;
        isNaN(): Chain;
        isNull(): Chain;
        isUndefined(): Chain;

        // Chaining
        value(): any;
    }

    export function chain<T>(obj: Map<T>): Chain<string, T, Map<T>>;
    export function chain<T>(obj: Array<T>): ArrayChain<T>;
}