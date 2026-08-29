import { OrderProductStore } from '../../src/models/OrderProduct';
import { OrderStore } from '../../src/models/Order';
import { UserStore, User } from '../../src/models/User';
import { ProductStore, Product } from '../../src/models/Product';

const store = new OrderProductStore();
const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('OrderProduct Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    describe('CRUD operations', () => {
        let user: User;
        let product: Product;
        let orderId: number;

        beforeAll(async () => {
            user = await userStore.create({
                username: 'orderproductuser1',
                firstName: 'OrderProduct',
                lastName: 'Tester',
                password: 'password123',
            });
            product = await productStore.create({ name: 'OrderProduct Widget', price: 250, category: 'gadgets' });
            const { order } = await orderStore.addProduct(user.id as number, product.id as number, 1);
            orderId = order.id as number;
        });

        it('create should add a product to the order', async () => {
            const created = await store.create({ order_id: orderId, product_id: product.id as number, quantity: 3 });
            expect(created.order_id).toEqual(orderId);
            expect(created.quantity).toEqual(3);
        });

        it('index should return all products for the order', async () => {
            const result = await store.index(orderId);
            // one from beforeAll's addProduct call, one from the create test above
            expect(result.length).toEqual(2);
        });
    });
});
