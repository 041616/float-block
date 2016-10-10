var RESET_CLONE_STYLES = 'position: absolute; width: 0; height: 0;';


var addEvent = function(el, nm, cb) {
    if (el.attachEvent) {
        el.attachEvent('on' + nm, cb);
    } else {
        el.addEventListener(nm, cb);
    }
};


var StickyBlockImpl = function StickyBlockImpl(node, opts) {
    var getRelativeNode = function getRelativeNode(classname) {
        if (!classname) return null;
        var nodeList = document.querySelectorAll('.' + classname);
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].querySelector('#' + node.id)) return nodeList[i];
        }
        return null;
    };

    var rootNode = document.documentElement;
    var bodyNode = document.body;
    var cloneNode = document.createElement('span');
    var className = node.className;
    var classActive = opts.Classactive ? className + ' ' + opts.Classactive : className;
    var relativeNode = getRelativeNode(opts.Relative);
    var list = [node, cloneNode, rootNode];
    if (relativeNode) list.push(relativeNode);
    var lastScrollTop = 0;

    var getMaxTop = function getMaxTop() {
        var box = node.getBoundingClientRect();
        var cloneBox = cloneNode.getBoundingClientRect();
        var relativeBox = (relativeNode || rootNode).getBoundingClientRect();
        if (relativeBox.bottom - cloneBox.top > box.bottom - box.top) {
            return relativeBox.bottom - cloneBox.top - (box.bottom - box.top);
        }
        return 0;
    };

    cloneNode.style.cssText = RESET_CLONE_STYLES;
    node.parentNode.insertBefore(cloneNode, node);

    var onScroll = function onScroll() {
        var currScrollTop = window.pageYOffset || rootNode.scrollTop || bodyNode.scrollTop;
        var maxTop = getMaxTop();
        var nodeBox = node.getBoundingClientRect();
        var nodeHeight = nodeBox.bottom - nodeBox.top;
        var windowHeight = window.innerHeight || rootNode.clientHeight || bodyNode.clientHeight;
        var cloneBox = cloneNode.getBoundingClientRect();
        var absCloneTop = Math.abs(cloneBox.top);
        var absNodeTop = Math.abs(nodeBox.top);

        if (cloneBox.top >= 0 || !maxTop) {
            node.removeAttribute('style');
            node.className = className;
            cloneNode.style.cssText = RESET_CLONE_STYLES;
        } else if (nodeHeight > windowHeight) {
            node.className = classActive;
            if (currScrollTop >= lastScrollTop) {
                // downscroll
                if (nodeBox.top <= 0 && absNodeTop >= nodeHeight - windowHeight && absCloneTop < maxTop + nodeHeight - windowHeight) {
                    cloneNode.style.cssText = 'display: block; height: ' + nodeHeight + 'px;';
                    cloneBox = cloneNode.getBoundingClientRect();
                    node.style.cssText = 'position: fixed; top: -' + (nodeHeight - windowHeight) + 'px; left: ' + cloneBox.left + 'px; width: ' + (cloneBox.right - cloneBox.left) + 'px;';
                } else if (absCloneTop >= maxTop + nodeHeight - windowHeight) {
                    cloneNode.style.cssText = RESET_CLONE_STYLES;
                    node.style.cssText = 'position: relative; top: ' + maxTop + 'px;';
                } else {
                    cloneNode.style.cssText = RESET_CLONE_STYLES;
                    node.style.cssText = 'position: relative; top: ' + (absCloneTop - absNodeTop) + 'px;';
                }
            } else {
                // upscroll
                if (nodeBox.top < 0) {
                    cloneNode.style.cssText = RESET_CLONE_STYLES;
                    node.style.cssText = 'position: relative; top: ' + (absCloneTop - absNodeTop) + 'px;';
                } else if (absCloneTop < maxTop + nodeHeight - windowHeight) {
                    cloneNode.style.cssText = 'display: block; height: ' + nodeHeight + 'px;';
                    cloneBox = cloneNode.getBoundingClientRect();
                    node.style.cssText = 'position: fixed; top: 0; left: ' + cloneBox.left + 'px; width: ' + (cloneBox.right - cloneBox.left) + 'px;';
                }
            }
        } else {
            node.className = classActive;
            if (absCloneTop < maxTop) {
                cloneNode.style.cssText = 'display: block; height: ' + nodeHeight + 'px;';
                cloneBox = cloneNode.getBoundingClientRect();
                node.style.cssText = 'position: fixed; top: 0; left: ' + cloneBox.left + 'px; width: ' + (cloneBox.right - cloneBox.left) + 'px;';
            } else {
                node.style.cssText = 'position: relative; top: ' + maxTop + 'px;';
                cloneNode.style.cssText = RESET_CLONE_STYLES;
            }
        }
        lastScrollTop = currScrollTop;
    };

    addEvent(window, 'scroll', onScroll);
    ResizeSensor(list, onScroll);
};
