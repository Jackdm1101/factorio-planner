import { validateInput } from '../src/main';

test('validate accepts properly formed data', () => {
    expect(validateInput({
        outputs: [
            { item: 'iron-gear-wheel', perSec: 1 }
        ],
        settings: {
            crafterLv: 3, furnaceLv: 3
        }
    })).toBe(true);
});
