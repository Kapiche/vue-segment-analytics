import loadScript from 'load-script'

export default function init (config, callback) {
  if (!config.id || !config.id.length) {
    console.warn('Please enter a Segment.io tracking ID')
    return
  }

  // Create a queue, but don't obliterate an existing one!
  var analytics = window.analytics = window.analytics || []

  // If the real analytics.js is already on the page return.
  if (analytics.initialize) return

  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error('Segment snippet included twice.')
    }
    return
  }

  // Invoked flag, to make sure the snippet
  // is never invoked twice.
  analytics.invoked = true

  // A list of the methods in Analytics.js to stub.
  analytics.methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'pageview',
    'identify',
    'reset',
    'group',
    'track',
    'ready',
    'alias',
    'debug',
    'page',
    'once',
    'off',
    'on'
  ]

  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function (method) {
    return function () {
      var args = Array.prototype.slice.call(arguments)
      if (config.debug === true) {
        if (window.console && console.log) {
          console.log(`[Segment Analytics Debug]: ${method} method called with ${args.length} args`)
        }
      } else {
        args.unshift(method)
        analytics.push(args)
        return analytics
      }
    }
  }

  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = '4.0.0';

  // For each of our methods, generate a queueing stub.
  for (let key of analytics.methods) {
    analytics[key] = analytics.factory(key);
  }

  if (config.debug === false) {
    const source = `https://cdn.segment.com/analytics.js/v1/${config.id}/analytics.min.js`
    loadScript(source, function (error, script) {
      if (error) {
        console.warn('Ops! Is not possible to load Segment Analytics script')
        return
      }

      const poll = setInterval(function () {
        if (!window.analytics) {
          return
        }

        clearInterval(poll)

        // the callback is fired when window.analytics is available and before any other hit is sent
        if (callback && typeof callback === 'function') {
          callback()
        }
      }, 10)
    })
  } else {
    // Still run the callback in debug mode.
    if (callback && typeof callback === 'function') {
      callback()
    }
  }

  return window.analytics
}
