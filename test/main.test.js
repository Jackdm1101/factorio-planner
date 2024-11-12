import { createProductionChain } from '../src/main';

test('Invalid input data should be rejected', () => {
    expect(() => { createProductionChain({
        outputs: [
            { item: 'iron-gear-wheel', perSec: 1 },
            { item: 1, wrongKey: 'wrong-type'}
        ],
        settings: {
            crafterLv: 3, furnaceLv: 'a'
        }
    })}).toThrow('Invalid input data');
});
