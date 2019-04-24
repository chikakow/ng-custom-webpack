var merge = require('webpack-merge');
var webpack = require('webpack');

exports.default = {
    config: function(cfg) {
        // var time = new Date().getTime();
        // var pattern = 'getting-started.[name].' + time + '.js';
        // cfg.output.filename = pattern;
        // return cfg;

        const strategy = merge.strategy({
            'plugins': 'prepend'
        });

        return strategy (cfg, {
            plugins: [
                new webpack.BannerPlugin('----- Chikakooooo was here -----')
            ]
        });
    }
}