import webpack from 'webpack'

module.exports = {
  entry:"./src/assets/js/app.js",
  output:{
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test:/\.js$/,
        exclude:/node_modules/,
        use: [
          {
            loader:'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ]
  }
}