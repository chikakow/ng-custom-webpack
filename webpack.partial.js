const webpack = require('webpack');
const path = require('path');
//   entry: {
//         root: './src/main.ts'
//     },

module.exports = {
  
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist/testapp')
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                refundsmanagement: {
                    test: /[\\/]src[\\/]app[\\/]fis-reconcile[\\/]refundsmanagement[\\/]/,
                    minSize: 0 // remove this for real app
                }
            }
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            "VERSION": JSON.stringify("4711")
        })
    ]
}

// export default {
//   pre() {
//       console.debug('pre');
//   },
//   config(cfg) {
//       console.debug('config');
//       return cfg;
//   },
//   post() {
//       console.debug('post');
//   }
// }