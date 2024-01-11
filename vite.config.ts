// import fs from "node:fs";
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import dayjs from 'dayjs'
import pkg from './package.json'
import createVitePlugins from './vite/plugins'

// https://vitejs.dev/config/
export default ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  // 全局 scss 资源
  const scssResources = []

  return defineConfig({
    base: '/',
    // 开发服务器选项 https://cn.vitejs.dev/config/#server-options
    server: {
      open: true,
      port: 9020,
      proxy: {
        '/proxy': {
          target: env.VITE_APP_API_BASEURL,
          changeOrigin: command === 'serve' && env.VITE_OPEN_PROXY === 'true',
          rewrite: path => path.replace(/\/proxy/, ''),
        },
        '/api': {
          target: env.VITE_APP_API_BASEURL,
          changeOrigin: true,
          rewrite: path => path.replace(/\/api/, ''),
        },
      },
    },
    // 构建选项 https://cn.vitejs.dev/config/#server-fsserve-root
    build: {
      outDir: mode === 'production' ? 'gametob_h5' : `gametob_h5_${mode}`,
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
      assetsDir: 'assets',
      minify: 'terser',
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks(id: any): string {
            if (id.includes('assets')) {
              return 'assets'
            }
          },
        },
      },
      target: ['es2015', 'ios11'],
    },
    define: {
      __SYSTEM_INFO__: JSON.stringify({
        pkg: {
          version: pkg.version,
          dependencies: pkg.dependencies,
          devDependencies: pkg.devDependencies,
        },
        lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      }),
    },
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: scssResources.join(''),
        },
      },
    },
  })
}
