import init from './init'

/**
 * Vue installer
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
function install(Vue, options = {}) {
  const config = Object.assign(
    {
      debug: false,
      pageCategory: '',
    },
    options
  )

  let analytics = init(config, () => {})

  // Page tracking
  if (config.router !== undefined) {
    config.router.afterEach((to, from) => {
      if (!analytics && from) {
        // If page is changed before scroll, load segment now.
        config.delayLoad = false
        analytics = init(config, () => {})
      } else {
        // Make a page call for each navigation event
        window.analytics.page(config.pageCategory, to.name || '', {
          path: to.fullPath,
          referrer: from.fullPath,
        })
        console.log('Page Track:', {
          category: config.pageCategory,
          name: to.name || '',
          params: {
            path: to.fullPath,
            referrer: from.fullPath,
          },
        })
      }
    })
  }

  // Setup instance access
  Object.defineProperty(Vue, '$segment', {
    get() {
      return window.analytics
    },
  })
  Object.defineProperty(Vue.prototype, '$segment', {
    get() {
      return window.analytics
    },
  })

  // Send first page
  window.analytics.page(config.pageCategory, to.name || '', {
    path: window.location.pathname,
    referrer: document.referrer,
  })
}

export default { install }
