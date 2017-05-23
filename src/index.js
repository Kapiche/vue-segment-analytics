import init from './init'

/**
 * Vue installer
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
function install (Vue, options = {}) {
  const config = Object.assign({
    debug: false
  }, options)

  let analytics = init(config, () => {
    if (config.router !== undefined) {
      config.router.afterEach((to, from) => {
        // Make a page call for each navigation event
        window.analytics.page(to.name || '', {
          path: to.fullPath,
          referrer: from !== undefined ? from.fullPath : ''
        })
      })
    }
  })

  Vue.prototype.$segment = Vue.$segment = analytics
}

export default { install }
