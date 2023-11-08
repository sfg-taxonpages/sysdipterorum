import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('../../', import.meta.url))

export const userTailwindConfigPath = process.cwd() + '/config/vendor/tailwind.config.js'
export const defaultTailwindConfigPath = __dirname + 'tailwind.config.js'
