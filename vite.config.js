import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
// node fs模块
const fs = require('fs');
import path from 'path'
import viteCompression from 'vite-plugin-compression'
var electronList=[{
  entry: 'electron/main.js',
  onstart(args) {
    args.startup()
  },
  vite:{
    build:{
      outDir:'./dist-electron' // electron打包输出的目录
    }
  }
}];

// 被读取electron-api封装文件
const filePath = path.resolve('./electron/renderers');
  //根据文件路径读取文件，返回文件列表
fs.readdir(filePath, function (err, files) {
  if (err) return console.error('Error:(spec)', err)
  files.forEach((filename) => {
    electronList.push({
      entry: "electron/renderers/"+filename,
      onstart(options) {
        options.reload()
      }
    })
  })
})
export default defineConfig({
    plugins: [
        vue(),
        electron(electronList),
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 1025,
          algorithm: 'gzip',
          ext: '.gz',
        }),
    ],
    define: {
      EgVuePath: `"${path.join(__dirname, './resources').replace(/\\/g, '\\\\')}"`
    },
    base:'./',//base 默认为“/”，我这边的测试结果是：只有base为“./”后打包后的exe后才会正常运行
    publicDir: 'public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
})
