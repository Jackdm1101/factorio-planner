// Takes type strings as specified:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof

export function getTypesArrayExcept(typeStr) {
    return [
        1,
        'test',
        () => {},
        Symbol('test'),
        BigInt(Number.MAX_SAFE_INTEGER),
        true,
        undefined,
        null,
        [],
        {},
    ].filter(type => 
        typeof type !== typeStr);
}
