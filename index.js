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
  'ios',
  'md'
]

function addVariants(add) {
  variants.forEach((variant) => {
    const parts = variant.split(':')
    const name = `ion-${parts[0]}`
    let selector = `${parts[1] || parts[0]}`

    if (selector.startsWith('plt-')) {
      selector = `html.${selector} &`
    } else {
      selector = `.${selector} &`
    }

    add(name, selector)
  })
}

function getThemeColors(themePath) {
  const vars = new Set()

  if (typeof themePath === 'string') {
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
  function () {
    return function ({ addVariant }) {
      addVariants(addVariant)
    }
  },
  function (themePath) {
    return {
      theme: {
        extend: {
          colors: themePath ? getThemeColors(themePath) : {}
        }
      },
      variantOrder: [
        'ion-plt-desktop',
        'ion-plt-mobile',
        'ion-plt-mobileweb',
        'ion-plt-native',
        'ion-plt-ios',
        'ion-plt-android',
        'ion-ios',
        'ion-md'
      ]
    }
  }
)
