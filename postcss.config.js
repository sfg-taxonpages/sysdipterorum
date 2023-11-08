import fs from 'fs'
import {
  userTailwindConfigPath,
  defaultTailwindConfigPath
} from './src/constants/configPaths.js'

export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {
      config: fs.existsSync(userTailwindConfigPath)
        ? userTailwindConfigPath
        : defaultTailwindConfigPath
    },
    autoprefixer: {}
  }
}
