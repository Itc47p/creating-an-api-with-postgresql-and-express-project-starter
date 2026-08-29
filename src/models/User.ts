import bcrypt from 'bcryptjs';
import Client from "../database";

export type User = {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

// strips the password hash before returning a user to callers
const sanitize = (row: User): User => {
    const { password: _password, ...rest } = row;
    return rest as User;
};

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows.map(sanitize);
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return sanitize(result.rows[0]);
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO users (username, "firstName", "lastName", password) VALUES($1, $2, $3, $4) RETURNING *';
            const hash = bcrypt.hashSync(
                u.password + BCRYPT_PASSWORD,
                parseInt(SALT_ROUNDS as string, 10)
            );
            const result = await conn
                .query(sql, [u.username, u.firstName, u.lastName, hash]);
            conn.release();
            return sanitize(result.rows[0]);
        } catch (err) {
            throw new Error(`Could not create user ${u.username}. Error: ${err}`);
        }
    }
}
