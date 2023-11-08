import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import express from 'express'

function makeAppContainer(app = '') {
  return `<div id="app">${app}</div>`
}

export async function createSSRServer({
  configuration = {},
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort
}) {
  const __dirname = path.dirname(
    fileURLToPath(new URL('../..', import.meta.url))
  )
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

  const manifest = isProd
    ? JSON.parse(
        fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8')
      )
    : {}

  const app = express()
  let vite

  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100
        },
        hmr: {
          port: hmrPort
        }
      },
      appType: 'custom',
      ...configuration
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use(
      '/',
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false
      })
    )
  }

  app.use('/ping', async (req, res) => {
    res.status(200).end('')
  })

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      const origin = req.protocol + '://' + req.get('host')

      let template, render
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = indexProd
        render = (await import('./dist/server/entry-server.js')).render
      }

      const [appHtml, appState, preloadLinks, tagMeta, statusCode] =
        await render(url, manifest, origin)
      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-state-->`, appState)
        .replace(`<!--head-tags-->`, tagMeta.headTags)
        .replace(`<!--body-tags-open-->`, tagMeta.bodyTagsOpen)
        .replace(`<!--body-tags-->`, tagMeta.bodyTags)
        .replace(makeAppContainer(), makeAppContainer(appHtml))

      res.status(statusCode).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}
