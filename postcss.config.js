/* postcss 配置文件 */

module.exports = {
    // 配置要使用的 相关插件
    plugins: {
        // 为不同浏览器默认添加前缀，用来兼容不同的浏览器
        /* vue CLi 内部已经配置了（.browerslistrc文件中），这里就不用写了，否则会有警告 */
        // autoprefixer: {
        //     browsers: ['Android >= 4.0', 'iOS >= 8'],
        // },
        // 将 px 转为 rem
        'postcss-pxtorem': {
            rootValue: 37.5,
            propList: ['*']
        }
    }
}