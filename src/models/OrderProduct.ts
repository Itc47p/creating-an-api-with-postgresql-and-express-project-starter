import Client from "../database";

export type OrderProduct = {
    id?: number;
    order_id: number;
    product_id: number;
    quantity: number;
}

export class OrderProductStore {
    async index(orderId: number): Promise<OrderProduct[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM order_products WHERE order_id=($1)';
            const result = await conn.query(sql, [orderId]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products for order ${orderId}. Error: ${err}`);
        }
    }

    async create(op: OrderProduct): Promise<OrderProduct> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [op.order_id, op.product_id, op.quantity]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not add product ${op.product_id} to order ${op.order_id}. Error: ${err}`);
        }
    }
}
