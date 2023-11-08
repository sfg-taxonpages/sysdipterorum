#!/usr/bin/env node
import { fileURLToPath } from 'url'
import { loadConfiguration } from './packages/config/src/index.js'
import { createSSRServer } from './packages/ssr/src/index.js'
import {
  makeViteConfiguration,
  createServer,
  buildTaxonPages
} from './packages/vite/src/index.js'
import yargsParser from 'yargs-parser'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export function start() {
  const port = 6173
  const viteConfiguration = makeViteConfiguration({
    appConfig: loadConfiguration(process.cwd()),
    root: __dirname
  })

  const { _, ...rest } = yargsParser(process.argv.slice(2), {
    boolean: [],
    number: ['port']
  })

  if (_.includes('dev:ssr')) {
    createSSRServer({
      configuration: {
        ...viteConfiguration,
        configFile: false,
        root: __dirname
      }
    }).then(({ app }) =>
      app.listen(port, () => {
        // generateConsoleMessage({ port, url: 'http://localhost' })
      })
    )
  } else if (_.includes('build')) {
    buildTaxonPages({ appConfig: viteConfiguration })
  } else {
    startDevServer()
  }

  async function startDevServer() {
    const devServer = await createServer({
      mode: 'development',
      configFile: false,
      ...viteConfiguration
    })

    await devServer.listen()
    devServer.printUrls()
  }
}

start()
