export enum DoxType {
    Dox = 'Dox',
    NonDox = 'Non Dox',
    NA = 'NA',
}

export function getDoxType(dox: number): string {
    if (dox === 1) {
        return DoxType.Dox.toString();
    }
    if (dox === 2) {
        return DoxType.NonDox.toString();
    }
    if (dox === 0) {
        return DoxType.NA.toString();
    }
    return 'NA';
}
