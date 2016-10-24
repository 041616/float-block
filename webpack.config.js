module.exports = {
    entry: './example/js/index.js',
    output: {
        path: './example/build/js',
        filename: 'index.js'
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
