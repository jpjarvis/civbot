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
    let fullMessage = `[${new Date(Date.now()).toISOString()}] ${level}: ${message}`;
    
    level === "ERROR" ? console.log(message) : console.log(fullMessage);
}
