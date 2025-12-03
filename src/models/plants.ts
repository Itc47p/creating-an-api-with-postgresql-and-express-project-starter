import Client from "../database";

export type PlantName = {
    id: number;
    name: string;
};

export type Plant {
    id: number;
    name: PlantName;
    species: string;
    datePlanted: Date;
}

export class PlantStore {
    async index(): Promise<Plant[]> {
        try {
            const connection = await Client.connect();
            const sql = 'SELECT * FROM plants';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Unable to fetch plants: ${err}`);
        }
    }
}