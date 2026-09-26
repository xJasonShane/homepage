# 构建应用
FROM node:20-alpine AS builder
WORKDIR /app
# 先复制锁文件以利用层缓存
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm install -g pnpm@11 && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# 静态托管
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
