(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.getCurrentStyle = factory();
    }
}(this, function () {
    var curCSS;
    var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
    var rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");
    if (window.getComputedStyle) {
        var rmargin = /^margin/;
        var getStyles = function(elem) {return window.getComputedStyle(elem, null)};
        curCSS = function(elem, name, _computed) {
            var width;
            var minWidth;
            var maxWidth;
            var computed = _computed || getStyles(elem);
            var ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;
            var style = elem.style;
            if (computed) {
                if (rnumnonpx.test(ret) && rmargin.test(name)) {
                    width = style.width; minWidth = style.minWidth; maxWidth = style.maxWidth;
                    style.minWidth = style.maxWidth = style.width = ret; ret = computed.width;
                    style.width = width; style.minWidth = minWidth; style.maxWidth = maxWidth
                }
            }
            return ret;
        }
    } else if (document.documentElement.currentStyle) {
        var rposition = /^(top|right|bottom|left)$/;
        var getStyles = function(elem) {return elem.currentStyle};
        curCSS = function(elem, name, _computed) {
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
            } catch(e) {};
        }
    }
    return curCSS;
}));
