export function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export function getDefaultVariableAsInt(variable?: string) {
    return parseInt(variable || '0');
}