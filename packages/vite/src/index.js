import { defineConfig } from 'vite'
import { VitePluginRadar } from 'vite-plugin-radar'
import {
  relativeToRouterPlugin,
  variableReplacementPlugin
} from './plugins/markdown/index.js'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import markdownAnchor from 'markdown-it-anchor'
import Vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'
import Pages from 'vite-plugin-pages'

export function makeViteConfiguration({ appConfig, plugins = [], root }) {
  const rootFolder = process.cwd()
  const __dirname = fileURLToPath(new URL('../../..', import.meta.url))

  return defineConfig({
    root,
    base: appConfig.base_url,
    define: {
      __APP_ENV__: appConfig
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '~': rootFolder + '/'
      }
    },
    cacheDir: resolve(rootFolder, 'node_modules/.cache/vite'),
    optimizeDeps: {
      include: ['leaflet']
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        }
      },
      outDir: resolve(rootFolder, 'dist')
    },
    plugins: [
      Vue({
        include: [/\.vue$/, /\.md$/]
      }),

      Markdown({
        wrapperComponent: 'markdown-layout',
        markdownItSetup(md) {
          md.use(markdownAnchor)
          md.use(variableReplacementPlugin, {
            variables: { ...appConfig }
          })
          md.use(relativeToRouterPlugin, appConfig)
        }
      }),

      Pages({
        dirs: [
          { dir: 'pages', baseRoute: '' },
          { dir: '../../pages', baseRoute: '' }
        ],
        exclude: ['**/components/**/*.vue'],
        extensions: ['vue', 'md'],
        extendRoute(route) {
          if (route.path === '/home') {
            route.alias = '/home'
            route.path = '/'

            return route
          }
        }
      }),

      VitePluginRadar({
        ...appConfig?.analytics_services
      }),

      ...plugins
    ]
  })
}

export { buildTaxonPages } from './build.js'
export { createServer, build } from 'vite'
