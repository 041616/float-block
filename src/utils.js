export const EXCLUDED_CSS_PROPERTIES_MAP = {
    'position': /([^-]position|^position)/,
    'top': /([^-]top|^top)/,
    'left': /([^-]left|^left)/,
    'bottom': /([^-]bottom|^bottom)/,
    'width': /([^-]width|^width)/,
    'box-sizing': /box-sizing/,
};


export function guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `id-${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}


export function addEvent(node, name, callback) {
    if (node.attachEvent) {
        node.attachEvent(`on${name}`, callback);
    } else {
        node.addEventListener(name, callback);
    }
}
