import { PageTypes } from '../../enums/pageTypes'

export function getPageType(pathName: string) {
    console.log({pathName});
    if (pathName.toLowerCase().includes('delete')) {
        return PageTypes.DELETE
    } else if (pathName.toLowerCase().includes('edit')) {
        return PageTypes.EDIT
    } else if (pathName.toLowerCase().includes('view')) {
        return PageTypes.VIEW
    } else {
        return PageTypes.NEW;
    }
}
