module.exports = {
  chainWebpack: config => {
    config
      .plugin('copy')
      .tap(args => {
        return [
          [{from: 'node_modules/swagger-ui-dist', to: 'swagger-ui'}]
        ]
      })
  }
}
