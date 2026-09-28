/* eslint-disable no-undef */
import { defineConfig, loadEnv } from "vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default ({ mode }) =>
  defineConfig({
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue"],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              // 带 hash 的同源 js / css 构建产物可长缓存；
              // B 站字体 CSS 等固定 URL 外链不在此列，交由浏览器 HTTP 缓存
              urlPattern: /\/assets\/.*\.(js|css)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "js-css-cache",
                expiration: { maxEntries: 60, purgeOnQuotaError: true },
              },
            },
            {
              // 字体：同源产物与 loli.net 按需子集均为内容稳定地址
              urlPattern: /(.*?)\.(woff2|woff|ttf)/,
              handler: "CacheFirst",
              options: {
                cacheName: "font-cache",
                expiration: { maxEntries: 150, purgeOnQuotaError: true },
              },
            },
            {
              // 图片：仅缓存同源产物；外部壁纸源为随机 / 每日图，
              // 固定 URL 会造成壁纸冻结与缓存无限增长，故不做运行时缓存，
              // 离线场景由 Background 组件的超时回退本地壁纸兜底
              urlPattern: /^https?:\/\/[^/]+\/images\/.+\.(png|jpe?g|webp|svg|gif|ico)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "image-cache",
                expiration: { maxEntries: 60, purgeOnQuotaError: true },
              },
            },
          ],
        },
        manifest: {
          name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          short_name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          description: loadEnv(mode, process.cwd()).VITE_SITE_DES,
          display: "standalone",
          start_url: "/",
          theme_color: "#424242",
          background_color: "#424242",
          icons: [
            {
              src: "/images/icon/48.png",
              sizes: "48x48",
              type: "image/png",
            },
            {
              src: "/images/icon/72.png",
              sizes: "72x72",
              type: "image/png",
            },
            {
              src: "/images/icon/96.png",
              sizes: "96x96",
              type: "image/png",
            },
            {
              src: "/images/icon/128.png",
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: "/images/icon/144.png",
              sizes: "144x144",
              type: "image/png",
            },
            {
              src: "/images/icon/192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/images/icon/512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
      viteCompression(),
    ],
    server: {
      port: 3000,
      open: true,
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          // Vite 7 默认使用 sass 现代编译器 API：
          // - @import 已弃用，改用 @use（as * 全局展开成员）
          // - additionalData 的相对路径改为相对各文件解析，故用 @ 别名注入
          additionalData: `@use "@/style/global.scss" as *;`,
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            "vue-vendor": ["vue", "pinia"],
            "element-plus": ["element-plus"],
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
      // 开启 CSS 代码分割
      cssCodeSplit: true,
      // 设置 chunk 大小警告限制
      chunkSizeWarningLimit: 1000,
    },
  });
