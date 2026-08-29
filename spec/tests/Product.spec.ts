import { ProductStore, Product } from '../../src/models/Product';

const store = new ProductStore();

describe('Product Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    it('should have a byCategory method', () => {
        expect(store.byCategory).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });

    describe('CRUD operations', () => {
        let created: Product;

        beforeAll(async () => {
            created = await store.create({ name: 'Test Widget', price: 999, category: 'gadgets' });
        });

        it('create should return the new product with price stored as integer cents', async () => {
            expect(created.name).toEqual('Test Widget');
            expect(created.price).toEqual(999);
        });

        it('index should return a list of products including the created one', async () => {
            const result = await store.index();
            expect(result.some((p) => p.id === created.id)).toBeTrue();
        });

        it('show should return the created product', async () => {
            const result = await store.show(created.id as number);
            expect(result.name).toEqual('Test Widget');
        });

        it('byCategory should return products in that category', async () => {
            const result = await store.byCategory('gadgets');
            expect(result.some((p) => p.id === created.id)).toBeTrue();
        });

        it('delete should remove the product', async () => {
            const deleted = await store.delete(created.id as number);
            expect(deleted.id).toEqual(created.id);
            const result = await store.index();
            expect(result.some((p) => p.id === created.id)).toBeFalse();
        });
    });
});
