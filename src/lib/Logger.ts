import * as moment from 'moment';

const colors = {
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
};

class Logger {
    constructor() {}

    static info(message: any) {
        process.stdout.write(
            colors.cyan + `[${moment().format('YYYY-MM-DD HH:mm:ss')}] INFO >> `
        );
        console.log(message);
        process.stdout.write(colors.reset);
    }

    static warn(message: any) {
        process.stdout.write(
            colors.yellow +
                `[${moment().format('YYYY-MM-DD HH:mm:ss')}] WARN >> `
        );
        console.log(message);
        process.stdout.write(colors.reset);
    }

    static error(message: any) {
        process.stdout.write(
            colors.red + `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ERROR >> `
        );
        console.log(message);
        process.stdout.write(colors.reset);
    }

    static log(message: any) {
        process.stdout.write(
            colors.reset + `[${moment().format('YYYY-MM-DD HH:mm:ss')}] LOG >> `
        );
        console.log(message);
        process.stdout.write(colors.reset);
    }
}

export default Logger;
