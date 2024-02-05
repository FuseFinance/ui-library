export function newIdFromKey ({array} : {array: (Record<string, any>)[]}) {

    const maxId = array.reduce((max, item) => item.key > max ? item.key : max, 0);
    
    const newId = maxId + 1;

    return newId;

}