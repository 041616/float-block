import resizeSensor from './ResizeSensor';
import getCurrentStyle from './GetCurrentStyle';
import { addEvent, guid, EXCLUDED_CSS_PROPERTIES_MAP } from './utils';


function setID(node) {
    if (!node.id) node.id = guid();
}


function proceedCSSRule(rule) {
    for (var property in EXCLUDED_CSS_PROPERTIES_MAP) {
        if (!EXCLUDED_CSS_PROPERTIES_MAP.hasOwnProperty(property)) continue;
        if (EXCLUDED_CSS_PROPERTIES_MAP[property].test(rule)) return false;
    }
    return true;
}


function parsedCSSText(cssText) {
    if (!cssText) return '';
    const ruleList = cssText.split(';');
    const parsedRuleList = ruleList.filter(proceedCSSRule);
    return `${parsedRuleList.join(';')};`;
}


function getRelativeNode(node, classname) {
    if (!classname) return null;
    const nodeList = document.querySelectorAll(`.${classname}`);
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].querySelector(`#${node.id}`)) return nodeList[i];
    }
    return null;
}


function getMaxTop(node, cloneNode, relativeNode, paddingBottom, borderBottom) {
    const box = node.getBoundingClientRect();
    const cloneBox = cloneNode.getBoundingClientRect();
    const relativeBox = relativeNode.getBoundingClientRect();
    if (relativeBox.bottom - cloneBox.top > box.bottom - box.top) return (
        relativeBox.bottom - cloneBox.top - box.bottom + box.top - borderBottom - paddingBottom
    );
    return 0;
}


function setHeightStyle(cloneNode, height) {
    cloneNode.style.cssText = `height: ${height}px;`;
}


function setFixedTopStyle(node, top, left, width, cssText) {
    node.style.cssText = `${cssText} position: fixed; top: ${top}px; left: ${left}px; width: ${width}px; box-sizing: border-box;`;
}


function setFixedBottomStyle(node, bottom, left, width, cssText) {
    node.style.cssText = `${cssText} position: fixed; bottom: ${bottom}px; left: ${left}px; width: ${width}px; box-sizing: border-box;`;
}


function setRelativeTopStyle(node, top, cssText) {
    if (top > 0) node.style.cssText = `${cssText} position: relative; top: ${top}px;`;
}


function stickyBlock(node, opts) {
    setID(node);
    opts = opts || {};
    const customTop = opts.top || 0;
    const customBottom = opts.bottom || 0;
    const customIndent = opts.indent || 0;
    const className = node.className || '';
    const cssText = node.style.cssText;
    const parsedCssText = parsedCSSText(cssText);
    const classNameActive = opts.classActive ? `${className} ${opts.classActive}`.trim() : className;
    const classNameActiveSticky = opts.classSticky ? `${classNameActive} ${opts.classSticky}`.trim() : classNameActive;
    const relativeNode = getRelativeNode(node, opts.relative);
    const rootNode = document.documentElement;
    const bodyNode = document.body;
    const cloneNode = document.createElement('div');
    const list = relativeNode ? [node, cloneNode, bodyNode, relativeNode] : [node, cloneNode, bodyNode];
    let lastCloneTop = cloneNode.getBoundingClientRect().top;
    let windowHeight = window.innerHeight || rootNode.clientHeight || bodyNode.clientHeight;
    let relativePaddingBottom = parseFloat(getCurrentStyle(relativeNode || bodyNode, 'padding-bottom')) || 0;
    let relativeBorderBottom = parseFloat(getCurrentStyle(relativeNode || bodyNode, 'border-bottom-width')) || 0;
    let maxTop = getMaxTop(node, cloneNode, relativeNode || bodyNode, relativePaddingBottom, relativeBorderBottom);

    setHeightStyle(cloneNode, 0);
    node.parentNode.insertBefore(cloneNode, node);

    const setPosition = () => {
        const nodeBox = node.getBoundingClientRect();
        const nodeHeight = nodeBox.bottom - nodeBox.top;
        const cloneBox = cloneNode.getBoundingClientRect();
        const absCloneTop = Math.abs(cloneBox.top);

        // sticky block become static
        if (cloneBox.top >= customTop || !maxTop) {
            if (cssText) {
                node.style.cssText = cssText;
            } else {
                node.removeAttribute('style');
            }
            node.className = className;
            setHeightStyle(cloneNode, 0);
        // sticky block height bigger than container height
        } else if (nodeHeight > windowHeight) {
            if (cloneBox.top <= lastCloneTop) {
                // downscroll
                if (nodeBox.top <= customTop &&
                    Math.abs(nodeBox.top) >= nodeHeight - windowHeight + customBottom &&
                    absCloneTop < maxTop + nodeHeight - windowHeight + customBottom - customIndent
                ) {
                    setHeightStyle(cloneNode, nodeHeight);
                    setFixedBottomStyle(node, customBottom, cloneBox.left, cloneBox.right - cloneBox.left, parsedCssText);
                    node.className = classNameActiveSticky;
                } else if (absCloneTop >= maxTop + nodeHeight - windowHeight + customBottom - customIndent) {
                    setHeightStyle(cloneNode, 0);
                    setRelativeTopStyle(node, maxTop - customIndent, parsedCssText);
                    node.className = classNameActive;
                } else {
                    setHeightStyle(cloneNode, 0);
                    setRelativeTopStyle(node, Math.abs(cloneBox.top - nodeBox.top), parsedCssText);
                    node.className = classNameActive;
                }
            } else {
                // upscroll
                if (nodeBox.top < customTop) {
                    setHeightStyle(cloneNode, 0);
                    setRelativeTopStyle(node, Math.abs(cloneBox.top - nodeBox.top), parsedCssText);
                    node.className = classNameActive;
                } else if (absCloneTop < maxTop + nodeHeight - windowHeight - customTop) {
                    node.className = classNameActiveSticky;
                    setHeightStyle(cloneNode, nodeHeight);
                    setFixedTopStyle(node, customTop, cloneBox.left, cloneBox.right - cloneBox.left, parsedCssText);
                }
            }
            lastCloneTop = cloneBox.top;
        // sticky block height smaller than container height
        } else if (absCloneTop < maxTop - customTop - customIndent) {
            node.className = classNameActiveSticky;
            setHeightStyle(cloneNode, nodeHeight);
            setFixedTopStyle(node, customTop, cloneBox.left, cloneBox.right - cloneBox.left, parsedCssText);
        } else {
            node.className = classNameActive;
            setHeightStyle(cloneNode, 0);
            setRelativeTopStyle(node, maxTop - customIndent, parsedCssText);
        }
    };

    addEvent(window, 'scroll', setPosition);
    addEvent(window, 'resize', () => {
        windowHeight = window.innerHeight || rootNode.clientHeight || bodyNode.clientHeight;
        setPosition();
    });
    resizeSensor(list, () => {
        relativePaddingBottom = parseFloat(getCurrentStyle(relativeNode || bodyNode, 'padding-bottom')) || 0;
        relativeBorderBottom = parseFloat(getCurrentStyle(relativeNode || bodyNode, 'border-bottom-width')) || 0;
        maxTop = getMaxTop(node, cloneNode, relativeNode || bodyNode, relativePaddingBottom, relativeBorderBottom);
        setPosition();
    });
}


module.exports = stickyBlock;
