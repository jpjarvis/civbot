export function getToken(): string {
    let token = process.env['BOT_TOKEN'];
    if (token) {
        return token;
    }

    const auth = require('../auth/auth.json');
    return auth.token;
}