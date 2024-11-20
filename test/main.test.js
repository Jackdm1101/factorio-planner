import { ProductionChain } from '../src/main';

describe('ProductionChain', () => {
    const chain = new ProductionChain;

    describe('addProduct', () => {
        it('should not add a product that does not exist', () => {
            expect(() => chain.addProduct('invalid-product', 5)
                .toThrow('Procuct not found'));
        });
    });
});
