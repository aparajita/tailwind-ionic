// noinspection JSCheckFunctionSignatures

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

function addGlobalVariants(add) {
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
  let themePaths = []

  if (typeof options === 'string') {
    themePaths = [options]
  } else if (Array.isArray(options)) {
    themePaths = options
  } else if (typeof options === 'object') {
    if (options.theme) {
      themePaths = [options.theme]
    }
  }

  const colors = {}

  if (themePaths.length > 0) {
    for (const themePath of themePaths) {
      try {
        const theme = fs.readFileSync(themePath, 'utf8')
        postcss.parse(theme).walkDecls(/^--ion-/u, (decl) => {
          vars.add(decl.prop)
        })

        vars.forEach((prop) => {
          colors[prop.slice(2)] = `var(${prop})`
        })
      } catch (error) {
        console.error(
          `\n${c.red(
            'error'
          )} [${name}]: Could not parse theme file '${themePath}' (${
            error.message
          })`
        )
      }
    }
  } else {
    console.error(
      `\n${c.red(
        'error'
      )} [${name}]: Theme paths must be a string, an object with a '.theme' property, or an array of those types.`
    )
  }

  return colors
}

module.exports = plugin.withOptions(
  () => {
    return function ({ addVariant, matchVariant }) {
      addGlobalVariants(addVariant)
      addVariant('ion-checked', ['&.checkbox-checked', '&.radio-checked'])
      matchVariant(
        'part',
        (value) => {
          return `&::part(${value})`
        },
        {
          values: {
            arrow: 'arrow',
            backdrop: 'backdrop',
            background: 'background',
            bar: 'bar',
            'bar-active': 'bar-active',
            button: 'button',
            'collapsed-indicator': 'collapsed-indicator',
            'close-icon': 'close-icon',
            container: 'container',
            content: 'content',
            'detail-icon': 'detail-icon',
            expanded: 'expanded',
            handle: 'handle',
            header: 'header',
            icon: 'icon',
            image: 'image',
            indicator: 'indicator',
            'indicator-background': 'indicator-background',
            knob: 'knob',
            mark: 'mark',
            message: 'message',
            native: 'native',
            pin: 'pin',
            placeholder: 'placeholder',
            progress: 'progress',
            scroll: 'scroll',
            separator: 'separator',
            stream: 'stream',
            text: 'text',
            tick: 'tick',
            'tick-active': 'tick-active',
            track: 'track'
          }
        }
      )
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
      'mode-md',
      'ion-checked'
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
