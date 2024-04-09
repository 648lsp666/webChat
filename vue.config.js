module.exports = {
  runtimeCompiler: true,
  lintOnSave : false,
  publicPath: '/',
  //只有Https才能使用录音
  devServer : {
    https : true,
    port : 8080,
    watchOptions: {
      poll: true
    }
  }
}
