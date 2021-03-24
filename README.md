<p align="center">
 <a href="https://www.npmjs.com/package/vue-segment-analytics">
  <img src="https://img.shields.io/npm/dm/vue-segment-analytics.svg" />
 <a/>
</p>

# vue-segment-analytics

Vue plugin for Segment.io Analytics

## Requirements

Vue ^2.0.0

## TL;DR

```bash
npm install --save-dev vue-segment-analytics
```

```js
import Vue from 'vue'
import VueSegmentAnalytics from 'vue-segment-analytics'

Vue.use(VueSegmentAnalytics, {
  id: 'XXXXX',
  router // Optional
})
```

## Performance Improvements
Inspired by: https://www.gatsbyjs.org/blog/2019-08-30-speed-up-your-time-to-interactive-by-delaying-third-party-scripts/

1. Wait for the user to scroll
2. Do a setTimeout for 1 second
3. Wrap the call in a requestIdleCallback, if supported
4. Then load the script

### Config Options

`delayLoad` - Set to true to enable above improvements. Defaults to `false`

`delayLoadTime` - Time in ms to delay loading script. `delayLoad` must be enabled. Defaults to `1000`

### Known Issues

The above performance options will effect your bounce rate since it won't be detected until segment finishes loading.

## 🚀 Segment Vue Quickstart
Interested in writing analytics code once? With Segment, you can collect customer data from any source (web, mobile, server, CRM, etc.) and send it to over 250+ destinations (Google Analytics, Amplitude, Mixpanel, etc.) via the Segment dashboard. Follow the [tailored guide for Vue](https://github.com/segmentio/analytics-vue) to get setup.
