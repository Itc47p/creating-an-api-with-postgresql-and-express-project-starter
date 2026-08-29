import { OrderStore, OrderWithProducts } from '../../src/models/Order';
import { UserStore, User } from '../../src/models/User';
import { ProductStore, Product } from '../../src/models/Product';

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Model', () => {
    it('should have a current method', () => {
        expect(store.current).toBeDefined();
    });

    it('should have a completed method', () => {
        expect(store.completed).toBeDefined();
    });

    it('should have an addProduct method', () => {
        expect(store.addProduct).toBeDefined();
    });

    it('should have a complete method', () => {
        expect(store.complete).toBeDefined();
    });

    describe('CRUD operations', () => {
        let user: User;
        let product: Product;

        beforeAll(async () => {
            user = await userStore.create({
                username: 'orderuser1',
                firstName: 'Order',
                lastName: 'Tester',
                password: 'password123',
            });
            product = await productStore.create({ name: 'Order Widget', price: 500, category: 'gadgets' });
        });

        it('current should be null when the user has no active order', async () => {
            const result = await store.current(user.id as number);
            expect(result).toBeNull();
        });

        it('addProduct should auto-create an active order and flag that it was created', async () => {
            const { order, orderWasCreated } = await store.addProduct(user.id as number, product.id as number, 2);
            expect(orderWasCreated).toBeTrue();
            expect(order.status).toEqual('active');
            expect(order.products.length).toEqual(1);
            expect(order.products[0].quantity).toEqual(2);
        });

        it('addProduct should reuse the existing active order on a second call', async () => {
            const { order, orderWasCreated } = await store.addProduct(user.id as number, product.id as number, 1);
            expect(orderWasCreated).toBeFalse();
            expect(order.products.length).toEqual(2);
        });

        it('current should return the active order with its products', async () => {
            const result = await store.current(user.id as number) as OrderWithProducts;
            expect(result.user_id).toEqual(user.id as number);
            expect(result.products.length).toEqual(2);
        });

        it('complete should reject an order with no products', async () => {
            await expectAsync(store.complete(999999)).toBeRejected();
        });

        it('complete should mark the order as complete', async () => {
            const current = await store.current(user.id as number) as OrderWithProducts;
            const completed = await store.complete(current.id as number);
            expect(completed.status).toEqual('complete');
        });

        it('completed should return the completed order for the user', async () => {
            const result = await store.completed(user.id as number);
            expect(result.some((o) => o.user_id === user.id && o.status === 'complete')).toBeTrue();
        });
    });
});
