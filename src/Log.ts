export function logInfo(message: string) {
    logMessage("INFO", message);
}

export function logError(message: string) {
    logMessage("ERROR", message);
}

export function logException(error: Error) {
    logError(`${error.message} ${error.stack}`);
}

function logMessage(level: string, message: string) {
    console.error(`[${new Date(Date.now()).toISOString()}] ${level}: ${message}`);
}
