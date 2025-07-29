// This file includes polyfills or feature detections to ensure that the animations work correctly in Firefox and Safari.

(function() {
    // Check for requestAnimationFrame support
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback) {
            return setTimeout(callback, 1000 / 60);
        };
    }

    // Check for classList support
    if (!("classList" in document.createElement("div"))) {
        Object.defineProperty(Element.prototype, "classList", {
            get: function() {
                var self = this;
                function update(fn) {
                    return function(value) {
                        var classes = self.className.split(" ");
                        var index = classes.indexOf(value);
                        if (fn === "add" && index === -1) {
                            classes.push(value);
                        } else if (fn === "remove" && index !== -1) {
                            classes.splice(index, 1);
                        }
                        self.className = classes.join(" ");
                    };
                }
                return {
                    add: update("add"),
                    remove: update("remove"),
                    toggle: function(value) {
                        this[value in self.classList ? "remove" : "add"](value);
                    },
                    contains: function(value) {
                        return self.className.split(" ").indexOf(value) !== -1;
                    },
                    item: function(index) {
                        return self.className.split(" ")[index] || null;
                    }
                };
            }
        });
    }

    // Check for SVG support
    if (!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1")) {
        console.warn("SVG is not supported in this browser.");
    }
})();