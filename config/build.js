import banner from './banner'
import rollup from 'rollup'
import babel from '@rollup/plugin-babel'
import pack from '../package.json'


async function build (dev = false) {
  const bundle = await rollup.rollup({
    input: 'src/index.js',
    external: ['load-script'],
    plugins: [
      babel({
        babelHelpers: 'bundled',
        presets: [["@babel/preset-env", { "modules": false }]]
      })
    ],
  })

  await bundle.write({
    format: 'umd',
    name: classify(pack.name),
    file: `dist/${pack.name}.js`,
    banner: banner
  })
}

build()

function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

const classifyRE = /(?:^|[-_/])(\w)/g
function classify (str) {
  return str.replace(classifyRE, toUpper)
}
