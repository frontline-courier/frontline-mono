export function stringRange(a: string, b: string, series?: number) {
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

    // special case
    if (series === 6) {
        start = parseInt(start.toString().slice(0, start.toString().length - 1), 10);
        end = parseInt(end.toString().slice(0, end.toString().length - 1), 10);
    }

    if (start > end) {
        throw new Error('Ending value should be lessesr that starting value');
    }

    while (start !== end) {
        start++;

        // special case
        let generated = '';

        if (series === 6) {
            generated = startPrefix ? startPrefix[0] + (start + '').padStart(startNum[0].length - 1, '0') : start + '';
            generated += (parseInt((arr as any).at(-1).at(-1), 10) + 1) % 7
        } else {
            generated = startPrefix ? startPrefix[0] + (start + '').padStart(startNum[0].length, '0') : start + '';
        }

        arr.push(generated);

        if (arr.length > 100) throw new Error('Max Range is 100.');
    }

    if (a !== arr[0] || b !== arr[arr.length - 1]) {
        throw new Error('Series not matching with generated.');
    }

    return arr;
}
