import { stringRange } from "../strings/getRange";

export function getAWBRange(awbs: string, series: string) {

    let seriesType;

    if (series === 'series_0-6') {
        seriesType = 6;
    }

    const result = [];
    // check if it contains comma 
    const commaSeparatedAWB = awbs.split(',');

    for (const awbs of commaSeparatedAWB) {

        if (awbs?.includes('-')) {
            const temp = awbs?.trim()?.split('-');
            result.push(...stringRange(temp[0]?.trim(), temp[1]?.trim(), seriesType));
        } else {
            result.push(awbs);
        }
    }

    return result;
}
