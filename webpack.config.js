module.exports = {
    entry: {
        demo01: './example/js/demo01.js',
        demo02: './example/js/demo02.js',
        demo03: './example/js/demo03.js',
        demo04: './example/js/demo04.js',
        demo05: './example/js/demo05.js'
    },
    output: {
        path: './example/build/js',
        filename: "[name].js",
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
