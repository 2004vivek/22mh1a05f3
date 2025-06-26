import { Request, Response, NextFunction } from 'express';

export const enum LogLevels {
    INFO = 'info',
    ERROR = 'error',
    WARNING = 'warning',
    DEBUG = 'debug'
}

export const enum LogStacks {
    BACKEND = 'backend',
    FRONTEND = 'frontend',
    DATABASE = 'database',
    NETWORK = 'network'
}

export const enum LogPackages {
    HANDLER = 'handler',
    MIDDLEWARE = 'middleware',
    CONTROLLER = 'controller',
    SERVICE = 'service',
    ROUTER = 'router'
}

export function Log(
    stack: LogStacks | string,
    level: LogLevels | string,
    packageName: LogPackages | string,
    message: string
): Promise<any>;

export function createLoggerMiddleware(): (req: Request, res: Response, next: NextFunction) => void; 