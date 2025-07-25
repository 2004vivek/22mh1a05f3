import axios from 'axios';

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

export const LogLevels = {
    INFO: 'info',
    ERROR: 'error',
    WARNING: 'warning',
    DEBUG: 'debug'
};

export const LogStacks = {
    BACKEND: 'backend',
    FRONTEND: 'frontend',
    DATABASE: 'database',
    NETWORK: 'network'
};

export const LogPackages = {
    HANDLER: 'handler',
    MIDDLEWARE: 'middleware',
    CONTROLLER: 'controller',
    SERVICE: 'service',
    ROUTER: 'router'
};

export async function Log(stack, level, packageName, message) {
    if (!Object.values(LogStacks).includes(stack.toLowerCase())) {
        throw new Error('Invalid stack value');
    }

    if (!Object.values(LogLevels).includes(level.toLowerCase())) {
        throw new Error('Invalid level value');
    }

    if (!Object.values(LogPackages).includes(packageName.toLowerCase())) {
        throw new Error('Invalid package value');
    }

    const logData = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: packageName.toLowerCase(),
        message: message
    };

    try {
        const response = await axios.post(LOG_API_URL, logData);
        return response.data;
    } catch (error) {
        console.error('Error sending log to test server:', error.message);
        throw error;
    }
}

export const createLoggerMiddleware = () => {
    return async (req, res, next) => {
        const startTime = Date.now();
        const originalEnd = res.end;
        const originalWrite = res.write;
        let responseBody = '';

        res.write = function (chunk) {
            responseBody += chunk;
            return originalWrite.apply(res, arguments);
        };

        res.end = function (chunk) {
            if (chunk) {
                responseBody += chunk;
            }

            const endTime = Date.now();
            const duration = endTime - startTime;

            const logMessage = {
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                duration: `${duration}ms`,
                requestBody: req.body,
                responseBody: responseBody,
                userAgent: req.get('user-agent'),
                ip: req.ip
            };

            const logLevel = res.statusCode >= 400 ? LogLevels.ERROR : LogLevels.INFO;
            
            Log(
                LogStacks.BACKEND,
                logLevel,
                LogPackages.MIDDLEWARE,
                JSON.stringify(logMessage)
            ).catch(console.error);

            originalEnd.apply(res, arguments);
        };

        next();
    };
}; 