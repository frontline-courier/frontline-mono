export function stringRange(a: string, b: string) {
    let arr = [a + ''];

    const startPrefix = a.match(/([\D])+/g);
    const endPrefix = b.match(/([\D])+/g);

    if ((startPrefix || endPrefix) && (Array.isArray(startPrefix) && startPrefix[0]) !== (Array.isArray(endPrefix) && endPrefix[0])) {
        throw new Error('Series number does not match');
    }

    const startNum = a.match(/([\d])+/g);
    const endNum = b.match(/([\d])+/g);

    if (!startNum || !endNum) {
        throw new Error('Range is not valid');
    }

    let start = parseInt(startNum[0], 10);
    let end = parseInt(endNum[0], 10);

    if (start > end) {
        throw new Error('Ending value should be lessesr that starting value');
    }

    while (start !== end) {
        start++;
        arr.push(startPrefix ? startPrefix[0] + (start + '').padStart(startNum[0].length, '0') : start + '');

        if (arr.length > 100) throw new Error('Max Range is 100');
    }

    return arr;
}
