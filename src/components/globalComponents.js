export function registerGlobalComponents(app) {
  const internalComponets = import.meta.glob('@/components/**/*.global.vue', {
    eager: true,
    import: 'default'
  })
  const externalComponents = import.meta.glob('~/components/**/*.global.vue', {
    eager: true,
    import: 'default'
  })

  setGlobalComponents(
    app,
    Object.assign({}, internalComponets, externalComponents)
  )
}

function setGlobalComponents(app, files) {
  const components = Object.entries(files)

  components.forEach(([path, definition]) => {
    const componentName = path
      .split('/')
      .pop()
      .replace(/\.client.global.\w+$/, '')
      .replace(/\.global.\w+$/, '')

    app.component(componentName, definition)
  })
}
