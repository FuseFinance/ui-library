export function idNew ({
    array
} : {array: (number)[]}) {

    const maxId = array.reduce((max, item) => item > max ? item : max, 0);
    
    const newId = maxId + 1;

    return newId;

}

export const getIdWithString = ({stringWithId}) => {
    return parseInt(stringWithId.match(/data-id-(\d*)/)[1]);    
}

export const setIdWithString = ({oldString , newId}) => {

    if(!/data-id-(\d*)/.test(oldString)){
        oldString = oldString + " data-id-" + newId
    }else{
        oldString = updateIdWithString({oldString, newId})
    }

    return oldString
}

export const updateIdWithString = ({oldString , newId}) => {
    return oldString.replace(/(.*?)data-id-\d*(.*?)/, `$1data-id-${newId}$2`);
}