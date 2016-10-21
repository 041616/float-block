import ResizeSensor from './ResizeSensor.js';


function addEvent(el, nm, cb) {
    if (el.attachEvent) {
        el.attachEvent('on' + nm, cb);
    } else {
        el.addEventListener(nm, cb);
    }
};


function getRelativeNode(node, classname) {
    if (!classname) return null;
    const nodeList = document.querySelectorAll('.' + classname);
    for (var i = 0; i < nodeList.length; i++) {
        if (nodeList[i].querySelector('#' + node.id)) return nodeList[i];
    }
    return null;
};


function getMaxTop(node, cloneNode, relativeNode, rootNode) {
    const box = node.getBoundingClientRect();
    const cloneBox = cloneNode.getBoundingClientRect();
    const relativeBox = (relativeNode || rootNode).getBoundingClientRect();
    if (relativeBox.bottom - cloneBox.top > box.bottom - box.top) {
        return relativeBox.bottom - cloneBox.top - box.bottom + box.top;
    }
    return 0;
};


function setHeightStyle(cloneNode, height) {
    cloneNode.style.cssText = `height: ${height}px;`;
};


function setFixedStyle(node, top, left, width) {
    node.style.cssText = `position: fixed; top: -${top}px; left: ${left}px; width: ${width}px;`;
};


function setRelativeStyle(node, top) {
    node.style.cssText = `position: relative; top: ${top}px;`;
};


export default function stickyBlock(node, { relative, clsActive }) {
    const rootNode = document.documentElement;
    const bodyNode = document.body;
    const cloneNode = document.createElement('div');
    const className = node.className || '';
    const classActive = clsActive ? `className ${clsActive}`.trim() : className;
    const relativeNode = getRelativeNode(node, relative);
    const list = [node, cloneNode, rootNode];
    if (relativeNode) list.push(relativeNode);
    let lastScrollTop = 0;

    setHeightStyle(cloneNode, 0);
    node.parentNode.insertBefore(cloneNode, node);

    const onScroll = () => {
        const currScrollTop = window.pageYOffset || rootNode.scrollTop || bodyNode.scrollTop;
        const maxTop = getMaxTop(node, cloneNode, relativeNode, rootNode);
        const nodeBox = node.getBoundingClientRect();
        const nodeHeight = nodeBox.bottom - nodeBox.top;
        const windowHeight = window.innerHeight || rootNode.clientHeight || bodyNode.clientHeight;
        let cloneBox = cloneNode.getBoundingClientRect();
        const absCloneTop = Math.abs(cloneBox.top);
        const absNodeTop = Math.abs(nodeBox.top);

        if (cloneBox.top >= 0 || !maxTop) {
            node.removeAttribute('style');
            node.className = className;
            setHeightStyle(cloneNode, 0);
        } else if (nodeHeight > windowHeight) {
            node.className = classActive;
            if (currScrollTop >= lastScrollTop) {
                // downscroll
                if (nodeBox.top <= 0 &&
                    absNodeTop >= nodeHeight - windowHeight &&
                    absCloneTop < maxTop + nodeHeight - windowHeight
                ) {
                    setHeightStyle(cloneNode, nodeHeight);
                    setFixedStyle(node, nodeHeight - windowHeight, cloneBox.left, cloneBox.right - cloneBox.left);
                } else if (absCloneTop >= maxTop + nodeHeight - windowHeight) {
                    setHeightStyle(cloneNode, 0);
                    setRelativeStyle(node, maxTop);
                } else {
                    setHeightStyle(cloneNode, 0);
                    setRelativeStyle(node, absCloneTop - absNodeTop);
                }
            } else {
                // upscroll
                if (nodeBox.top < 0) {
                    setHeightStyle(cloneNode, 0);
                    setRelativeStyle(node, absCloneTop - absNodeTop);
                } else if (absCloneTop < maxTop + nodeHeight - windowHeight) {
                    setHeightStyle(cloneNode, nodeHeight);
                    setFixedStyle(node, 0, cloneBox.left, cloneBox.right - cloneBox.left);
                }
            }
        } else {
            node.className = classActive;
            if (absCloneTop < maxTop) {
                setHeightStyle(cloneNode, nodeHeight);
                setFixedStyle(node, 0, cloneBox.left, cloneBox.right - cloneBox.left)
            } else {
                setRelativeStyle(node, maxTop);
                setHeightStyle(cloneNode, 0);
            }
        }
        lastScrollTop = currScrollTop;
    };

    addEvent(window, 'scroll', onScroll);
    ResizeSensor(list, onScroll);
}
