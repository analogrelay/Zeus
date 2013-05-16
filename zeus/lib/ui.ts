/// <reference path="../ref/_references.d.ts" />
export interface ILogger {
    log(level: string, message: string, metadata?: any);
    info(message: string, metadata?: any);
    warn(message: string, metadata?: any);
    error(message: string, metadata?: any);
    verbose(message: string, metadata?: any);
    silly(message: string, metadata?: any);
}

export interface IConsoleInterface {
    prompt(str: string, fn: (val: string) => void );
    password(str: string, fn: (val: string) => void );
    password(str: string, mask: string, fn: (val: string) => void );
    confirm(str: string, fn: (val: boolean) => void );
    choose<T>(list: T[], fn: (index: number, item: T) => void );
}

export interface IUIService {
    cli: IConsoleInterface;
    log: ILogger;
}

export class UIService {
    constructor(public cli: IConsoleInterface, public log: ILogger) { }
}

export var empty: IUIService = {
    cli: {
        prompt: (str: string, fn: (val: string) => void ) => { },
        password: (str: string, mask: any, fn?: (val: string) => void ) => { },
        confirm: (str: string, fn: (val: boolean) => void ) => { },
        choose: (list: any[], fn: (index: number, item: any) => void ) => {}
    },
    log: {
        log: (level: string, message: string, metadata?: any) => { } ,
        info: (message: string, metadata?: any) => { } ,
        warn: (message: string, metadata?: any) => { } ,
        error: (message: string, metadata?: any) => { } ,
        verbose: (message: string, metadata?: any) => { } ,
        silly: (message: string, metadata?: any) => { }
    }
};