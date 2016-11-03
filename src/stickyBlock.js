import resizeSensor from './ResizeSensor.js';


function guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `id-${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}


function setID(node) {
    if (!node.id) node.id = guid();
}


function addEvent(node, name, callback) {
    if (node.attachEvent) {
        node.attachEvent(`on${name}`, callback);
    } else {
        node.addEventListener(name, callback);
    }
}


function getRelativeNode(node, classname) {
    if (!classname) return null;
    const nodeList = document.querySelectorAll(`.${classname}`);
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].querySelector(`#${node.id}`)) return nodeList[i];
    }
    return null;
}


function getMaxTop(node, cloneNode, relativeNode) {
    const box = node.getBoundingClientRect();
    const cloneBox = cloneNode.getBoundingClientRect();
    const relativeBox = relativeNode.getBoundingClientRect();
    if (relativeBox.bottom - cloneBox.top > box.bottom - box.top) {
        return relativeBox.bottom - cloneBox.top - box.bottom + box.top;
    }
    return 0;
}


function setHeightStyle(cloneNode, height) {
    cloneNode.style.cssText = `height: ${height}px;`;
}


function setFixedTopStyle(node, top, left, width) {
    node.style.cssText = `position: fixed; top: ${top}px; left: ${left}px; width: ${width}px; box-sizing: border-box;`;
}


function setFixedBottomStyle(node, bottom, left, width) {
    node.style.cssText = `position: fixed; bottom: ${bottom}px; left: ${left}px; width: ${width}px; box-sizing: border-box;`;
}


function setRelativeTopStyle(node, top) {
    node.style.cssText = `position: relative; top: ${top}px;`;
}


function stickyBlock(node, opts) {
    setID(node);
    opts = opts || {};
    const customTop = opts.top || 0;
    const customBottom = opts.bottom || 0;
    const customIndent = opts.indent || 0;
    const className = node.className || '';
    const classNameActive = opts.classActive ? `${className} ${opts.classActive}`.trim() : className;
    const relativeNode = getRelativeNode(node, opts.relative);
    const rootNode = document.documentElement;
    const bodyNode = document.body;
    const cloneNode = document.createElement('div');
    const list = relativeNode ? [node, cloneNode, rootNode, relativeNode] : [node, cloneNode, rootNode];
    let lastScrollTop = 0;

    setHeightStyle(cloneNode, 0);
    node.parentNode.insertBefore(cloneNode, node);

    const onScroll = () => {
        const maxTop = getMaxTop(node, cloneNode, relativeNode || rootNode);
        const nodeBox = node.getBoundingClientRect();
        const nodeHeight = nodeBox.bottom - nodeBox.top;
        const windowHeight = window.innerHeight || rootNode.clientHeight || bodyNode.clientHeight;
        const cloneBox = cloneNode.getBoundingClientRect();
        const absCloneTop = Math.abs(cloneBox.top);
        const absNodeTop = Math.abs(nodeBox.top);

        if (cloneBox.top >= customTop || !maxTop) {
            node.removeAttribute('style');
            node.className = className;
            setHeightStyle(cloneNode, 0);
        } else if (nodeHeight > windowHeight) {
            node.className = classNameActive;
            const currScrollTop = window.pageYOffset || rootNode.scrollTop || bodyNode.scrollTop;
            if (currScrollTop >= lastScrollTop) {
                // downscroll
                if (nodeBox.top <= customTop &&
                    absNodeTop >= nodeHeight - windowHeight + customBottom &&
                    absCloneTop < maxTop + nodeHeight - windowHeight + customBottom - customIndent
                ) {
                    setHeightStyle(cloneNode, nodeHeight);
                    setFixedBottomStyle(node, customBottom, cloneBox.left, cloneBox.right - cloneBox.left);
                } else if (absCloneTop >= maxTop + nodeHeight - windowHeight + customBottom - customIndent) {
                    setHeightStyle(cloneNode, 0);
                    setRelativeTopStyle(node, maxTop - customIndent);
                } else {
                    setHeightStyle(cloneNode, 0);
                    setRelativeTopStyle(node, Math.abs(cloneBox.top - nodeBox.top));
                }
            } else {
                // upscroll
                if (nodeBox.top < customTop) {
                    setHeightStyle(cloneNode, 0);
                    setRelativeTopStyle(node, Math.abs(cloneBox.top - nodeBox.top));
                } else if (absCloneTop < maxTop + nodeHeight - windowHeight - customTop) {
                    setHeightStyle(cloneNode, nodeHeight);
                    setFixedTopStyle(node, customTop, cloneBox.left, cloneBox.right - cloneBox.left);
                }
            }
            lastScrollTop = currScrollTop;
        } else {
            node.className = classNameActive;
            if (absCloneTop < maxTop - customTop - customIndent) {
                setHeightStyle(cloneNode, nodeHeight);
                setFixedTopStyle(node, customTop, cloneBox.left, cloneBox.right - cloneBox.left);
            } else {
                setHeightStyle(cloneNode, 0);
                setRelativeTopStyle(node, maxTop - customIndent);
            }
        }
    };

    addEvent(window, 'scroll', onScroll);
    addEvent(window, 'resize', onScroll);
    resizeSensor(list, onScroll);
}


module.exports = stickyBlock;
