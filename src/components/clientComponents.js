export function registerOnlyClientComponents(app) {
  const internalComponets = import.meta.glob('@/components/**/*.client.vue', {
    eager: true,
    import: 'default'
  })
  const externalComponents = import.meta.glob('~/components/**/*.client.vue', {
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
      .replace(/\.client.\w+$/, '')

    app.component(componentName, definition)
  })
}
