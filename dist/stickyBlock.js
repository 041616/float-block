(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["stickyBlock"] = factory();
	else
		root["stickyBlock"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _ResizeSensor = __webpack_require__(1);

	var _ResizeSensor2 = _interopRequireDefault(_ResizeSensor);

	var _GetCurrentStyle = __webpack_require__(2);

	var _GetCurrentStyle2 = _interopRequireDefault(_GetCurrentStyle);

	var _utils = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function setID(node) {
	    if (!node.id) node.id = (0, _utils.guid)();
	}

	function proceedCSSRule(rule) {
	    for (var property in _utils.EXCLUDED_CSS_PROPERTIES_MAP) {
	        if (!_utils.EXCLUDED_CSS_PROPERTIES_MAP.hasOwnProperty(property)) continue;
	        if (_utils.EXCLUDED_CSS_PROPERTIES_MAP[property].test(rule)) return false;
	    }
	    return true;
	}

	function parsedCSSText(cssText) {
	    if (!cssText) return '';
	    var ruleList = cssText.split(';');
	    var parsedRuleList = ruleList.filter(proceedCSSRule);
	    return parsedRuleList.join(';') + ';';
	}

	function getRelativeNode(node, classname) {
	    if (!classname) return null;
	    var nodeList = document.querySelectorAll('.' + classname);
	    for (var i = 0; i < nodeList.length; i++) {
	        if (nodeList[i].querySelector('#' + node.id)) return nodeList[i];
	    }
	    return null;
	}

	function getMaxTop(node, cloneNode, relativeNode, paddingBottom, borderBottom) {
	    var box = node.getBoundingClientRect();
	    var cloneBox = cloneNode.getBoundingClientRect();
	    var relativeBox = relativeNode.getBoundingClientRect();
	    if (relativeBox.bottom - cloneBox.top > box.bottom - box.top) return relativeBox.bottom - cloneBox.top - box.bottom + box.top - borderBottom - paddingBottom;
	    return 0;
	}

	function setHeightStyle(cloneNode, height) {
	    cloneNode.style.cssText = 'height: ' + height + 'px;';
	}

	function setFixedTopStyle(node, top, left, width, cssText) {
	    node.style.cssText = cssText + ' position: fixed; top: ' + top + 'px; left: ' + left + 'px; width: ' + width + 'px; box-sizing: border-box;';
	}

	function setFixedBottomStyle(node, bottom, left, width, cssText) {
	    node.style.cssText = cssText + ' position: fixed; bottom: ' + bottom + 'px; left: ' + left + 'px; width: ' + width + 'px; box-sizing: border-box;';
	}

	function setRelativeTopStyle(node, top, cssText) {
	    if (top > 0) node.style.cssText = cssText + ' position: relative; top: ' + top + 'px;';
	}

	function stickyBlock(node, opts) {
	    setID(node);
	    opts = opts || {};
	    var customTop = opts.top || 0;
	    var customBottom = opts.bottom || 0;
	    var customIndent = opts.indent || 0;
	    var className = node.className || '';
	    var cssText = node.style.cssText;
	    var parsedCssText = parsedCSSText(cssText);
	    var classNameActive = opts.classActive ? (className + ' ' + opts.classActive).trim() : className;
	    var relativeNode = getRelativeNode(node, opts.relative);
	    var rootNode = document.documentElement;
	    var bodyNode = document.body;
	    var cloneNode = document.createElement('div');
	    var list = relativeNode ? [node, cloneNode, bodyNode, relativeNode] : [node, cloneNode, bodyNode];
	    var lastCloneTop = cloneNode.getBoundingClientRect().top;
	    var windowHeight = window.innerHeight || rootNode.clientHeight || bodyNode.clientHeight;
	    var relativePaddingBottom = parseFloat((0, _GetCurrentStyle2.default)(relativeNode || bodyNode, 'padding-bottom')) || 0;
	    var relativeBorderBottom = parseFloat((0, _GetCurrentStyle2.default)(relativeNode || bodyNode, 'border-bottom-width')) || 0;
	    var maxTop = getMaxTop(node, cloneNode, relativeNode || bodyNode, relativePaddingBottom, relativeBorderBottom);

	    setHeightStyle(cloneNode, 0);
	    node.parentNode.insertBefore(cloneNode, node);

	    var setPosition = function setPosition() {
	        var nodeBox = node.getBoundingClientRect();
	        var nodeHeight = nodeBox.bottom - nodeBox.top;
	        var cloneBox = cloneNode.getBoundingClientRect();
	        var absCloneTop = Math.abs(cloneBox.top);

	        if (cloneBox.top >= customTop || !maxTop) {
	            if (cssText) {
	                node.style.cssText = cssText;
	            } else {
	                node.removeAttribute('style');
	            }
	            node.className = className;
	            setHeightStyle(cloneNode, 0);
	        } else if (nodeHeight > windowHeight) {
	            node.className = classNameActive;
	            if (cloneBox.top <= lastCloneTop) {
	                // downscroll
	                if (nodeBox.top <= customTop && Math.abs(nodeBox.top) >= nodeHeight - windowHeight + customBottom && absCloneTop < maxTop + nodeHeight - windowHeight + customBottom - customIndent) {
	                    setHeightStyle(cloneNode, nodeHeight);
	                    setFixedBottomStyle(node, customBottom, cloneBox.left, cloneBox.right - cloneBox.left, parsedCssText);
	                } else if (absCloneTop >= maxTop + nodeHeight - windowHeight + customBottom - customIndent) {
	                    setHeightStyle(cloneNode, 0);
	                    setRelativeTopStyle(node, maxTop - customIndent, parsedCssText);
	                } else {
	                    setHeightStyle(cloneNode, 0);
	                    setRelativeTopStyle(node, Math.abs(cloneBox.top - nodeBox.top), parsedCssText);
	                }
	            } else {
	                // upscroll
	                if (nodeBox.top < customTop) {
	                    setHeightStyle(cloneNode, 0);
	                    setRelativeTopStyle(node, Math.abs(cloneBox.top - nodeBox.top), parsedCssText);
	                } else if (absCloneTop < maxTop + nodeHeight - windowHeight - customTop) {
	                    setHeightStyle(cloneNode, nodeHeight);
	                    setFixedTopStyle(node, customTop, cloneBox.left, cloneBox.right - cloneBox.left, parsedCssText);
	                }
	            }
	            lastCloneTop = cloneBox.top;
	        } else {
	            node.className = classNameActive;
	            if (absCloneTop < maxTop - customTop - customIndent) {
	                setHeightStyle(cloneNode, nodeHeight);
	                setFixedTopStyle(node, customTop, cloneBox.left, cloneBox.right - cloneBox.left, parsedCssText);
	            } else {
	                setHeightStyle(cloneNode, 0);
	                setRelativeTopStyle(node, maxTop - customIndent, parsedCssText);
	            }
	        }
	    };

	    (0, _utils.addEvent)(window, 'scroll', setPosition);
	    (0, _utils.addEvent)(window, 'resize', function () {
	        windowHeight = window.innerHeight || rootNode.clientHeight || bodyNode.clientHeight;
	        setPosition();
	    });
	    (0, _ResizeSensor2.default)(list, function () {
	        relativePaddingBottom = parseFloat((0, _GetCurrentStyle2.default)(relativeNode || bodyNode, 'padding-bottom')) || 0;
	        relativeBorderBottom = parseFloat((0, _GetCurrentStyle2.default)(relativeNode || bodyNode, 'border-bottom-width')) || 0;
	        maxTop = getMaxTop(node, cloneNode, relativeNode || bodyNode, relativePaddingBottom, relativeBorderBottom);
	        setPosition();
	    });
	}

	module.exports = stickyBlock;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _GetCurrentStyle = __webpack_require__(2);

	var _GetCurrentStyle2 = _interopRequireDefault(_GetCurrentStyle);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	    var SENSOR_SIZE = 100000;
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

	            if ((0, _GetCurrentStyle2.default)(element, 'position') == 'static') {
	                element.style.position = 'relative';
	            }

	            var expand = element.resizeSensor.childNodes[0];
	            var expandChild = expand.childNodes[0];
	            var shrink = element.resizeSensor.childNodes[1];

	            var reset = function reset() {
	                expandChild.style.width = SENSOR_SIZE + 'px';
	                expandChild.style.height = SENSOR_SIZE + 'px';
	                expand.scrollLeft = SENSOR_SIZE;
	                expand.scrollTop = SENSOR_SIZE;
	                shrink.scrollLeft = SENSOR_SIZE;
	                shrink.scrollTop = SENSOR_SIZE;
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

	        if (this) {
	            this.detach = function (ev) {
	                ResizeSensor.detach(element, ev);
	            };
	        }
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	(function (root, factory) {
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
	        module.exports = factory();
	    } else {
	        root.getCurrentStyle = factory();
	    }
	})(undefined, function () {
	    var curCSS;
	    var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
	    var rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");
	    if (window.getComputedStyle) {
	        var rmargin = /^margin/;
	        var getStyles = function getStyles(elem) {
	            return window.getComputedStyle(elem, null);
	        };
	        curCSS = function curCSS(elem, name, _computed) {
	            var width;
	            var minWidth;
	            var maxWidth;
	            var computed = _computed || getStyles(elem);
	            var ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;
	            var style = elem.style;
	            if (computed) {
	                if (rnumnonpx.test(ret) && rmargin.test(name)) {
	                    width = style.width;minWidth = style.minWidth;maxWidth = style.maxWidth;
	                    style.minWidth = style.maxWidth = style.width = ret;ret = computed.width;
	                    style.width = width;style.minWidth = minWidth;style.maxWidth = maxWidth;
	                }
	            }
	            return ret;
	        };
	    } else if (document.documentElement.currentStyle) {
	        var rposition = /^(top|right|bottom|left)$/;
	        var getStyles = function getStyles(elem) {
	            return elem.currentStyle;
	        };
	        curCSS = function curCSS(elem, name, _computed) {
	            try {
	                var left;
	                var rs;
	                var rsLeft;
	                var computed = _computed || getStyles(elem);
	                var ret = computed ? computed[name] : undefined;
	                var style = elem.style;
	                if (ret == null && style && style[name]) ret = style[name];
	                if (rnumnonpx.test(ret) && !rposition.test(name)) {
	                    left = style.left;
	                    rs = elem.runtimeStyle;
	                    rsLeft = rs && rs.left;
	                    if (rsLeft) rs.left = elem.currentStyle.left;
	                    style.left = name === "fontSize" ? "1em" : ret;
	                    ret = style.pixelLeft + "px";
	                    style.left = left;
	                    if (rsLeft) rs.left = rsLeft;
	                }
	                return ret === "" ? "auto" : ret;
	            } catch (e) {};
	        };
	    }
	    return curCSS;
	});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.guid = guid;
	exports.addEvent = addEvent;
	var EXCLUDED_CSS_PROPERTIES_MAP = exports.EXCLUDED_CSS_PROPERTIES_MAP = {
	    'position': /([^-]position|^position)/,
	    'top': /([^-]top|^top)/,
	    'left': /([^-]left|^left)/,
	    'bottom': /([^-]bottom|^bottom)/,
	    'width': /([^-]width|^width)/,
	    'box-sizing': /box-sizing/
	};

	function guid() {
	    var s4 = function s4() {
	        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	    };
	    return 'id-' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	function addEvent(node, name, callback) {
	    if (node.attachEvent) {
	        node.attachEvent('on' + name, callback);
	    } else {
	        node.addEventListener(name, callback);
	    }
	}

/***/ })
/******/ ])
});
;