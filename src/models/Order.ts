import Client from "../database";
import { OrderProduct, OrderProductStore } from "./OrderProduct";

export type Order = {
    id?: number;
    user_id: number;
    status: string;
}

export type OrderWithProducts = Order & { products: OrderProduct[] };

const orderProductStore = new OrderProductStore();

export class OrderStore {
    private async withProducts(order: Order): Promise<OrderWithProducts> {
        const products = await orderProductStore.index(order.id as number);
        return { ...order, products };
    }

    async current(userId: number): Promise<OrderWithProducts | null> {
        try {
            const conn = await Client.connect();
            const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='active'";
            const result = await conn.query(sql, [userId]);
            conn.release();
            if (result.rows.length === 0) {
                return null;
            }
            return await this.withProducts(result.rows[0]);
        } catch (err) {
            throw new Error(`Could not get current order for user ${userId}. Error: ${err}`);
        }
    }

    async completed(userId: number): Promise<OrderWithProducts[]> {
        try {
            const conn = await Client.connect();
            const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='complete'";
            const result = await conn.query(sql, [userId]);
            conn.release();
            return await Promise.all(result.rows.map((row) => this.withProducts(row)));
        } catch (err) {
            throw new Error(`Could not get completed orders for user ${userId}. Error: ${err}`);
        }
    }

    async addProduct(userId: number, productId: number, quantity: number): Promise<{ order: OrderWithProducts; orderWasCreated: boolean }> {
        try {
            const conn = await Client.connect();
            const findSql = "SELECT * FROM orders WHERE user_id=($1) AND status='active'";
            const findResult = await conn.query(findSql, [userId]);

            let order = findResult.rows[0];
            let orderWasCreated = false;
            if (!order) {
                const createSql = "INSERT INTO orders (user_id, status) VALUES($1, 'active') RETURNING *";
                const createResult = await conn.query(createSql, [userId]);
                order = createResult.rows[0];
                orderWasCreated = true;
            }
            conn.release();

            await orderProductStore.create({ order_id: order.id, product_id: productId, quantity });

            return { order: await this.withProducts(order), orderWasCreated };
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order for user ${userId}. Error: ${err}`);
        }
    }

    async complete(orderId: number): Promise<Order> {
        try {
            const products = await orderProductStore.index(orderId);
            if (products.length === 0) {
                throw new Error('Cannot complete an order with no products.');
            }
            const conn = await Client.connect();
            const sql = "UPDATE orders SET status='complete' WHERE id=($1) RETURNING *";
            const result = await conn.query(sql, [orderId]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not complete order ${orderId}. Error: ${err}`);
        }
    }
}
