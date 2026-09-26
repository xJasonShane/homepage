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

本地要求 Node.js 20+,包管理器使用 pnpm(版本由 `package.json` 的 `packageManager` 字段锁定,corepack 会自动启用)。

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
- **歌曲 API**:音乐播放器所需的 [Meting API](https://github.com/xizeyoupan/Meting-API) 服务地址,建议自行部署
- **社交链接 / 网站链接**:分别在 `src/assets/socialLinks.json` 与 `src/assets/siteLinks.json` 中配置

## Docker 部署

项目自带 Dockerfile(多阶段构建,基于 nginx 托管静态文件),默认映射端口为 `12445`:

```bash
docker compose up -d --build
```

构建完成后访问 `http://localhost:12445` 即可。

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
