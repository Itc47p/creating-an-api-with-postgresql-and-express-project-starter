import { UserStore, User } from '../../src/models/User';

const store = new UserStore();

describe('User Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });

    describe('CRUD operations', () => {
        let created: User;

        beforeAll(async () => {
            created = await store.create({
                username: 'testuser1',
                firstName: 'Test',
                lastName: 'User',
                password: 'password123',
            });
        });

        it('create should return the new user without the password', async () => {
            expect(created.username).toEqual('testuser1');
            expect(created.firstName).toEqual('Test');
            expect((created as unknown as Record<string, unknown>).password).toBeUndefined();
        });

        it('index should return a list of users including the created one', async () => {
            const result = await store.index();
            expect(result.some((u) => u.id === created.id)).toBeTrue();
        });

        it('show should return the created user without the password', async () => {
            const result = await store.show(created.id as number);
            expect(result.username).toEqual('testuser1');
            expect((result as unknown as Record<string, unknown>).password).toBeUndefined();
        });
    });
});
