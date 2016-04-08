const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const NpmInstallPlugin = require('npm-install-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const package = require('./package.json')

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    style: path.join(__dirname, 'app/styles/main.scss')
};

const common = {
    entry: {
        app: PATHS.app,
        style: PATHS.style
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    module: {
        loaders: [
            // ES6 to ES5
            {
                test: /\.jsx?$/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015', 'survivejs-kanban']
                },
                include: PATHS.app
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            template: 'node_modules/html-webpack-template/index.ejs',
            title: 'kanban app',
            appMountId: 'app',
            mobile: true
        })
    ]
};

// default
if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            stats: 'errors-only',
            host: process.env.HOST,
            port: process.env.PORT
        },
        devtool: 'eval-source-map',
        module: {
            loaders: [
                // Sass stylesheets
                {
                    test: /\.scss$/,
                    loaders: ['style', 'css', 'sass'],
                    include: PATHS.app
                }
            ]
        },
        plugins: [
              new webpack.HotModuleReplacementPlugin(),
              new NpmInstallPlugin({
                  save: true
              })
        ]
    });
}

if(TARGET === 'build') {
    module.exports = merge(common, {
        entry: {
            vendor: Object.keys(package.dependencies).filter((v) => v !== 'alt-utils')
        },
        output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
        },
        module: {
            loaders: [
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract('style', 'css!sass'),
                    include: PATHS.app
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin([PATHS.build]),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': '"production"'
            }),
            new ExtractTextPlugin('[name].[chunkhash].css'),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'manifest']
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        ]
    });
}
