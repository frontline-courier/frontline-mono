import { stringRange } from "../strings/getRange";

export function getAWBRange(awbs: string) {

    const result = [];
    // check if it contains comma 
    const commaSeparatedAWB = awbs.split(',');

    for (const awbs of commaSeparatedAWB) {

        if (awbs?.includes('-')) {
            const temp = awbs?.trim()?.split('-');
            result.push(...stringRange(temp[0]?.trim(), temp[1]?.trim()));
        } else {
            result.push(awbs);
        }
    }

    return result;
}
