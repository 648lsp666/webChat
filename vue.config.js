const webpack = require('webpack');
const path = require('path');
const os = require('os');
const { rules } = require('./.eslintrc');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 构建时间统计插件

const threads = os.cpus().length;
console.log('编译线程数', threads);

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('thread-loader')
      .loader('thread-loader')
      .options({
        workers: threads
      })
      .end();
    config.module
      .rule('js')
      .use('thread-loader')
      .loader('thread-loader')
      .options({
        workers: threads
      })
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .exclude
      .add(/node_modules/)
      .end();

      if (process.env.NODE_ENV === 'production') {
        config.optimization.minimizer('terser').tap((args) => {
          args[0].parallel = threads;
          args[0].terserOptions.compress.warnings = true;
          args[0].terserOptions.compress.drop_debugger = true;
          args[0].terserOptions.compress.drop_console = true;
          return args;
        });
      }
    config.optimization.runtimeChunk(true).splitChunks({
        chunks: 'all',
        // 重复打包问题
        cacheGroups: {
          vendors: {
            chunks: 'all',
          }
        }
      });
  },
  configureWebpack: {
    cache: {
      // 使用文件缓存，加速二次构建
      type: 'filesystem'
    },
    plugins:[
      new BundleAnalyzerPlugin ()
    ],
  },
  runtimeCompiler: true,
  lintOnSave : false,
  publicPath: '/',
  //只有Https才能使用录音
  productionSourceMap:false,
  devServer : {
    https : true,
    port : 8080,
    watchOptions: {
      poll: true
    },
  },
}
