'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = stickyBlock;

var _ResizeSensor = require('./ResizeSensor.js');

var _ResizeSensor2 = _interopRequireDefault(_ResizeSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function guid() {
    var s4 = function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return 'id-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function setID(node) {
    if (!node.id) node.id = guid();
}

function addEvent(node, name, callback) {
    if (node.attachEvent) {
        node.attachEvent('on' + name, callback);
    } else {
        node.addEventListener(name, callback);
    }
}

function getRelativeNode(node, classname) {
    if (!classname) return null;
    var nodeList = document.querySelectorAll('.' + classname);
    for (var i = 0; i < nodeList.length; i++) {
        if (nodeList[i].querySelector('#' + node.id)) return nodeList[i];
    }
    return null;
}

function getMaxTop(node, cloneNode, relativeNode) {
    var box = node.getBoundingClientRect();
    var cloneBox = cloneNode.getBoundingClientRect();
    var relativeBox = relativeNode.getBoundingClientRect();
    if (relativeBox.bottom - cloneBox.top > box.bottom - box.top) {
        return relativeBox.bottom - cloneBox.top - box.bottom + box.top;
    }
    return 0;
}

function setHeightStyle(cloneNode, height) {
    cloneNode.style.cssText = 'height: ' + height + 'px;';
}

function setFixedTopStyle(node, top, left, width) {
    node.style.cssText = 'position: fixed; top: ' + top + 'px; left: ' + left + 'px; width: ' + width + 'px; box-sizing: border-box;';
}

function setFixedBottomStyle(node, bottom, left, width) {
    node.style.cssText = 'position: fixed; bottom: ' + bottom + 'px; left: ' + left + 'px; width: ' + width + 'px; box-sizing: border-box;';
}

function setRelativeTopStyle(node, top) {
    node.style.cssText = 'position: relative; top: ' + top + 'px;';
}

function stickyBlock(node, opts) {
    setID(node);
    opts = opts || {};
    var customTop = opts.top || 0;
    var customBottom = opts.bottom || 0;
    var customIndent = opts.indent || 0;
    var className = node.className || '';
    var classNameActive = opts.classActive ? (className + ' ' + opts.classActive).trim() : className;
    var relativeNode = getRelativeNode(node, opts.relative);
    var rootNode = document.documentElement;
    var bodyNode = document.body;
    var cloneNode = document.createElement('div');
    var list = relativeNode ? [node, cloneNode, rootNode, relativeNode] : [node, cloneNode, rootNode];
    var lastScrollTop = 0;

    setHeightStyle(cloneNode, 0);
    node.parentNode.insertBefore(cloneNode, node);

    var onScroll = function onScroll() {
        var maxTop = getMaxTop(node, cloneNode, relativeNode || rootNode);
        var nodeBox = node.getBoundingClientRect();
        var nodeHeight = nodeBox.bottom - nodeBox.top;
        var windowHeight = window.innerHeight || rootNode.clientHeight || bodyNode.clientHeight;
        var cloneBox = cloneNode.getBoundingClientRect();
        var absCloneTop = Math.abs(cloneBox.top);
        var absNodeTop = Math.abs(nodeBox.top);

        if (cloneBox.top >= customTop || !maxTop) {
            node.removeAttribute('style');
            node.className = className;
            setHeightStyle(cloneNode, 0);
        } else if (nodeHeight > windowHeight) {
            node.className = classNameActive;
            var currScrollTop = window.pageYOffset || rootNode.scrollTop || bodyNode.scrollTop;
            if (currScrollTop >= lastScrollTop) {
                // downscroll
                if (nodeBox.top <= customTop && absNodeTop >= nodeHeight - windowHeight + customBottom && absCloneTop < maxTop + nodeHeight - windowHeight + customBottom - customIndent) {
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
    (0, _ResizeSensor2.default)(list, onScroll);
}