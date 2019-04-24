const webpack = require('webpack');

module.exports = {
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