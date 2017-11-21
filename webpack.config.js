/**
 * Created by leizh on 2017/10/25.
 */
//获取目录路径
const path = require('path');
//获取webpack对象
var webpack = require('webpack');
//css单独打包
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//html打包
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 环境变量配置，dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
//根据名字获取Html-webpack-plugin参数配置
var getHtmlConfig = function (name, title) {
    return {
        //html的原始模板
        template: './src/view/' + name + '.html',
        //文件输出目录
        filename: 'view/' + name + '.html',
        favicon: './favicon.ico',
        title: title,
        //true的话就可以不用手写js和css的引入
        inject: true,
        //会在js和css后面加入版本号
        hash: true,
        //不配置的话，默认会把全部chunks都打包进来
        chunks: ['common', name]
    }
};
var config = {
    //这样只能配置一个入口文件
    // entry: './src/app.js',
    //配置多个入口
    entry: {
        //配置webpack-dev-server
        'common': ['./src/page/common/index.js'],
        'index': ['./src/page/index/index.js'],
        'user-login': ['./src/page/user-login/index.js'],
        'manage-product': ['./src/page/manage-product/index.js'],
        'manage-product-detail': ['./src/page/manage-product-detail/index.js'],
        'manage-product-save': ['./src/page/manage-product-save/index.js'],
        'manage-order': ['./src/page/manage-order/index.js'],
        'manage-order-detail': ['./src/page/manage-order-detail/index.js'],
        'manage-category': ['./src/page/manage-category/index.js'],
        'manage-category-add': ['./src/page/manage-category-add/index.js'],
    },
    output: {
        //文件生成的路径
        //这个和下面是一样的意思
        //webpack2.0以后不支持相对路径，所以需要添加_dirname
        path: __dirname + '/dist/',
        // path: './dist/',

        //publicPath : 表示生成的打包文件引用资源的域名，在正式环境下需要修改
        //文件访问的路径,不设置的话webpack-dev-server无法热编译
        //最后的斜杠需要添加，默认js和css文件会自动添加，但是url-loader是不会自动添加的
        // publicPath: '/dist/',
        publicPath: 'dev' === WEBPACK_ENV ? '/dist/' : '//s.rayhahah.com/Raymalladmin/dist/',
        //硬编码目标文件无法做到输出多个文件
        // filename: 'app.js'
        //这样就会根据入口的名字来对应生成目标文件，ps：webpack不会删除之前的文件
        filename: 'js/[name].js'
    },
    externals: {
        'jquery': 'window.jQuery'
    },
    module: {
        loaders: [
            //探测到css结尾的，就用css-loader处理，顺序是css-loader处理的结果再给style-loader
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass')
            },
            //探测所有图片资源，limit的作用是当大小小于100则会打成base64，否则就会放到资源文件夹里面
            //指定名字并且保留扩展名
            {test: /\.(gif|png|jpg|woff|svg|ttf|eot)\??.*$/, loader: 'url-loader?limit=100&name=resource/[name].[ext]'},
            //添加模板的loader支持
            {
                test: /\.string$/,
                loader: 'html-loader',
                query: {
                    //加载文件时做最小化压缩
                    minimize: true,
                    //指定是否删除属性的""引号
                    //不删除的话会和hogan发生冲突
                    removeAttributeQuotes: false
                }
            },
            //引入本地未模块化的js文件
            {
                test: require.resolve('./src/util/jqpaginator.min.js'),
                loader: 'exports-loader?window.anno!script-loader'
            },
            {
                test: require.resolve('./src/util/ajaxfileupload.js'),
                loader: 'exports-loader?window.anno!script-loader'
            }
        ]
    },
    resolve: {
        //配置别名，__dirname表示根目录
        alias: {
            node_modules: __dirname + '/node_modules',
            util: __dirname + '/src/util',
            page: __dirname + '/src/page',
            view: __dirname + '/src/view',
            service: __dirname + '/src/service',
            image: __dirname + '/src/image'
        }
    },
    plugins: [
        //独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            //引用的名字,与上面的common对应，形成全局的公共模块
            name: 'common',
            //输出的名字
            filename: 'js/base.js'
        }),
        //webpack-dev-server浏览器自动刷新
        new webpack.HotModuleReplacementPlugin(),
        //css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),
        //项目模板参数
        new HtmlWebpackPlugin(getHtmlConfig('index', '首页')),
        new HtmlWebpackPlugin(getHtmlConfig('user-login', '后台登陆')),
        new HtmlWebpackPlugin(getHtmlConfig('manage-product', '商品管理')),
        new HtmlWebpackPlugin(getHtmlConfig('manage-product-detail', '商品详情')),
        new HtmlWebpackPlugin(getHtmlConfig('manage-product-save', '商品编辑')),
        new HtmlWebpackPlugin(getHtmlConfig('manage-order', '订单管理')),
        new HtmlWebpackPlugin(getHtmlConfig('manage-order-detail', '订单详情')),
        new HtmlWebpackPlugin(getHtmlConfig('manage-category', '品类管理')),
        new HtmlWebpackPlugin(getHtmlConfig('manage-category-add', '新增品类')),
    ],
    devServer: {
        //使用inline模式，而非iframe模式
        inline: true,
        //热部署
        hot: true,
        progress: true
    }
};
if ('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

//输出配置
module.exports = config;