export const jsonStringifyDeep = (json) => {
    return JSON.stringify(json, (key, value) => {
        if (typeof value === 'function') {
        // Convertir la función a texto
        return value.toString();
        }
        return value;
    }, 2);
};