// Gathered from http://visionmedia.github.io/commander.js/
declare module "commander" {
    interface Option {
        flags: string;
        required: boolean;
        optional: boolean;
        bool: boolean;
        short: string;
        long: string;
        description: string;
    }

    interface Command {
        commands: Command[];
        options: Option[];
        args: any[];
        name: string;

        command(name: string): Command;
        action(fn: (...args: any[]) => void ): Command;
        option(flags: string, description?: string, coercer?: (input: string) => any, defaultValue?: any): Command;
        parse(argv: string[]): Command;
        description(desc: string): Command;
        usage(usage?: string): Command;
        prompt(str: string, fn: (val: string) => void ): Command;
        password(str: string, fn: (val: string) => void ): Command;
        password(str: string, mask: string, fn: (val: string) => void ): Command;
        confirm(str: string, fn: (val: boolean) => void ): Command;
        choose<T>(list: T[], fn: (index: number, item: T) => void ): Command;
    }
}