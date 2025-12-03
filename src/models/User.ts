import Client from "../database";

export type User = {
    id: string;
    firstName: string;
    lastName: string;
    passowrd: string;
}

export class UserStore {
    public async getUser() {
    } async index(): Promise<User[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }

    public async createUser(u: User): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO users (firstName, lastName, password) VALUES($1, $2, $3) RETURNING *';
            const result = await conn
                .query(sql, [u.firstName, u.lastName, u.passowrd]);
            const user = result.rows[0];
            conn.release();
            return user;
        } catch (err) {
            throw new Error(`Could not create user ${u.firstName}. Error: ${err}`);
        }
    }

}