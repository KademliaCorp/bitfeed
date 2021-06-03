const db = require('../db');
module.exports = class User {

    static async getCredentialsByUsername(username) {
        const sql = db();
        username = (username || '').toLowerCase();
        const [creds] = await sql`
            SELECT 
                username,
                password
            FROM "user"
            WHERE username = ${username}
        `;
        return creds;
    }
}
