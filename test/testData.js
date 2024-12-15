// Takes type strings as specified:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
export function getTypesArrayExcept(typeStr) {
    return [
        ['number', 1],
        ['string', 'test'],
        ['function', () => { }],
        ['symbol', Symbol('test')],
        ['bigint', BigInt(Number.MAX_SAFE_INTEGER)],
        ['boolean', true],
        ['undefined', undefined],
        ['null', null], // object
        ['array', [ ]], // object
        ['object', { }] // object
    ].reduce((acc, type) => {
        if (type[0] !== typeStr) acc.push(type[1]);
        return acc;
    }, []);
}
