module.exports = {
    entry: {
        'stickyBlock': './src/stickyBlock.js'
    },
    output: {
        path: './dist/',
        filename: "[name].js",
        libraryTarget: 'umd',
        library: 'stickyBlock',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ],
    }
};
