module.exports = {
    entry: './scripts/index.js',
    output: {
        filename: 'index.js'
    },
    node: {
        net: 'empty',
        tls: 'empty',
        dns: 'empty',
        fs: 'empty'
      }
}