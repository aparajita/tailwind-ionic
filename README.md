<div class="markdown-body">

# @aparajita/tailwind-ionic&nbsp;&nbsp;[![npm version](https://badge.fury.io/js/@aparajita%2Ftailwind-ionic.svg)](https://badge.fury.io/js/@aparajita%2Ftailwind-ionic)

This plugin for [Tailwind CSS](https://tailwindcss.com/) and [Ionic](https://ionic-framework.com) provides several features:

- Variants which help you to target specific platforms and modes in an Ionic application.
- Ionic CSS theme variables are converted into Tailwind colors.

## Installation

```shell
pnpm add @aparajita/tailwind-ionic
```

If you only want the default variants and no Ionic theme colors, add the plugin to your `tailwind.config.js` file:

```javascript
module.exports = {
  plugins: [require('@aparajita/tailwind-ionic')]
}
```

If you want to configure the behavior, read on.

## Usage

### Variants

The variants in the table below are supported. Variants lower in the list are more specific and are applied after variants higher in the list. This means that a less specific variant applied to a given class will be overridden by a more specific variant applied to the same class.

Note that you cannot combine variants directly, but you can combine the effect of separate variants.

| Variant           | Target                                               |
|:------------------|:-----------------------------------------------------|
| ion-plt-desktop   | Desktop mode                                         |
| ion-plt-mobile    | Mobile-like device (including browser simulations)   |
| ion-plt-mobileweb | Mobile device simulation mode in a browser           |
| ion-plt-native    | Real device using Capacitor                          |
| ion-plt-ios       | iOS device (including browser simulations)           |
| ion-plt-android   | Android device (including browser simulations)       |
| ion-ios           | Element or closest parent is in iOS mode             |
| ion-md            | Element or closest parent is in Material Design mode |

#### Variant options

By default the full variant names as shown above are used. If you would like to use abbreviated variant names without the `ion-` prefix, pass an options object to the plugin:

```javascript
/** @type {import('tailwindcss/types').Config} */
/** @type {import('@aparajita/tailwind-ionic').plugin} */

const ionic = require('@aparajita/tailwind-ionic')

module.exports = {
  plugins: [ionic({
    abbreviatedVariants: true
  })]
}
```

#### Examples (with abbreviated variant names)

```html
<!-- BAD. Can't combine these variants with others directly. -->
<ion-label class="plt-native:plt-ios:text-ion-color-primary" />

<!-- 
  GOOD. Separate variants combine.
  On a real iOS device, bold blue color. 
  On a real Android device, bold yellow color. 
-->
<ion-label
  class="
  plt-native:font-bold
  plt-ios:text-blue-500
  plt-android:text-yellow-500
"
/>

<!-- GOOD. More specific variant overrides. On a real iOS device, red color. -->
<ion-label class="plt-native:text-blue-500 plt-ios:text-red-500" />
```

### Theme colors

If you pass the plugin a valid path to a CSS file containing Ionic theme variables, they are converted into Tailwind theme colors.

```javascript
/** @type {import('tailwindcss/types').Config} */
/** @type {import('@aparajita/tailwind-ionic').plugin} */

const ionic = require('@aparajita/tailwind-ionic')

module.exports = {
  plugins: [ionic('src/theme/variables.css')]
}
```

You may also pass the path as a `.theme` property of an options object, which you will need to do if you also want to set the `abbreviatedVariant` option. 

```javascript
/** @type {import('tailwindcss/types').Config} */
/** @type {import('@aparajita/tailwind-ionic').plugin} */

const ionic = require('@aparajita/tailwind-ionic')

module.exports = {
  plugins: [ionic({
    theme: 'src/theme/variables.css',
    abbreviatedVariants: true
  })]
}
```

#### Example

If the file `variables.css` is this:

```css
/** Ionic CSS Variables **/
:root {
  /** primary **/
  --ion-color-primary: #3880ff;
  --ion-color-primary-rgb: 56, 128, 255;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #3171e0;
  --ion-color-primary-tint: #4c8dff;

  /* ...lots more */
}
```

then your effective Tailwind config ends up being this:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // ...whatever colors you have in your tailwind.config.js
        
        'ion-color-primary': 'var(--ion-color-primary)',
        'ion-color-primary-rgb': 'var(--ion-color-primary-rgb)',
        'ion-color-primary-contrast': 'var(--ion-color-primary-contrast)',
        'ion-color-primary-contrast-rgb': 'var(--ion-color-primary-contrast-rgb)',
        'ion-color-primary-shade': 'var(--ion-color-primary-shade)',
        'ion-color-primary-tint': 'var(--ion-color-primary-tint)',
        // ...and so on
      }
    }
  }
}
```

Because the variables are part of the color palette, they are added into all of the Tailwind color utilities: text, bg, border, etc.

```html
<ion-label class="text-ion-color-primary">My label</ion-label>
<span class="text-ion-color-success">Success!</span>
<div class="bg-ion-color-background">
  <!-- content -->
</div>
<div class="border-ion-color-tertiary-tint">
  <!-- content -->
</div>
```

</div>
