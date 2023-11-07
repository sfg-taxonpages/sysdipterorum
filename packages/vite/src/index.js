import { defineConfig } from 'vite'
import { VitePluginRadar } from 'vite-plugin-radar'
import path from 'path'
import Vue from '@vitejs/plugin-vue'
import Markdown from 'vite-plugin-md'
import markdownAnchor from 'markdown-it-anchor'
import {
  relativeToRouterPlugin,
  variableReplacementPlugin
} from '../../../src/plugins/markdown/index.js'
import Pages from 'vite-plugin-pages'
import '../../../src/utils/globalVars.js'

export function makeViteConfiguration(configuration) {
  const rootFolder = process.cwd()

  return defineConfig({
    base: configuration.base_url,
    define: {
      __APP_ENV__: configuration
    },
    resolve: {
      alias: {
        '@': path.resolve(rootFolder, './src'),
        '#': path.resolve(rootFolder, '/')
      }
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
            variables: { ...configuration }
          })
          md.use(relativeToRouterPlugin, configuration)
        }
      }),

      Pages({
        dirs: 'pages',
        exclude: ['**/components/*.vue'],
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
        ...configuration?.analytics_services
      })
    ]
  })
}
