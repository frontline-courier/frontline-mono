import { PageTypes } from '../../enums/pageTypes'

export function getPageType(pathName: string) {
    if (pathName.toLowerCase().includes('delete')) {
        return PageTypes.DELETE
    } else if (pathName.toLowerCase().includes('edit')) {
        return PageTypes.EDIT
    } else if (pathName.toLowerCase().includes('view')) {
        return PageTypes.VIEW
    } else if (pathName.toLowerCase().includes('clone')) {
        return PageTypes.CLONE
    } else {
        return PageTypes.NEW;
    }
}
