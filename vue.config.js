const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')

module.exports = {
    publicPath: '',//使用相对路径
    productionSourceMap: false,
    indexPath: 'homepage.html',
    configureWebpack: {
        plugins: [
            new HtmlWebpackPlugin({
                title: '主页',
                template: 'public/index.html',
                inlineSource: '.(js|css)$' // embed all javascript and css inline
            }),
            new HtmlWebpackInlineSourcePlugin()
        ]
    }
}
