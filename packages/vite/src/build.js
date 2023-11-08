import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

export async function buildTaxonPages({ appConfig }) {
  const __dirname = fileURLToPath(new URL('../../..', import.meta.url))

  await build({
    root: path.resolve(__dirname),
    ...appConfig
  })
}
