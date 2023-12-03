/*!
 * vue-segment-analytics v0.5.4
 * (c) 2023 Ryan Stuart
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('load-script')) :
  typeof define === 'function' && define.amd ? define(['load-script'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VueSegmentAnalytics = factory(global.loadScript));
})(this, (function (loadScript) { 'use strict';

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function init(config, callback) {
    if (!config.id || !config.id.length) {
      console.warn('Please enter a Segment.io tracking ID');
      return;
    }

    // Create a queue, but don't obliterate an existing one!
    var analytics = window.analytics = window.analytics || [];

    // If the real analytics.js is already on the page return.
    if (analytics.initialize) return;

    // If the snippet was invoked already show an error.
    if (analytics.invoked) {
      if (window.console && console.error) {
        console.error('Segment snippet included twice.');
      }
      return;
    }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    analytics.invoked = true;

    // A list of the methods in Analytics.js to stub.
    analytics.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug', 'page', 'once', 'off', 'on', 'addSourceMiddleware', 'addIntegrationMiddleware', 'setAnonymousId', 'addDestinationMiddleware'];

    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    analytics.factory = function (method) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        if (config.debug === true) {
          if (window.console && console.log) {
            console.log("[Segment Analytics Debug]: ".concat(method, " method called with ").concat(args.length, " args"));
          }
        } else {
          args.unshift(method);
          analytics.push(args);
          return analytics;
        }
      };
    };

    // Add a version to keep track of what's in the wild.
    analytics.SNIPPET_VERSION = '4.13.2';

    // For each of our methods, generate a queueing stub.
    var _iterator = _createForOfIteratorHelper(analytics.methods),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var key = _step.value;
        analytics[key] = analytics.factory(key);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (config.debug === false) {
      var source = "".concat(config.cdnHost, "/analytics.js/v1/").concat(config.id, "/analytics.min.js");
      loadScript(source, function (error, script) {
        if (error) {
          console.warn('Oops! Is not possible to load Segment Analytics script');
          return;
        }
        var poll = setInterval(function () {
          if (!window.analytics) {
            return;
          }
          clearInterval(poll);

          // the callback is fired when window.analytics is available and before any other hit is sent
          if (callback && typeof callback === 'function') {
            callback();
          }
        }, 10);
      });
    } else {
      // Still run the callback in debug mode.
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
    return window.analytics;
  }

  /**
   * Vue installer
   * @param  {Vue instance} Vue
   * @param  {Object} [options={}]
   */
  function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var config = Object.assign({
      cdnHost: 'https://cdn.segment.com',
      debug: false,
      pageCategory: ''
    }, options);
    if (config.cdnHost.endsWith('/')) {
      config.cdnHost = config.cdnHost.slice(0, -1);
    }
    init(config, function () {});

    // Page tracking
    if (config.router !== undefined) {
      config.router.afterEach(function (to, from) {
        // Make a page call for each navigation event
        window.analytics.page(config.pageCategory, to.name || '', {
          path: to.fullPath,
          referrer: from.fullPath
        });
      });
    }

    // Setup instance access
    Object.defineProperty(Vue, '$segment', {
      get: function get() {
        return window.analytics;
      }
    });
    Object.defineProperty(Vue.prototype, '$segment', {
      get: function get() {
        return window.analytics;
      }
    });
  }
  var index = {
    install: install
  };

  return index;

}));
