module.exports = {
    entry: {
        'dist/ResizeSensor': ['./src/ResizeSensor.js'],
        'dist/stickyBlock': ['./src/stickyBlock.js'],
        'example/build/js/demo01': './example/js/demo01.js',
        'example/build/js/demo02': './example/js/demo02.js',
        'example/build/js/demo03': './example/js/demo03.js',
        'example/build/js/demo04': './example/js/demo04.js',
        'example/build/js/demo05': './example/js/demo05.js'
    },
    output: {
        path: './',
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
