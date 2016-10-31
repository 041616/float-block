/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stickyBlock = __webpack_require__(1);

	var _stickyBlock2 = _interopRequireDefault(_stickyBlock);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _stickyBlock2.default)(document.getElementById('float-block'), { classActive: 'float-block_state_active' });

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = stickyBlock;

	var _ResizeSensor = __webpack_require__(2);

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

	function addEvent(node, name, callbak) {
	    if (node.attachEvent) {
	        node.attachEvent('on' + name, callbak);
	    } else {
	        node.addEventListener(name, callbak);
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

	function setFixedStyle(node, top, left, width) {
	    node.style.cssText = 'position: fixed; top: ' + top + 'px; left: ' + left + 'px; width: ' + width + 'px; box-sizing: border-box;';
	}

	function setRelativeStyle(node, top) {
	    node.style.cssText = 'position: relative; top: ' + top + 'px;';
	}

	function stickyBlock(node, opts) {
	    setID(node);
	    opts = opts || {};
	    var customTop = opts.top || 0;
	    var customBottom = opts.bottom || 0;
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
	                if (nodeBox.top <= customTop && absNodeTop >= nodeHeight - windowHeight && absCloneTop < maxTop + nodeHeight - windowHeight - customBottom) {
	                    console.log('1');
	                    setHeightStyle(cloneNode, nodeHeight);
	                    setFixedStyle(node, windowHeight - nodeHeight - customBottom, cloneBox.left, cloneBox.right - cloneBox.left);
	                } else if (absCloneTop >= maxTop + nodeHeight - windowHeight + customBottom) {
	                    console.log('2');
	                    setHeightStyle(cloneNode, 0);
	                    setRelativeStyle(node, maxTop);
	                } else {
	                    console.log('3');
	                    setHeightStyle(cloneNode, 0);
	                    setRelativeStyle(node, Math.abs(cloneBox.top - nodeBox.top));
	                }
	            } else {
	                // upscroll
	                if (nodeBox.top < customTop) {
	                    setHeightStyle(cloneNode, 0);
	                    setRelativeStyle(node, Math.abs(cloneBox.top - nodeBox.top));
	                } else if (absCloneTop < maxTop + nodeHeight - windowHeight - customTop) {
	                    setHeightStyle(cloneNode, nodeHeight);
	                    setFixedStyle(node, customTop, cloneBox.left, cloneBox.right - cloneBox.left);
	                }
	            }
	            lastScrollTop = currScrollTop;
	        } else {
	            node.className = classNameActive;
	            if (absCloneTop < maxTop - customTop - customBottom) {
	                setHeightStyle(cloneNode, nodeHeight);
	                setFixedStyle(node, customTop, cloneBox.left, cloneBox.right - cloneBox.left);
	            } else {
	                setHeightStyle(cloneNode, 0);
	                setRelativeStyle(node, maxTop - customBottom);
	            }
	        }
	    };

	    addEvent(window, 'scroll', onScroll);
	    (0, _ResizeSensor2.default)(list, onScroll);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
	 * directory of this distribution and at
	 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
	 */
	(function (root, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
	        module.exports = factory();
	    } else {
	        root.ResizeSensor = factory();
	    }
	})(undefined, function () {
	    var TIMEOUT_DELAY = 20;
	    var TAGNAMES = ['HTML', 'BODY'];
	    // Only used for the dirty checking, so the event callback count is limted to max 1 call per fps per sensor.
	    // In combination with the event based resize sensor this saves cpu time, because the sensor is too fast and
	    // would generate too many unnecessary events.
	    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (fn) {
	        return window.setTimeout(fn, TIMEOUT_DELAY);
	    };

	    /**
	     * Iterate over each of the provided element(s).
	     *
	     * @param {HTMLElement|HTMLElement[]} elements
	     * @param {Function}                  callback
	     */
	    function forEachElement(elements, callback) {
	        var elementsType = Object.prototype.toString.call(elements);
	        var isCollectionTyped = '[object Array]' === elementsType || '[object NodeList]' === elementsType || '[object HTMLCollection]' === elementsType || 'undefined' !== typeof jQuery && elements instanceof jQuery //jquery
	        || 'undefined' !== typeof Elements && elements instanceof Elements //mootools
	        ;
	        var i = 0,
	            j = elements.length;
	        if (isCollectionTyped) {
	            for (; i < j; i++) {
	                callback(elements[i]);
	            }
	        } else {
	            callback(elements);
	        }
	    }

	    /**
	     * Class for dimension change detection.
	     *
	     * @param {Element|Element[]|Elements|jQuery} element
	     * @param {Function} callback
	     *
	     * @constructor
	     */
	    var ResizeSensor = function ResizeSensor(element, callback) {
	        /**
	         * @constructor
	         */
	        function EventQueue() {
	            var q = [];
	            this.add = function (ev) {
	                q.push(ev);
	            };
	            var i, j;
	            this.call = function () {
	                for (i = 0, j = q.length; i < j; i++) {
	                    q[i].call();
	                }
	            };
	        }

	        /**
	         * @param {HTMLElement} element
	         * @param {String}      prop
	         * @returns {String|Number}
	         */
	        function getComputedStyle(element, prop) {
	            if (element.currentStyle) {
	                return element.currentStyle[prop];
	            } else if (window.getComputedStyle) {
	                return window.getComputedStyle(element, null).getPropertyValue(prop);
	            } else {
	                return element.style[prop];
	            }
	        }

	        /**
	         * @param {HTMLElement} element
	         * @param {Function}    resized
	         */
	        function attachResizeEvent(element, resized) {
	            if (!element.resizedAttached) {
	                element.resizedAttached = new EventQueue();
	                element.resizedAttached.add(resized);
	            } else if (element.resizedAttached) {
	                element.resizedAttached.add(resized);
	                return;
	            }

	            element.resizeSensor = document.createElement('span');
	            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';
	            var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

	            element.resizeSensor.style.cssText = style;
	            element.resizeSensor.innerHTML = '<span style="' + style + '"><span style="' + styleChild + '"></span></span>' + '<span style="' + style + '"><span style="' + styleChild + ' width: 200%; height: 200%"></span></span>';
	            element.appendChild(element.resizeSensor);

	            if (TAGNAMES.indexOf(element.tagName) < 0 && getComputedStyle(element, 'position') == 'static') {
	                element.style.position = 'relative';
	            }

	            var expand = element.resizeSensor.childNodes[0];
	            var expandChild = expand.childNodes[0];
	            var shrink = element.resizeSensor.childNodes[1];

	            var reset = function reset() {
	                expandChild.style.width = 100000 + 'px';
	                expandChild.style.height = 100000 + 'px';
	                expand.scrollLeft = 100000;
	                expand.scrollTop = 100000;
	                shrink.scrollLeft = 100000;
	                shrink.scrollTop = 100000;
	            };

	            reset();

	            var lastWidth, lastHeight;
	            var cachedWidth, cachedHeight; //useful to not query offsetWidth twice

	            var onScroll = function onScroll() {
	                if (element.resizedAttached) {
	                    cachedWidth = element.offsetWidth;
	                    cachedHeight = element.offsetHeight;
	                    if (cachedWidth != lastWidth || cachedHeight != lastHeight) {
	                        requestAnimationFrame(function () {
	                            element.resizedAttached.call();
	                        });
	                        lastWidth = cachedWidth;
	                        lastHeight = cachedHeight;
	                    }
	                }
	                reset();
	            };

	            var addEvent = function addEvent(el, nm, cb) {
	                if (el.attachEvent) {
	                    el.attachEvent('on' + nm, cb);
	                } else {
	                    el.addEventListener(nm, cb);
	                }
	            };

	            addEvent(expand, 'scroll', onScroll);
	            addEvent(shrink, 'scroll', onScroll);
	        }

	        forEachElement(element, function (elem) {
	            attachResizeEvent(elem, callback);
	        });

	        this.detach = function (ev) {
	            ResizeSensor.detach(element, ev);
	        };
	    };

	    ResizeSensor.detach = function (element, ev) {
	        forEachElement(element, function (elem) {
	            if (elem.resizedAttached && typeof ev == "function") {
	                elem.resizedAttached.remove(ev);
	                if (elem.resizedAttached.length()) return;
	            }
	            if (elem.resizeSensor) {
	                if (elem.contains(elem.resizeSensor)) {
	                    elem.removeChild(elem.resizeSensor);
	                }
	                delete elem.resizeSensor;
	                delete elem.resizedAttached;
	            }
	        });
	    };

	    return ResizeSensor;
	});

/***/ }
/******/ ]);