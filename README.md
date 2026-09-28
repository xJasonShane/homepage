# 無名の主页

一个基于 Vue 3 + Vite 构建的个人主页(起始页)项目,支持音乐播放器、天气展示、壁纸切换、站点导航等功能。

> 项目基于 [imsyy/home](https://github.com/imsyy/home) 二次开发。

## 技术栈

- [Vue 3](https://cn.vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://cn.vitejs.dev/) - 下一代前端构建工具
- [Pinia](https://pinia.vuejs.org/zh/) - 状态管理
- [Element Plus](https://element-plus.org/zh-CN/) - UI 组件库
- [Swiper](https://swiperjs.com/) - 轮播组件
- [APlayer](https://github.com/DIYgod/APlayer) - 音乐播放器

## 全局快捷键

| 按键 | 功能 |
| ---- | ---- |
| `空格` | 播放 / 暂停音乐 |
| `M` | 切换静音 |
| `B` | 切换壁纸 |
| `S` | 打开 / 关闭设置面板 |
| `Esc` | 关闭弹层 |

## 开发

本地要求 Node.js 20.19+（或 22.12+/24+）,包管理器使用 pnpm(版本由 `package.json` 的 `packageManager` 字段锁定,corepack 会自动启用)。

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 代码检查
pnpm lint:check

# 构建生产版本(输出至 dist/)
pnpm build

# 本地预览构建结果
pnpm preview
```

## 配置

复制 `.env.example` 为 `.env` 并按需修改,主要包括:

- **站点信息**:名称、作者、简介、图标、建站日期、ICP 备案号等
- **天气 Key**:前往[高德开放平台](https://lbs.amap.com/)申请 Web 服务 Key(免费,每日上限 5000 次);留空则使用公共 API
- **歌曲 API**:音乐播放器所需的 [Meting API](https://github.com/xizeyoupan/Meting-API) 服务地址,建议自行部署;代码内置了备用公共 API,主 API 失效时会自动回退(公共实例不保证长期可用)
- **社交链接 / 网站链接**:分别在 `src/assets/socialLinks.json` 与 `src/assets/siteLinks.json` 中配置

## Docker 部署

项目自带 Dockerfile(多阶段构建,基于 nginx 托管静态文件),默认映射端口为 `12445`:

```bash
docker compose up -d --build
```

构建完成后访问 `http://localhost:12445` 即可。

## EdgeOne Pages 部署

项目可托管至腾讯云 [EdgeOne Pages](https://edgeone.ai/products/pages),构建命令为 `pnpm build`,输出目录为 `dist`。

高德天气 Key 等敏感信息**不放入代码仓库**,通过部署平台的环境变量在构建时注入:

1. 在 EdgeOne Pages 控制台进入项目 **项目设置 → 环境变量**
2. 添加变量 `VITE_WEATHER_KEY`,值为高德 Web 服务 Key,作用环境选择「生产环境(构建)」
3. 重新触发部署即可

Vite 构建时进程环境变量的优先级高于 `.env` 文件,因此在平台注入的值会生效;仓库内的 `.env.production` 始终保持 `VITE_WEATHER_KEY = ""`,不会包含真实 Key。本地开发则将真实 Key 写入 `.env` 或 `.env.production.local`(两者均已被 `.gitignore` 忽略)。

> 注:该 Key 会随前端构建产物一起下发,属于公开前端可见信息。建议在高德控制台为该 Key 配置**域名白名单**,限制仅本站域名可调用,防止被盗用。若不配置 Key,天气组件会自动回退到备用公共接口。

## 目录结构

```
├── public              # 静态资源(字体、图标等)
├── src
│   ├── api             # 接口请求
│   ├── assets          # 图片、站点链接等配置
│   ├── components      # 通用组件
│   ├── store           # Pinia 状态
│   ├── style           # 全局样式
│   ├── utils           # 工具函数(含全局快捷键)
│   ├── views           # 页面
│   ├── config.js       # 站点配置
│   └── main.js         # 入口
└── .env.example        # 环境变量模板
```

## License

[MIT](./LICENSE)
