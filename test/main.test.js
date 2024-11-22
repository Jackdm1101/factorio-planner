import { ProductionChain } from '../src/main';
import { getTypesArrayExcept } from './randomTestData';

describe('ProductionChain', () => {
    const chain = new ProductionChain;

    describe('addProduct', () => {
        it('should not add a product that does not exist', () => {
            expect(() => { chain.addProduct('invalid-product', 5) })
                .toThrow(`Product invalid-product not found`);
        });

        it.each(getTypesArrayExcept('string'))
            (`should throw an error if a productStr is: %p`, (productStrInput) => {
                expect(() => { chain.addProduct(productStrInput, 5) })
                    .toThrow('Unexpected type');
            });
    });
});
