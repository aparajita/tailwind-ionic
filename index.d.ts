declare interface TailWindIonicOptions {
  theme?: string
  abbreviateVariants?: boolean
}

type TailwindIonicPlugin = (options?: string | TailWindIonicOptions) => void

declare const plugin: TailwindIonicPlugin
export = plugin
