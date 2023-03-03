const fs = require('fs')
const c = require('ansi-colors')
const plugin = require('tailwindcss/plugin')
const postcss = require('postcss')
const { name } = require('./package.json')

const variants = [
  'plt-desktop',
  'plt-mobile',
  'plt-mobileweb',
  'plt-native:plt-capacitor',
  'plt-ios',
  'plt-android',
  'mode-ios',
  'mode-md'
]

function addVariants(add) {
  for (const variant of variants) {
    const parts = variant.split(':')
    const variantName = parts[0]
    let selector = parts[1] || parts[0]

    if (selector.startsWith('plt-')) {
      selector = `html.${selector} &`
    } else {
      selector = `html[mode="${selector.split('-')[1]}"] &`
    }

    add(variantName, selector)
  }
}

function getThemeColors(options) {
  const vars = new Set()
  let themePath = ''

  if (typeof options === 'string') {
    themePath = options
  } else if (typeof options === 'object') {
    themePath = options.theme ?? ''
  }

  if (themePath) {
    try {
      const theme = fs.readFileSync(themePath, 'utf8')
      postcss.parse(theme).walkDecls(/^--ion-/u, (decl) => {
        vars.add(decl.prop)
      })

      const colors = {}

      vars.forEach((prop) => {
        colors[prop.slice(2)] = `var(${prop})`
      })

      return colors
    } catch (error) {
      console.error(
        `\n${c.red(
          'error'
        )} [${name}]: Could not parse theme file '${themePath}' (${
          error.message
        })`
      )
    }
  } else {
    console.error(`\n${c.red('error')} [${name}]: Theme path must be a string`)
  }

  return {}
}

module.exports = plugin.withOptions(
  () => {
    return function ({ addVariant }) {
      addVariants(addVariant)
    }
  },
  (options) => {
    const variantOrder = [
      'plt-desktop',
      'plt-mobile',
      'plt-mobileweb',
      'plt-native',
      'plt-ios',
      'plt-android',
      'mode-ios',
      'mode-md'
    ]

    return {
      theme: {
        extend: {
          colors: options ? getThemeColors(options) : {}
        }
      },
      variantOrder
    }
  }
)
