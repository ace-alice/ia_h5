const autoprefixer = require('autoprefixer')

const pxToViewport = require('postcss-px-to-viewport')

// noinspection JSValidateTypes
module.exports = {
  plugins: [
    pxToViewport({
      viewportWidth: 375, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
    }),
    autoprefixer(),
  ],
}
