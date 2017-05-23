/*!
 * vue-segment-analytics v0.1.0
 * (c) 2017 Ryan Stuart
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('load-script')) :
	typeof define === 'function' && define.amd ? define(['load-script'], factory) :
	(global.VueSegmentAnalytics = factory(global.loadScript));
}(this, (function (loadScript) { 'use strict';

loadScript = 'default' in loadScript ? loadScript['default'] : loadScript;

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
  analytics.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug', 'page', 'once', 'off', 'on'];

  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function (method) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      console.log(`Hit segment stub for ${method}`);
      if (config.debug === true) {
        if (window.console && console.log) {
          console.log(`[Segment Analytics Debug]: ${method} method called with ${args.length} args`);
        }
      } else {
        args.unshift(method);
        analytics.push(args);
        return analytics;
      }
    };
  };

  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = '4.0.0';

  // For each of our methods, generate a queueing stub.
  for (let key of analytics.methods) {
    analytics[key] = analytics.factory(key);
  }

  if (config.debug === false) {
    const source = `https://cdn.segment.com/analytics.js/v1/${config.id}/analytics.min.js`;
    loadScript(source, function (error, script) {
      if (error) {
        console.warn('Ops! Is not possible to load Segment Analytics script');
        return;
      }

      const poll = setInterval(function () {
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
function install(Vue, options = {}) {
  const config = Object.assign({
    debug: false,
    pageCategory: ''
  }, options);

  let analytics = init(config, () => {
    // Page tracking
    if (config.router !== undefined) {
      config.router.afterEach((to, from) => {
        // Make a page call for each navigation event
        window.analytics.page(config.pageCategory, to.name || '', {
          path: to.fullPath,
          referrer: from.fullPath
        });
      });
    }
  });

  // Setup instance access
  Object.defineProperty(Vue, '$segment', {
    get() {
      return window.analytics;
    }
  });
  Object.defineProperty(Vue.prototype, '$segment', {
    get() {
      return this._segment || window.analytics;
    },
    set(val) {
      this._segment = val;
    }
  });
  Vue.mixin({
    beforeCreate: function () {
      this.$segment = window.analytics || analytics;
    }
  });
}

var index = { install };

return index;

})));
